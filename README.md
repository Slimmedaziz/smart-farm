# SmartFarm - Frontend (React + Vite + Tailwind)

This is a polished frontend project for the **Automatic Irrigation (Arrosage Automatique)** course project.

## Features
- Modern dashboard design (Tailwind + Framer Motion)
- Mock API for fields and live sensor data (no backend required)
- Recharts line chart for sensor history
- Simple auth (demo user)

## Quick start
1. Unzip the folder.
2. Install dependencies:
   ```
   npm install
   ```
3. Start dev server:
   ```
   npm run dev
   ```
4. Open http://localhost:5173

## Demo credentials
- Email: `demo@smart.farm`
- Password: `demo123`

## Notes
- This project uses a mock API (`src/services/mockApi.js`) to simulate sensor readings and irrigation triggers.
- To connect to your real backend, replace the mock API functions with real Axios calls.
