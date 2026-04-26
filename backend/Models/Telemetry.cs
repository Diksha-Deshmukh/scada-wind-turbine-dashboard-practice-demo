using System;

namespace WindTurbineDashboard.API.Models
{
    public class Telemetry
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public int TurbineId { get; set; }
        public Turbine? Turbine { get; set; }
        public double WindSpeed { get; set; }
        public double PowerOutput { get; set; }
        public double Vibration { get; set; }
        public double Temperature { get; set; }
        public string? FaultCode { get; set; }
    }
}