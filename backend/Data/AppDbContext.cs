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
            // Seed a few turbines for demo
            modelBuilder.Entity<Turbine>().HasData(
                new Turbine { Id = 1, Name = "Turbine 1", Site = "Site A" },
                new Turbine { Id = 2, Name = "Turbine 2", Site = "Site A" },
                new Turbine { Id = 3, Name = "Turbine 3", Site = "Site B" },
                new Turbine { Id = 4, Name = "Turbine 4", Site = "Site B" },
                new Turbine { Id = 5, Name = "Turbine 5", Site = "Site C" },
                new Turbine { Id = 6, Name = "Turbine 6", Site = "Site C" }
            );
        }
    }
}