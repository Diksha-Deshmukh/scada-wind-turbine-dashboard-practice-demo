using Microsoft.EntityFrameworkCore;
using WindTurbineDashboard.API.Data;
using WindTurbineDashboard.API.Models;
using WindTurbineDashboard.API.Services;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<AlertService>();

var app = builder.Build();

// Apply database migrations / create DB on start
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    // Seed single turbine
    if (!db.Turbines.Any())
    {
        db.Turbines.Add(new Turbine
        {
            Name = "Turbine 1",
            Site = "Site A"
        });

        db.SaveChanges();
    }

    // Seed sample telemetry data for charts
    if (!db.Telemetry.Any(t => t.TurbineId == 1))
    {
        var start = DateTime.UtcNow.AddHours(-24);
        var random = new Random(7);
        var samples = new List<Telemetry>();

        for (int i = 0; i <= 48; i++)
        {
            var wind = 8 + Math.Sin(i / 5.0) * 2.4 + random.NextDouble() * 0.8;
            var power = Math.Max(0.2, wind * 0.33 + Math.Sin(i / 4.0) * 0.25);
            var vibration = 1.0 + Math.Sin(i / 6.0) * 0.25 + random.NextDouble() * 0.12;
            var temperature = 55 + Math.Sin(i / 7.0) * 8 + random.NextDouble() * 2.5;

            if (i == 35)
            {
                vibration = 3.35;
            }

            if (i == 42)
            {
                temperature = 92.5;
            }

            samples.Add(new Telemetry
            {
                TurbineId = 1,
                Timestamp = start.AddMinutes(i * 30),
                WindSpeed = Math.Round(wind, 2),
                PowerOutput = Math.Round(power, 2),
                Vibration = Math.Round(vibration, 2),
                Temperature = Math.Round(temperature, 2),
                FaultCode = ""
            });
        }

        db.Telemetry.AddRange(samples);

        db.Alarms.Add(new Alarm
        {
            TurbineId = 1,
            Timestamp = start.AddHours(17.5),
            Description = "High vibration detected",
            Severity = "warning"
        });

        db.Alarms.Add(new Alarm
        {
            TurbineId = 1,
            Timestamp = start.AddHours(21),
            Description = "High temperature detected",
            Severity = "critical"
        });

        db.SaveChanges();
    }
}

// Middleware
app.UseSwagger();
app.UseSwaggerUI();

// Endpoints
app.MapGet("/api/turbines", async (AppDbContext db) =>
    await db.Turbines.AsNoTracking().ToListAsync());

app.MapGet("/api/telemetry/{turbineId:int}", async (int turbineId, AppDbContext db) =>
{
    var since = DateTime.UtcNow.AddHours(-24);

    return await db.Telemetry
        .AsNoTracking()
        .Where(t => t.TurbineId == turbineId && t.Timestamp >= since)
        .OrderBy(t => t.Timestamp)
        .ToListAsync();
});

app.MapGet("/api/alarms", async (AppDbContext db) =>
{
    var since = DateTime.UtcNow.AddHours(-24);

    return await db.Alarms
        .AsNoTracking()
        .Where(a => a.Timestamp >= since)
        .OrderByDescending(a => a.Timestamp)
        .ToListAsync();
});

app.MapPost("/api/ingest", async (TelemetryDto dto, AppDbContext db, AlertService alertService) =>
{
    var turbine = await db.Turbines.FindAsync(dto.TurbineId);

    if (turbine == null)
    {
        return Results.BadRequest(new { error = "Unknown turbine_id" });
    }

    DateTime timestamp;

    if (!string.IsNullOrEmpty(dto.Timestamp))
    {
        if (!DateTime.TryParse(dto.Timestamp, out timestamp))
        {
            return Results.BadRequest(new { error = "Invalid timestamp" });
        }

        timestamp = DateTime.SpecifyKind(timestamp, DateTimeKind.Utc);
    }
    else
    {
        timestamp = DateTime.UtcNow;
    }

    var telemetry = new Telemetry
    {
        Timestamp = timestamp,
        TurbineId = dto.TurbineId,
        WindSpeed = dto.WindSpeed,
        PowerOutput = dto.PowerOutput,
        Vibration = dto.Vibration,
        Temperature = dto.Temperature,
        FaultCode = dto.FaultCode
    };

    await db.Telemetry.AddAsync(telemetry);

    var alarms = alertService.GenerateAlarms(telemetry);

    foreach (var alarm in alarms)
    {
        await db.Alarms.AddAsync(alarm);
    }

    await db.SaveChangesAsync();

    return Results.Ok(new { status = "success", alarms });
});

app.Run();