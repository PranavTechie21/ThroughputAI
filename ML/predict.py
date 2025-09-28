import pandas as pd
import numpy as np
import sys
import json
import joblib
from scipy import sparse
import tensorflow as tf
from ortools.sat.python import cp_model

def safe_time_to_minutes(t):
    try:
        if pd.isna(t):
            return np.nan
        if isinstance(t, (int, float, np.integer, np.floating)):
            return int(t)
        dt = pd.to_datetime(t, format="%H:%M", errors="coerce")
        if pd.isna(dt):
            dt = pd.to_datetime(t, errors="coerce")
            if pd.isna(dt):
                return np.nan
        return int(dt.hour) * 60 + int(dt.minute)
    except Exception:
        return np.nan

def minutes_to_hhmm(m):
    try:
        m = int(round(float(m)))
        if np.isnan(m):
            return "NaN"
        hh = (m // 60) % 24
        mm = m % 60
        return f"{hh:02d}:{mm:02d}"
    except Exception:
        return "NaN"

def run_train_scheduler(trains, pred_delays, pred_conflicts, pred_throughputs, num_platforms_per_station, time_horizon_end=24*60+240):
    model = cp_model.CpModel()
    start_vars = {}
    platform_vars = {}
    durations = {}

    for train in trains:
        tid = train["train_id"]
        p = int(round(float(pred_delays.get(tid, 0))))
        dur = int(max(1, train["scheduled_departure"] - train["scheduled_arrival"]))
        durations[tid] = dur
        lb = max(0, train["scheduled_arrival"] + p - 5)
        ub = min(time_horizon_end, train["scheduled_arrival"] + p + 5)
        if lb > ub:
            lb, ub = ub, lb
        start_vars[tid] = model.NewIntVar(lb, ub, f"start_{tid}")
        max_platform = int(num_platforms_per_station.get(train.get("station_id", 1), 1))
        platform_vars[tid] = model.NewIntVar(1, max_platform, f"platform_{tid}")

    n = len(trains)
    for i in range(n):
        for j in range(i + 1, n):
            t1 = trains[i]["train_id"]; t2 = trains[j]["train_id"]
            dur1 = durations[t1]; dur2 = durations[t2]

            same = model.NewBoolVar(f"same_{t1}_{t2}")
            model.Add(platform_vars[t1] == platform_vars[t2]).OnlyEnforceIf(same)
            model.Add(platform_vars[t1] != platform_vars[t2]).OnlyEnforceIf(same.Not())

            before = model.NewBoolVar(f"before_{t1}_{t2}")
            model.Add(start_vars[t1] + dur1 <= start_vars[t2]).OnlyEnforceIf([same, before])
            model.Add(start_vars[t2] + dur2 <= start_vars[t1]).OnlyEnforceIf([same, before.Not()])

    objective_terms = []
    for train in trains:
        tid = train["train_id"]
        orig = train["scheduled_arrival"]
        delay_expr = start_vars[tid] - orig
        weight = int(max(1, train.get("priority", 1)))
        objective_terms.append(delay_expr * weight)
        cp = int(round(1000 * float(pred_conflicts.get(tid, 0))))
        if cp > 0:
            objective_terms.append(delay_expr * cp)

    model.Minimize(sum(objective_terms))

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 10.0
    status = solver.Solve(model)

    schedule = {}
    if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
        for train in trains:
            tid = train["train_id"]
            schedule[tid] = {
                "optimized_start": int(solver.Value(start_vars[tid])),
                "platform": int(solver.Value(platform_vars[tid]))
            }
    else:
        return None

    return schedule

def generate_ai_recommendations(trains, optimized_schedule):
    recs = []
    for t in trains:
        tid = t["train_id"]
        if tid not in optimized_schedule:
            continue
        opt = optimized_schedule[tid]
        if t["scheduled_arrival"] != opt["optimized_start"]:
            recs.append(f"Train {tid}: Rescheduled from {minutes_to_hhmm(t['scheduled_arrival'])} -> {minutes_to_hhmm(opt['optimized_start'])} (Platform {opt['platform']})")
        if "platform_id" in t and t["platform_id"] != opt["platform"]:
            recs.append(f"Train {tid}: Platform changed from {t['platform_id']} -> {opt['platform']}")
    return recs

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])

        # Load the model and transformers
        model = tf.keras.models.load_model("multi_task_model.h5", compile=False)
        model.compile(
            optimizer='adam',
            loss={
                "delay": "mse",
                "conflict": "binary_crossentropy",
                "throughput": "mse"
            }
        )
        preprocessor = joblib.load('preprocessor.joblib')
        delay_scaler = joblib.load('delay_scaler.joblib')
        throughput_scaler = joblib.load('throughput_scaler.joblib')

        sample_input = pd.DataFrame([input_data])
        if 'priority' in sample_input.columns:
            sample_input['Priority'] = sample_input['priority']

        # Feature engineering for sample
        sample_input["Hour_sin"] = np.sin(2 * np.pi * sample_input["hour"] / 24)
        sample_input["Hour_cos"] = np.cos(2 * np.pi * sample_input["hour"] / 24)
        sample_input["Scheduled_Arrival"] = sample_input["scheduledArrival"].apply(safe_time_to_minutes)
        sample_input["Scheduled_Departure"] = sample_input["scheduledDeparture"].apply(safe_time_to_minutes)
        sample_input["Train_Type"] = sample_input["trainType"]
        sample_input["Section_ID"] = sample_input["sectionId"]
        sample_input["Platform_Avail"] = sample_input["platformAvailable"]
        sample_input["Signal_Status"] = sample_input["signalStatus"]
        sample_input["Track_Capacity"] = sample_input["trackCapacity"]

        features = [
            "Train_Type", "Section_ID", "Priority",
            "Scheduled_Arrival", "Scheduled_Departure",
            "Platform_Avail", "Signal_Status", "Track_Capacity",
            "Hour_sin", "Hour_cos"
        ]
        sample_X = sample_input[features]

        # Preprocess the input
        sample_proc = preprocessor.transform(sample_X)
        if sparse.issparse(sample_proc):
            sample_proc = sample_proc.toarray()
        sample_proc = np.asarray(sample_proc).astype(np.float32)

        # Make prediction
        pred_delay_scaled, pred_conflict_prob, pred_throughput_scaled = model.predict(sample_proc, verbose=0)

        # Unscale regressions
        pred_delay = delay_scaler.inverse_transform(pred_delay_scaled.reshape(-1, 1))[0, 0]
        pred_throughput = throughput_scaler.inverse_transform(pred_throughput_scaled.reshape(-1, 1))[0, 0]
        pred_conflict_prob = float(pred_conflict_prob[0][0])

        # Run scheduler
        train_id = 101 # or generate a unique id
        sample_trains = [{
            "train_id": train_id,
            "scheduled_arrival": int(sample_input["Scheduled_Arrival"][0]),
            "scheduled_departure": int(sample_input["Scheduled_Departure"][0]),
            "priority": int(sample_input["Priority"][0]),
            "section_id": sample_input["Section_ID"][0],
            "station_id": 1
        }]
        pred_delays = {train_id: float(pred_delay)}
        pred_conflicts = {train_id: float(pred_conflict_prob)}
        pred_throughputs = {sample_input["Section_ID"][0]: float(pred_throughput)}
        num_platforms_per_station = {1: 2}

        optimized_schedule = run_train_scheduler(sample_trains, pred_delays, pred_conflicts, pred_throughputs, num_platforms_per_station)
        ai_recommendations = generate_ai_recommendations(sample_trains, optimized_schedule)

        # Prepare results
        results = {
            "predicted_delay": f"{pred_delay:.2f} mins",
            "predicted_conflict_probability": f"{pred_conflict_prob:.3f}",
            "predicted_throughput": f"{pred_throughput:.2f}",
            "optimized_schedule": optimized_schedule,
            "ai_recommendations": ai_recommendations
        }

        print(json.dumps(results))
    except Exception as e:
        import traceback
        print(f"Error in predict.py: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
