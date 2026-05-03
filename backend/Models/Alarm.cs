using System;

namespace WindTurbineDashboard.API.Models
{
    public class Alarm
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public int TurbineId { get; set; }
        public Turbine? Turbine { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = "warning";
        public bool Resolved { get; set; } = false;
    }
}