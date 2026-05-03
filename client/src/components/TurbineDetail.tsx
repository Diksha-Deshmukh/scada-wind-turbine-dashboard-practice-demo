import React, { useEffect, useState } from 'react';
import { drawLineChart } from '../utils/chart';

interface Turbine {
  id: number;
  name: string;
  site: string;
}

interface Telemetry {
  id: number;
  timestamp: string;
  turbineId: number;
  windSpeed: number;
  powerOutput: number;
  vibration: number;
  temperature: number;
}

interface Alarm {
  id: number;
  timestamp: string;
  turbineId: number;
  description: string;
  severity: string;
  resolved?: boolean;
}

function TurbineDetail() {
  const turbineId = 1;

  const [turbine, setTurbine] = useState<Turbine | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const turbinesRes = await fetch('/api/turbines');
        const turbinesData: Turbine[] = await turbinesRes.json();

        const telemetryRes = await fetch(`/api/telemetry/${turbineId}`);
        const telemetryData: Telemetry[] = await telemetryRes.json();

        const alarmsRes = await fetch('/api/alarms');
        const alarmsData: Alarm[] = await alarmsRes.json();

        setTurbine(turbinesData.find(t => t.id === turbineId) ?? null);
        setTelemetry(telemetryData);
        setAlarms(alarmsData.filter(a => a.turbineId === turbineId));
        setError('');
      } catch {
        setError('Unable to load dashboard data. Please check if the backend is running.');
      }
    };

    fetchData();

    const interval = window.setInterval(fetchData, 5000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (telemetry.length === 0) return;

    const labels = telemetry.map(t => new Date(t.timestamp));

    drawLineChart('windSpeedChart', labels, telemetry.map(t => t.windSpeed), {
      yLabel: 'm/s',
      lineColor: '#00e0a4'
    });

    drawLineChart('powerOutputChart', labels, telemetry.map(t => t.powerOutput), {
      yLabel: 'MW',
      lineColor: '#1e88ff'
    });

    drawLineChart('vibrationChart', labels, telemetry.map(t => t.vibration), {
      yLabel: 'm/s²',
      lineColor: '#ffb300'
    });

    drawLineChart('temperatureChart', labels, telemetry.map(t => t.temperature), {
      yLabel: '°C',
      lineColor: '#ff4f78'
    });
  }, [telemetry]);

  if (error) {
    return <main className="dashboard-page">{error}</main>;
  }

  if (!turbine) {
    return <main className="dashboard-page">Loading...</main>;
  }

  const latest = telemetry[telemetry.length - 1];

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>{turbine.name}</h1>
          <p>Site: {turbine.site}</p>
        </div>

        <div className="header-status">
          <span className="online-badge">Online</span>
          <p>
            Last Update:{' '}
            {latest ? new Date(latest.timestamp).toLocaleString() : 'N/A'}
          </p>
        </div>
      </header>

      <section className="metric-grid">
        <article className="metric-card green">
          <p>Wind Speed</p>
          <h2>{latest ? latest.windSpeed.toFixed(1) : '--'} m/s</h2>
        </article>

        <article className="metric-card blue">
          <p>Power Output</p>
          <h2>{latest ? latest.powerOutput.toFixed(1) : '--'} MW</h2>
        </article>

        <article className="metric-card yellow">
          <p>Vibration</p>
          <h2>{latest ? latest.vibration.toFixed(2) : '--'} m/s²</h2>
        </article>

        <article className="metric-card pink">
          <p>Temperature</p>
          <h2>{latest ? latest.temperature.toFixed(1) : '--'} °C</h2>
        </article>
      </section>

      <section className="chart-grid">
        <article className="chart-card">
          <h3>Wind Speed (last 24h)</h3>
          <canvas id="windSpeedChart" width="700" height="230" />
        </article>

        <article className="chart-card">
          <h3>Power Output (last 24h)</h3>
          <canvas id="powerOutputChart" width="700" height="230" />
        </article>

        <article className="chart-card">
          <h3>Vibration (last 24h)</h3>
          <canvas id="vibrationChart" width="700" height="230" />
        </article>

        <article className="chart-card">
          <h3>Temperature (last 24h)</h3>
          <canvas id="temperatureChart" width="700" height="230" />
        </article>
      </section>

      <section className="alarm-card">
        <h3>Recent Alarms</h3>

        {alarms.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Severity</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {alarms.map(alarm => (
                <tr key={alarm.id}>
                  <td>{new Date(alarm.timestamp).toLocaleString()}</td>
                  <td>
                    <span className={`severity ${alarm.severity.toLowerCase()}`}>
                      {alarm.severity}
                    </span>
                  </td>
                  <td>{alarm.description}</td>
                  <td>
                    <span className="status-badge">
                      {alarm.resolved ? 'Resolved' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent alarms</p>
        )}
      </section>
    </main>
  );
}

export default TurbineDetail;