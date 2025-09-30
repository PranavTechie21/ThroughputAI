import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
import json
import sys
import os
import re

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

def time_to_minutes(t):
    try:
        h, m = map(int, t.split(":"))
        return h * 60 + m
    except:
        return 0

# Define paths
base_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(base_dir, "models")

# Load the preprocessor and model
try:
    preprocessor = joblib.load(os.path.join(models_dir, "preprocessor.joblib"))
    # Load model without compiling to avoid deserializing metrics/optimizer that can cause
    # compatibility errors across Keras/TensorFlow versions.
    model = tf.keras.models.load_model(os.path.join(models_dir, "multi_task_model.h5"), compile=False)
    delay_scaler = joblib.load(os.path.join(models_dir, "delay_scaler.joblib"))
    throughput_scaler = joblib.load(os.path.join(models_dir, "throughput_scaler.joblib"))
except Exception as e:
    # Emit a clear error message so the caller (server) can log it and return a helpful response.
    import traceback
    print("ERROR_LOADING_MODEL:\n", str(e))
    traceback.print_exc()
    # Re-raise so the script fails fast when required assets are missing/corrupted.
    raise

def predict(input_data):
    # Build a DataFrame with the exact column names and engineered features
    # that the saved preprocessor expects. The preprocessor used names like
    # Train_Type, Section_ID, Priority, Scheduled_Arrival, Scheduled_Departure,
    # Platform_Avail, Signal_Status, Track_Capacity, Hour_sin, Hour_cos
    raw = dict(input_data)  # copy

    # Normalize / map values
    train_type = raw.get('trainType') or raw.get('Train_Type') or ''
    # normalize to title case (e.g., 'express' -> 'Express')
    train_type = str(train_type).strip().title()

    section = raw.get('sectionId') or raw.get('Section_ID') or ''
    # Normalize section ids to training format SEC_XX
    def normalize_section(s):
        s = str(s).strip().upper()
        if s.startswith('SEC_'):
            return s
        m = re.search(r"(\d+)", s)
        if m:
            num = int(m.group(1))
            return f"SEC_{num:02d}"
        return s

    section = normalize_section(section)

    priority = raw.get('priority')
    # if priority is string like 'High', map to numeric
    priority_map = {"Low": 1, "Medium": 2, "High": 3}
    if isinstance(priority, str):
        priority = priority_map.get(priority.title(), 2)
    try:
        priority = int(priority)
    except Exception:
        priority = 2

    sched_arr = raw.get('scheduledArrival') or raw.get('Scheduled_Arrival') or ''
    sched_dep = raw.get('scheduledDeparture') or raw.get('Scheduled_Departure') or ''
    sched_arr_min = time_to_minutes(sched_arr)
    sched_dep_min = time_to_minutes(sched_dep)

    platform = raw.get('platformAvailable')
    if platform is None:
        platform = raw.get('Platform_Avail', True)
    platform_val = 1 if bool(platform) else 0

    signal = raw.get('signalStatus') or raw.get('Signal_Status') or ''
    signal = str(signal).strip().title()

    track_capacity = raw.get('trackCapacity') or raw.get('Track_Capacity') or 1
    try:
        track_capacity = int(track_capacity)
    except Exception:
        track_capacity = 1

    hour = raw.get('hour')
    try:
        hour = int(hour)
        hour = hour % 24
    except Exception:
        hour = 0

    # cyclical hour features
    angle = 2 * np.pi * hour / 24.0
    hour_sin = np.sin(angle)
    hour_cos = np.cos(angle)

    df = pd.DataFrame([{
        'Train_Type': train_type,
        'Section_ID': section,
        'Priority': priority,
        'Scheduled_Arrival': sched_arr_min,
        'Scheduled_Departure': sched_dep_min,
        'Platform_Avail': platform_val,
        'Signal_Status': signal,
        'Track_Capacity': track_capacity,
        'Hour_sin': hour_sin,
        'Hour_cos': hour_cos
    }])

    # Preprocess the input data
    input_proc = preprocessor.transform(df)
    
    # Make predictions
    pred_delay_scaled, pred_conflict, pred_throughput_scaled = model.predict(input_proc)
    
    # Inverse transform the scaled predictions
    pred_delay = delay_scaler.inverse_transform(pred_delay_scaled)
    pred_throughput = throughput_scaler.inverse_transform(pred_throughput_scaled)
    
    # Prepare the results
    results = {
        # Ensure all values are native Python types (float) so json.dumps works
        "predicted_delay": float(np.asarray(pred_delay)[0][0]),
        "predicted_conflict": float(np.asarray(pred_conflict)[0][0]),
        "predicted_throughput": float(np.asarray(pred_throughput)[0][0])
    }
    
    return results

if __name__ == "__main__":
    input_json = sys.argv[1]
    input_data = json.loads(input_json)
    prediction = predict(input_data)
    print(json.dumps(prediction))