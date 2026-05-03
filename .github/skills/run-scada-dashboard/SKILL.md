---
name: run-scada-dashboard
description: "Use when: running the SCADA Wind Turbine Dashboard locally. Provides commands to start both backend and frontend."
user-invocable: true
---

# Run SCADA Dashboard

Full-stack .NET + React application. Requires two terminal sessions.

## Commands

### Backend (Terminal 1)

```powershell
cd single_turbine_dashboard\backend
dotnet run
```

- API: `https://localhost:5001`
- Auto-creates SQLite database on first run

### Frontend (Terminal 2)

```powershell
cd single_turbine_dashboard\client
npm install   # first run only
npm start
```

- UI: `http://localhost:3000`

## Notes

- Frontend proxies to backend via `proxy` in package.json
- Backend seeds one turbine on first startup