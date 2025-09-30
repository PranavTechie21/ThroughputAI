from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, RootModel
import os
import joblib
import json
import re
import numpy as np
import pandas as pd
import tensorflow as tf

app = FastAPI()

# We'll accept the request body as a plain dict to avoid root-model complexity.


# Utility functions (reuse from predict.py)
def time_to_minutes(t):
    try:
        h, m = map(int, str(t).split(":"))
        return h * 60 + m
    except Exception:
        return 0


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

try:
    preprocessor = joblib.load(os.path.join(MODELS_DIR, "preprocessor.joblib"))
    model = tf.keras.models.load_model(os.path.join(MODELS_DIR, "multi_task_model.h5"), compile=False)
    delay_scaler = joblib.load(os.path.join(MODELS_DIR, "delay_scaler.joblib"))
    throughput_scaler = joblib.load(os.path.join(MODELS_DIR, "throughput_scaler.joblib"))
except Exception as e:
    # If model files are missing, raise at startup so operator knows
    raise RuntimeError(f"Failed to load ML assets: {e}")


def build_input_df(raw):
    train_type = raw.get('trainType') or raw.get('Train_Type') or ''
    train_type = str(train_type).strip().title()

    section = raw.get('sectionId') or raw.get('Section_ID') or ''
    # Normalize section ids like 'sc_1', 'sc-1', 'SC1' into training format 'SEC_01'
    def normalize_section(s):
        s = str(s).strip().upper()
        # direct match like SEC_01
        if s.startswith('SEC_'):
            return s
        # extract first number and format
        m = re.search(r"(\d+)", s)
        if m:
            num = int(m.group(1))
            return f"SEC_{num:02d}"
        return s

    section = normalize_section(section)

    priority = raw.get('priority')
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
        hour = int(hour) % 24
    except Exception:
        hour = 0

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

    return df


@app.post('/predict')
def predict(raw: dict):
    # raw is the JSON payload sent by the client
    try:
        df = build_input_df(raw)
        X = preprocessor.transform(df)
        pred_delay_scaled, pred_conflict, pred_throughput_scaled = model.predict(X)
        pred_delay = delay_scaler.inverse_transform(pred_delay_scaled)
        pred_throughput = throughput_scaler.inverse_transform(pred_throughput_scaled)

        # Build response with both canonical and frontend-expected aliases to preserve compatibility
        pred_delay_val = float(np.asarray(pred_delay)[0][0])
        pred_conf_val = float(np.asarray(pred_conflict)[0][0])
        pred_thru_val = float(np.asarray(pred_throughput)[0][0])

        results = {
            # canonical names
            'predicted_delay': pred_delay_val,
            'predicted_conflict': pred_conf_val,
            'predicted_throughput': pred_thru_val,
            # frontend legacy aliases (some UI components expect these names)
            'predicted_conflict_probability': pred_conf_val,
            'predicted_throughput_value': pred_thru_val,
            # placeholders for optional outputs
            'ai_recommendations': [],
            'optimized_schedule': None
        }

        return {'prediction': results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
