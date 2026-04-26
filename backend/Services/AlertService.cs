using System.Collections.Generic;
using WindTurbineDashboard.API.Models;

namespace WindTurbineDashboard.API.Services
{
    /// <summary>
    /// Provides simple rule‑based alert generation for incoming telemetry.
    /// </summary>
    public class AlertService
    {
        public IEnumerable<Alarm> GenerateAlarms(Telemetry t)
        {
            var alarms = new List<Alarm>();
            if (t.Temperature > 90.0)
            {
                alarms.Add(new Alarm
                {
                    TurbineId = t.TurbineId,
                    Description = $"High generator temperature: {t.Temperature:F1} °C",
                    Severity = "critical"
                });
            }
            if (t.Vibration > 3.0)
            {
                alarms.Add(new Alarm
                {
                    TurbineId = t.TurbineId,
                    Description = $"Excessive vibration: {t.Vibration:F1} m/s²",
                    Severity = "warning"
                });
            }
            if (t.WindSpeed > 10.0 && t.PowerOutput < 0.5)
            {
                alarms.Add(new Alarm
                {
                    TurbineId = t.TurbineId,
                    Description = "Low power output at high wind speed",
                    Severity = "warning"
                });
            }
            return alarms;
        }
    }
}