from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import json
from typing import Dict, List, Any
import asyncio
import uvicorn

app = FastAPI(
    title="Symulator Produkcji HMLV API",
    description="API dla webowego symulatora linii produkcyjnych HMLV",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Symulator Produkcji HMLV API", "version": "1.0.0"}

@app.post("/api/simulation/start")
async def start_simulation():
    """Uruchomienie symulacji"""
    return {"status": "started", "message": "Symulacja uruchomiona pomyslnie"}

@app.post("/api/simulation/pause")
async def pause_simulation():
    """Wstrzymanie symulacji"""
    return {"status": "paused", "message": "Symulacja wstrzymana"}

@app.post("/api/simulation/reset")
async def reset_simulation():
    """Reset symulacji"""
    return {"status": "reset", "message": "Symulacja zresetowana"}

@app.get("/api/simulation/status")
async def get_simulation_status():
    """Pobranie statusu symulacji"""
    return {
        "status": "stopped",
        "current_time": 0,
        "simulation_id": "demo"
    }

@app.post("/api/import/csv")
async def import_csv_data(file: UploadFile = File(...), data_type: str = "functions"):
    """Import danych z pliku CSV"""
    try:
        return {
            "imported_records": 0,
            "type": data_type,
            "message": "Funkcja importu CSV gotowa do implementacji"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blad importu: {str(e)}")

@app.websocket("/ws/simulation")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket do strumieniowania danych symulacji"""
    await websocket.accept()
    try:
        while True:
            # Demo data
            simulation_data = {
                "time": 0,
                "objects": [],
                "metrics": {},
                "events": [{"timestamp": "2024-01-01T00:00:00", "level": "info", "message": "Symulator gotowy"}],
                "status": "stopped"
            }
            await websocket.send_json(simulation_data)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("WebSocket disconnected")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
