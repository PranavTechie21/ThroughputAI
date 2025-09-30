import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
import json
import sys
import os

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
preprocessor = joblib.load(os.path.join(models_dir, "preprocessor.joblib"))
model = tf.keras.models.load_model(os.path.join(models_dir, "multi_task_model.h5"))
delay_scaler = joblib.load(os.path.join(models_dir, "delay_scaler.joblib"))
throughput_scaler = joblib.load(os.path.join(models_dir, "throughput_scaler.joblib"))

def predict(input_data):
    df = pd.DataFrame([input_data])
    
    priority_map = {"Low": 1, "Medium": 2, "High": 3}
    df["priority"] = df["priority"].map(priority_map)
    
    df["scheduledArrival"] = df["scheduledArrival"].apply(time_to_minutes)
    df["scheduledDeparture"] = df["scheduledDeparture"].apply(time_to_minutes)
    
    # Ensure all required columns are present
    features = [
        "trainType", "sectionId", "priority", "scheduledArrival", 
        "scheduledDeparture", "platformAvailable", "signalStatus", 
        "trackCapacity", "hour"
    ]
    for col in features:
        if col not in df.columns:
            df[col] = 0 # or some other default value

    df['platformAvailable'] = df['platformAvailable'].astype(int)

    # Reorder columns to match the preprocessor's expectations
    df = df[features]

    # Preprocess the input data
    input_proc = preprocessor.transform(df)
    
    # Make predictions
    pred_delay_scaled, pred_conflict, pred_throughput_scaled = model.predict(input_proc)
    
    # Inverse transform the scaled predictions
    pred_delay = delay_scaler.inverse_transform(pred_delay_scaled)
    pred_throughput = throughput_scaler.inverse_transform(pred_throughput_scaled)
    
    # Prepare the results
    results = {
        "predicted_delay": pred_delay[0][0],
        "predicted_conflict": float(pred_conflict[0][0]),
        "predicted_throughput": pred_throughput[0][0]
    }
    
    return results

if __name__ == "__main__":
    input_json = sys.argv[1]
    input_data = json.loads(input_json)
    prediction = predict(input_data)
    print(json.dumps(prediction))