import os
from typing import List

class Settings:
    PROJECT_NAME: str = "Symulator Produkcji HMLV"
    PROJECT_VERSION: str = "1.0.0"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://symulator-produkcji-frontend.onrender.com",
        "https://symulator-produkcji-1.onrender.com"
    ]
    
    # Database (możesz dodać później)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./simulation.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-production")
    
    # API
    API_V1_STR: str = "/api/v1"

settings = Settings()
