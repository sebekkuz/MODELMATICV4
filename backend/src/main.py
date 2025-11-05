from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import pandas as pd
import json
from typing import Dict, List, Any
import asyncio
import uvicorn
import os

from config.settings import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_VERSION,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["*"]  # W produkcji ogranicz do konkretnych hostów
)

# Store active WebSocket connections
active_connections: List[WebSocket] = []

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: Dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting to connection: {e}")

manager = ConnectionManager()

@app.get("/")
async def root():
    return {
        "message": "Symulator Produkcji HMLV API", 
        "version": "1.0.0",
        "docs": "/docs",
        "environment": "production" if os.getenv("RENDER", False) else "development"
    }

@app.get("/health")
async def health_check():
    """Endpoint do sprawdzania zdrowia aplikacji (dla Render)"""
    return {"status": "healthy", "connections": len(manager.active_connections)}

@app.post("/api/simulation/start")
async def start_simulation(config: Dict[str, Any] = None):
    """Uruchomienie symulacji"""
    try:
        # Tutaj będzie logika startu symulacji
        simulation_data = {
            "status": "started", 
            "message": "Symulacja uruchomiona pomyślnie",
            "simulation_id": f"sim_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
        # Powiadom wszystkich podłączonych klientów
        await manager.broadcast({
            "type": "simulation_started",
            "data": simulation_data
        })
        
        return simulation_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd uruchamiania symulacji: {str(e)}")

@app.post("/api/simulation/pause")
async def pause_simulation():
    """Wstrzymanie symulacji"""
    await manager.broadcast({
        "type": "simulation_paused",
        "data": {"status": "paused", "message": "Symulacja wstrzymana"}
    })
    return {"status": "paused", "message": "Symulacja wstrzymana"}

@app.post("/api/simulation/reset")
async def reset_simulation():
    """Reset symulacji"""
    await manager.broadcast({
        "type": "simulation_reset",
        "data": {"status": "reset", "message": "Symulacja zresetowana"}
    })
    return {"status": "reset", "message": "Symulacja zresetowana"}

@app.get("/api/simulation/status")
async def get_simulation_status():
    """Pobranie statusu symulacji"""
    return {
        "status": "stopped",
        "current_time": 0,
        "simulation_id": "demo",
        "environment": "production" if os.getenv("RENDER", False) else "development"
    }

@app.post("/api/import/csv")
async def import_csv_data(file: UploadFile = File(...), data_type: str = "functions"):
    """Import danych z pliku CSV"""
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Plik musi być w formacie CSV")
        
        # Tutaj będzie logika przetwarzania CSV
        return {
            "imported_records": 0,
            "type": data_type,
            "message": "Funkcja importu CSV gotowa do implementacji"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd importu: {str(e)}")

@app.websocket("/ws/simulation")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Powitanie
        await websocket.send_json({
            "type": "connection_established",
            "message": "Połączono z symulatorem",
            "environment": "production" if os.getenv("RENDER", False) else "development"
        })
        
        while True:
            # Odbieranie wiadomości od klienta
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                # Obsługa różnych typów wiadomości
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong", "timestamp": pd.Timestamp.now().isoformat()})
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "message": "Nieprawidłowy format JSON"})
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("WebSocket disconnected")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=not bool(os.getenv("RENDER", False)),  # Auto-reload tylko w rozwoju
        log_level="info"
    )
