﻿using Microsoft.EntityFrameworkCore;
using oak.Models;


namespace oak.Data
{
    public class EntityContextFASTTRACK : DbContext
    {
        public EntityContextFASTTRACK(DbContextOptions<EntityContextFASTTRACK> options) : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

        public DbSet<AmqPlan> AmqPlan { get; set; }
        public DbSet<AmqProduct> AmqProduct { get; set; }
        public DbSet<AmqProductGroup> AmqProductGroup { get; set; }
        public DbSet<AmqCvRate> AmqCvRate { get; set; }
    }

    public class EntityContextWEB : DbContext
    {
        public EntityContextWEB(DbContextOptions<EntityContextWEB> options) : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }
        public DbSet<PlanDocs> PlanDocs { get; set; }
        public DbSet<CommRates> CommRates { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<AnnounceMathDocs> AnnounceDocs { get; set; }

    }
}
