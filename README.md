# Single‑Turbine SCADA Dashboard (ASP.NET Core 10 + React)

This repository contains a simplified monitoring dashboard for a **single wind turbine** built using ASP.NET Core 10 and React.  The backend uses C# minimal APIs and Entity Framework Core to expose RESTful endpoints and persist data in a SQLite database.  The frontend uses React and the Canvas API to display time‑series charts and recent alarms for one turbine.  This project builds upon the energy‑analytics dashboard by reducing it to a single asset for easier demonstration and learning.

## Key features

* **.NET 10 minimal API backend** – The backend targets .NET 10 using the `net10.0` TargetFramework.  The .NET documentation notes that values like `net10.0` are aliases translated by the SDK into canonical moniker properties for .NET 10【402692835725933†L681-L694】.  The API exposes endpoints to ingest telemetry, retrieve the single turbine, fetch its telemetry history and list recent alarms.
* **Entity Framework Core** with a simple `Sqlite` database context (`AppDbContext`) for storing turbine metadata, telemetry samples and alarms.  You can switch to SQL Server or PostgreSQL by changing the connection string and provider.
* **Rule‑based alert engine** that triggers alarms when temperature, vibration or power output exceed configured thresholds on ingestion.
* **React front‑end** built with functional components.  Because only one turbine is displayed, the front‑end no longer uses React Router; it renders the turbine details directly and uses the Canvas API to draw basic line charts (no external chart library required).
* **Project structure** that keeps frontend and backend independent.  You can run them separately during development and combine them for deployment.

## Project structure

```
single_turbine_dashboard/
├── backend/
│   ├── WindTurbineDashboard.API.csproj   # .NET 10 API project
│   ├── Program.cs                        # ASP.NET Core entry point and route definitions
│   ├── Models/
│   │   ├── Turbine.cs                    # C# model classes
│   │   ├── Telemetry.cs
│   │   └── Alarm.cs
│   ├── Data/
│   │   └── AppDbContext.cs               # Entity Framework DbContext
│   ├── Services/
│   │   └── AlertService.cs               # Simple alert rule logic
│   └── appsettings.json                  # Connection string and EF configuration
└── client/
    ├── package.json                      # React dependencies and scripts
    ├── src/
    │   ├── index.js                      # React entry point
    │   ├── App.js                        # Renders the TurbineDetail component directly
    │   ├── components/
    │   │   └── TurbineDetail.js          # Single turbine detail with charts
    │   └── utils/
    │       └── chart.js                  # Simple canvas chart helper
    └── public/
        └── index.html                    # HTML template
```

## Prerequisites

* [.NET 10 SDK](https://dotnet.microsoft.com/download) – You need the .NET 10 SDK to build and run the backend.  The .NET 10 SDK provides the `net10.0` target framework along with updated libraries and tooling for C# 14.
* Node.js and npm (for the React client)

## Running the backend

1. Navigate to the `backend` directory and restore packages.  The backend targets .NET 10 and uses EF Core 10, so restoring packages will pull down the correct versions:

   ```bash
   cd single_turbine_dashboard/backend
   dotnet restore
   ```

2. Apply pending EF migrations and start the API:

   ```bash
   dotnet ef database update
   dotnet run
   ```

   The API will run at `https://localhost:5001` by default.  Use Swagger UI (`/swagger`) to test endpoints.

## Running the frontend

1. Navigate to the `client` directory and install dependencies:

   ```bash
   cd single_turbine_dashboard/client
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

   The React app will run on `http://localhost:3000` and proxy API requests to the backend (see `package.json`).  Browse to `http://localhost:3000` to view the dashboard.

## Extending this template

This project is deliberately minimal to let you build upon it.  Potential enhancements include:

* Use a message queue (e.g. RabbitMQ, Kafka) to decouple telemetry ingestion from the API.
* Swap SQLite for SQL Server, PostgreSQL or another database provider and add proper migrations.
* Replace the custom canvas charts with a charting library (Chart.js, Recharts, D3) for richer visualisation.
* Add authentication (JWT, Azure AD) and user roles to secure the dashboard.
* Deploy with Docker Compose or Kubernetes, connecting the .NET service, a database container and the React app.

Feel free to fork this repository and customise it to your needs when presenting to recruiters or colleagues.  A working implementation demonstrates your ability to design a modern web application with separate backend and frontend layers, real‑time data ingestion and visualisation, and proper data persistence.