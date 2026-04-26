namespace WindTurbineDashboard.API.Models
{
    /// <summary>
    /// Data transfer object for ingesting telemetry via HTTP POST.
    /// </summary>
    public class TelemetryDto
    {
        public int TurbineId { get; set; }
        public double WindSpeed { get; set; }
        public double PowerOutput { get; set; }
        public double Vibration { get; set; }
        public double Temperature { get; set; }
        public string? FaultCode { get; set; }
        public string? Timestamp { get; set; }
    }
}