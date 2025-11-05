# Symulator Produkcji HMLV v1.0

Webowy symulator linii produkcyjnych dla Ĺ›rodowisk High-Mix Low-Volume (HMLV).

## Funkcjonalnosci

- Modelowanie procesow - przeciaganie i upuszczanie stanowisk, buforow, pracownikow
- Symulacja zdarzen dyskretnych - realistyczna symulacja przeplywu produkcji
- Analiza wynikow - wykresy wykorzystania, TAKT, waskie gardla
- Import danych - wsparcie dla plikow CSV z danymi funkcji i obudow
- Interaktywna wizualizacja - widok 2D/3D z animacjami przeplywu
- Konfiguracja - edytor YAML/JSON do definiowania scenariuszy

## Struktura projektu

symulatorprodukcji-1/
â”śâ”€â”€ frontend/          # Aplikacja React + Three.js
â”śâ”€â”€ backend/           # API FastAPI + silnik symulacji
â”śâ”€â”€ shared/           # Schematy danych wspolne
â””â”€â”€ docs/             # Dokumentacja i przyklady

## Szybki start

### Wymagania

- Node.js 16+
- Python 3.9+
- npm/yarn

### Instalacja i uruchomienie

1. Klonowanie repozytorium
git clone <repository-url>
cd symulatorprodukcji-1

2. Instalacja zaleznosci
npm install
cd frontend && npm install && cd ..
cd backend && pip install -r requirements.txt && cd ..

3. Uruchomienie rozwoju
npm run dev

## Deployment na Render.com

1. Przygotowanie repozytorium
git add .
git commit -m "Initial deployment"
git push origin main

2. Konfiguracja na Render.com
   - Polacz repozytorium GitHub z Render
   - Utworz dwa Web Services z pliku render.yaml
   - Backend: Python service
   - Frontend: Static site

## API Dokumentacja

Backend udostepnia dokumentacje Swagger pod /docs po uruchomieniu.

## Licencja

MIT License - szczegoly w pliku LICENSE.
