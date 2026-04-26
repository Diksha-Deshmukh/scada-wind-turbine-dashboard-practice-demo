using System.Collections.Generic;

namespace WindTurbineDashboard.API.Models
{
    public class Turbine
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Site { get; set; } = string.Empty;

        public List<Telemetry> Telemetry { get; set; } = new();
        public List<Alarm> Alarms { get; set; } = new();
    }
}