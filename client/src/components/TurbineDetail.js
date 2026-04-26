import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function TurbineDetail() {
  const id = 1;
  const [turbine, setTurbine] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    fetch(`/api/turbines`)
      .then(res => res.json())
      .then(data => {
        const t = data.find(x => x.id === Number(id));
        setTurbine(t);
      })
      .catch(err => console.error(err));
    fetch(`/api/telemetry/${id}`)
      .then(res => res.json())
      .then(data => setTelemetry(data))
      .catch(err => console.error(err));
    fetch(`/api/alarms`)
      .then(res => res.json())
      .then(data => setAlarms(data.filter(a => a.turbineId === Number(id))))
      .catch(err => console.error(err));
  }, [id]);

  if (!turbine) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const labels = telemetry.map(t => new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      x: { grid: { color: '#3a3f4b' }, ticks: { color: '#b0b8c1' } },
      y: { grid: { color: '#3a3f4b' }, ticks: { color: '#b0b8c1' } }
    }
  };

  const windData = {
    labels,
    datasets: [{
      label: 'Wind Speed (m/s)',
      data: telemetry.map(t => t.windSpeed),
      borderColor: '#00e396',
      backgroundColor: 'rgba(0, 227, 150, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const powerData = {
    labels,
    datasets: [{
      label: 'Power Output (MW)',
      data: telemetry.map(t => t.powerOutput),
      borderColor: '#1884ff',
      backgroundColor: 'rgba(24, 132, 255, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const vibrationData = {
    labels,
    datasets: [{
      label: 'Vibration (m/s²)',
      data: telemetry.map(t => t.vibration),
      borderColor: '#feb019',
      backgroundColor: 'rgba(254, 176, 25, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const temperatureData = {
    labels,
    datasets: [{
      label: 'Temperature (°C)',
      data: telemetry.map(t => t.temperature),
      borderColor: '#ff4560',
      backgroundColor: 'rgba(255, 69, 96, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const latest = telemetry.length > 0 ? telemetry[telemetry.length - 1] : null;

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="dashboard-title mb-1">{turbine.name}</h1>
          <p className="metric-label mb-0">Site: {turbine.site}</p>
        </div>
        <div className="text-end">
          <span className="badge bg-success fs-6">Online</span>
          <p className="metric-label mb-0 mt-1">Last Update: {latest ? new Date(latest.timestamp).toLocaleString() : 'N/A'}</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <p className="metric-label mb-1">Wind Speed</p>
              <p className="metric-value mb-0" style={{ color: '#00e396' }}>{latest ? latest.windSpeed.toFixed(1) : '--'}<span className="fs-5"> m/s</span></p>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <p className="metric-label mb-1">Power Output</p>
              <p className="metric-value mb-0" style={{ color: '#1884ff' }}>{latest ? latest.powerOutput.toFixed(1) : '--'}<span className="fs-5"> MW</span></p>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <p className="metric-label mb-1">Vibration</p>
              <p className="metric-value mb-0" style={{ color: '#feb019' }}>{latest ? latest.vibration.toFixed(2) : '--'}<span className="fs-5"> m/s²</span></p>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <p className="metric-label mb-1">Temperature</p>
              <p className="metric-value mb-0" style={{ color: '#ff4560' }}>{latest ? latest.temperature.toFixed(1) : '--'}<span className="fs-5"> °C</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Wind Speed (last 24h)</h5>
              <div style={{ height: '200px' }}>
                <Line data={windData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Power Output (last 24h)</h5>
              <div style={{ height: '200px' }}>
                <Line data={powerData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Vibration (last 24h)</h5>
              <div style={{ height: '200px' }}>
                <Line data={vibrationData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Temperature (last 24h)</h5>
              <div style={{ height: '200px' }}>
                <Line data={temperatureData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alarms Section */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">Recent Alarms</h5>
              {alarms.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Severity</th>
                        <th>Description</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alarms.slice(0, 10).map(alarm => (
                        <tr key={alarm.id}>
                          <td>{new Date(alarm.timestamp).toLocaleString()}</td>
                          <td>
                            <span className={`badge ${alarm.severity === 'Critical' ? 'bg-danger' : alarm.severity === 'Warning' ? 'bg-warning text-dark' : 'bg-info'}`}>
                              {alarm.severity}
                            </span>
                          </td>
                          <td>{alarm.description}</td>
                          <td>
                            <span className={`badge ${alarm.resolved ? 'bg-success' : 'bg-secondary'}`}>
                              {alarm.resolved ? 'Resolved' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">No recent alarms</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TurbineDetail;