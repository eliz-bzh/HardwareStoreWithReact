﻿using HardwareStoreServer.Models.DBModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HardwareStoreServer.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
        {
            this.Database.EnsureCreated();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //MS SQL Server
            optionsBuilder.UseSqlServer("Data Source=DESKTOP-HO2E7N9;Initial Catalog=HardwareStoreDB;Trusted_connection=True");

            //My SQL
            /*optionsBuilder.UseMySql("server=localhost;user=root;password=1111;database=hardware_store;",
                new MySqlServerVersion(new Version(8, 0, 23))
            );*/
        }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<Client> Clients { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<ProductOrderInfo> ProductOrderInfos { get; set; }
        public virtual DbSet<Supplier> Suppliers { get; set; }
        public virtual DbSet<Supply> Supplies { get; set; }
        public virtual DbSet<DBModels.Type> Types { get; set; }
        public virtual DbSet<Image> Images { get; set; }
    }
}
