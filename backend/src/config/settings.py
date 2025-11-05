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
    
    # API
    API_V1_STR: str = "/api/v1"

settings = Settings()
