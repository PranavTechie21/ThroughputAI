# final_train_pipeline.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from scipy import sparse
import joblib
import os

# TensorFlow / Keras
import tensorflow as tf
from tensorflow.keras.layers import Input, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping

# ---------- Helper functions ----------
def safe_time_to_minutes(t):
    # Accepts "HH:MM" strings or pandas NaT/NaN; returns int minutes or np.nan
    try:
        if pd.isna(t):
            return np.nan
        # allow already-int values (assume minutes)
        if isinstance(t, (int, float, np.integer, np.floating)):
            return int(t)
        dt = pd.to_datetime(t, format="%H:%M", errors="coerce")
        if pd.isna(dt):
            # try flexible parsing
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

# ---------- Load & sanitize data ----------
script_dir = os.path.dirname(__file__)
data_path = os.path.join(script_dir, 'train_level_dataset (1).csv')
df = pd.read_csv(data_path)

# Map Priority robustly
priority_map = {"Low": 1, "Medium": 2, "High": 3}
df["Priority"] = df["Priority"].map(priority_map).astype(float)

# Safe time conversion
df["Scheduled_Arrival"] = df["Scheduled_Arrival"].apply(safe_time_to_minutes)
df["Scheduled_Departure"] = df["Scheduled_Departure"].apply(safe_time_to_minutes)

# If Hour column missing, derive from Scheduled_Arrival (minute-of-day // 60)
if "Hour" not in df.columns or df["Hour"].isna().all():
    df["Hour"] = df["Scheduled_Arrival"].apply(lambda x: int(x // 60) if not np.isnan(x) else np.nan)

# Ensure binary and target columns numeric
df["Platform_Avail"] = pd.to_numeric(df["Platform_Avail"], errors="coerce").fillna(0).astype(int)
df["Conflict_Flag"] = pd.to_numeric(df["Conflict_Flag"], errors="coerce").fillna(0).astype(int)

# Targets
target_delay = "Delay_Mins"
target_conflict = "Conflict_Flag"
target_throughput = "Throughput_Target"

# Basic drop or impute for rows missing target
df = df.dropna(subset=[target_delay, target_conflict, target_throughput])

# ---------- Feature engineering ----------
# Use cyclical encoding for hour (sin, cos)
df["Hour_sin"] = np.sin(2 * np.pi * df["Hour"] / 24)
df["Hour_cos"] = np.cos(2 * np.pi * df["Hour"] / 24)

features = [
    "Train_Type", "Section_ID", "Priority",
    "Scheduled_Arrival", "Scheduled_Departure",
    "Platform_Avail", "Signal_Status", "Track_Capacity",
    "Hour_sin", "Hour_cos"
]

X = df[features]
y = df[[target_delay, target_conflict, target_throughput]]

# ---------- Train/Val split ----------
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y[target_conflict]
)

# ---------- Preprocessing pipeline ----------
categorical = ["Train_Type", "Section_ID", "Signal_Status"]
numerical = ["Priority", "Scheduled_Arrival", "Scheduled_Departure", "Track_Capacity", "Hour_sin", "Hour_cos"]
binary = ["Platform_Avail"]

# Build ColumnTransformer directly
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical),
        ("num", StandardScaler(), numerical),
        ("bin", "passthrough", binary)
    ],
    remainder="drop",
    sparse_threshold=0.0  # encourage dense output
)

# Impute missing numeric/categorical BEFORE transform (SimpleImputer)
# For categorical imputation: fill missing with "MISSING"
for c in categorical:
    X_train[c] = X_train[c].fillna("MISSING")
    X_val[c] = X_val[c].fillna("MISSING")

# Numeric impute
for c in numerical + binary:
    imp_val = X_train[c].median() if X_train[c].notna().any() else 0
    X_train[c] = X_train[c].fillna(imp_val)
    X_val[c] = X_val[c].fillna(imp_val)

# Fit-transform
X_train_proc = preprocessor.fit_transform(X_train)
X_val_proc   = preprocessor.transform(X_val)

# Ensure numpy arrays (dense) for Keras
if sparse.issparse(X_train_proc):
    X_train_proc = X_train_proc.toarray()
    X_val_proc = X_val_proc.toarray()

X_train_proc = np.asarray(X_train_proc).astype(np.float32)
X_val_proc = np.asarray(X_val_proc).astype(np.float32)

print("Preprocessed shapes:", X_train_proc.shape, X_val_proc.shape)

# ---------- Optional: scale regression targets (recommended) ----------
delay_scaler = StandardScaler()
throughput_scaler = StandardScaler()

y_train_delay_scaled = delay_scaler.fit_transform(y_train[[target_delay]])
y_val_delay_scaled = delay_scaler.transform(y_val[[target_delay]])

y_train_thru_scaled = throughput_scaler.fit_transform(y_train[[target_throughput]])
y_val_thru_scaled = throughput_scaler.transform(y_val[[target_throughput]])

# We'll train regressions on scaled targets to equalize magnitudes
y_train_model = {
    "delay": y_train_delay_scaled.flatten(),
    "conflict": y_train[target_conflict].values,
    "throughput": y_train_thru_scaled.flatten()
}
y_val_model = {
    "delay": y_val_delay_scaled.flatten(),
    "conflict": y_val[target_conflict].values,
    "throughput": y_val_thru_scaled.flatten()
}

# ---------- Build multitask Keras model ----------
tf.keras.backend.clear_session()

inputs = Input(shape=(X_train_proc.shape[1],), name="inputs")
x = Dense(128, activation="relu", name="dense_128")(inputs)
x = Dropout(0.2, name="dropout_0.2")(x)
x = Dense(64, activation="relu", name="dense_64")(x)

# Heads
delay_output = Dense(1, activation="linear", name="delay")(x)          # regression (scaled)
conflict_output = Dense(1, activation="sigmoid", name="conflict")(x)  # binary prob
throughput_output = Dense(1, activation="linear", name="throughput")(x)  # regression (scaled)

model = Model(inputs=inputs, outputs=[delay_output, conflict_output, throughput_output], name="multi_task_model")

loss_weights = {
    "delay": 1.0,
    "conflict": 5.0,
    "throughput": 1.0
}

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss={
        "delay": "mse",
        "conflict": "binary_crossentropy",
        "throughput": "mse"
    },
    loss_weights=loss_weights,
    metrics={
        "delay": tf.keras.metrics.MeanAbsoluteError(name="mae"),
        "conflict": tf.keras.metrics.AUC(name="auc"),
        "throughput": tf.keras.metrics.MeanAbsoluteError(name="mae")
    }
)

model.summary()

# ---------- Training ----------
early_stop = EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True)

history = model.fit(
    X_train_proc, y_train_model,
    validation_data=(X_val_proc, y_val_model),
    epochs=200,
    batch_size=32,
    callbacks=[early_stop],
    verbose=2
)

# ---------- Save the model and transformers ----------
model.save("multi_task_model.h5")
joblib.dump(preprocessor, 'preprocessor.joblib')
joblib.dump(delay_scaler, 'delay_scaler.joblib')
joblib.dump(throughput_scaler, 'throughput_scaler.joblib')

print("\nModel and transformers saved!")
