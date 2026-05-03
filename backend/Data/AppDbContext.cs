using Microsoft.EntityFrameworkCore;
using WindTurbineDashboard.API.Models;

namespace WindTurbineDashboard.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Turbine> Turbines => Set<Turbine>();
        public DbSet<Telemetry> Telemetry => Set<Telemetry>();
        public DbSet<Alarm> Alarms => Set<Alarm>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // ❌ NO HasData here
        }
    }
}