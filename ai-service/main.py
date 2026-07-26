from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest, RandomForestRegressor
import os
import random

app = FastAPI(
    title="EcoTwin AI Service",
    description="Python FastAPI Microservice for Isolation Forest Anomaly Detection and Random Forest Forecasting",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastRequest(BaseModel):
    metric: str = "Electricity"
    timeframeDays: int = 30
    historicalReadings: Optional[List[float]] = None

class AnomalyCheckRequest(BaseModel):
    readings: List[dict]

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "EcoTwin Python AI Engine",
        "models": ["Isolation Forest (Anomaly Detection)", "Random Forest Regressor (Time-Series Forecasting)"]
    }

@app.post("/predict")
def predict_time_series(req: ForecastRequest):
    timeframe = req.timeframeDays
    metric = req.metric

    if not req.historicalReadings or len(req.historicalReadings) < 14:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient historical data for {metric} forecasting. Need at least 14 days, got {len(req.historicalReadings or [])}."
        )

    readings = req.historicalReadings
    n = len(readings)

    # Real features from real data: day index, day-of-week, weekend flag
    X_train = np.array([[i, i % 7, 1 if (i % 7) in [5, 6] else 0] for i in range(n)])
    y_train = np.array(readings)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    X_future = np.array([[n + i, (n + i) % 7, 1 if ((n + i) % 7) in [5, 6] else 0] for i in range(timeframe)])
    predictions = model.predict(X_future)

    forecast_list = []
    total_val = 0
    for idx, val in enumerate(predictions):
        p_val = round(float(val), 1)
        total_val += p_val
        forecast_list.append({
            "day": idx + 1,
            "predictedValue": p_val,
            "lowerBound": round(p_val * 0.92, 1),
            "upperBound": round(p_val * 1.08, 1)
        })

    return {
        "metric": metric,
        "timeframeDays": timeframe,
        "forecast": forecast_list,
        "summaryStats": {
            "expectedTotal": round(total_val, 1),
            "model": "Scikit-Learn Random Forest Regressor",
            "trainedOnDays": n
        }
    }
    
@app.post("/anomalies")
def detect_anomalies(req: AnomalyCheckRequest):
    if not req.readings or len(req.readings) < 3:
        return {"anomalies": []}
        
    df = pd.DataFrame(req.readings)
    feature_cols = [col for col in ['electricityKwh', 'waterLiters', 'carbonKg'] if col in df.columns]
    
    if not feature_cols:
        raise HTTPException(status_code=400, detail="Required telemetry numerical columns missing")
        
    clf = IsolationForest(contamination=0.1, random_state=42)
    df['anomaly_score'] = clf.fit_predict(df[feature_cols])
    
    results = []
    for idx, row in df.iterrows():
        is_anom = bool(row['anomaly_score'] == -1)
        results.append({
            "index": idx,
            "isAnomaly": is_anom,
            "anomalyScore": float(row['anomaly_score']),
            "reason": "Statistically significant deviation from baseline (Isolation Forest)" if is_anom else "Normal"
        })
        
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
