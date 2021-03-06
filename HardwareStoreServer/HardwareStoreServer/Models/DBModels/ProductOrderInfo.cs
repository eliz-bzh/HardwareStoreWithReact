﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HardwareStoreServer.Models.DBModels
{
    public class ProductOrderInfo
    {
        public int Id { get; set; }
        
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        [ForeignKey("Order")]
        public int? OrderId { get; set; }
        public Order Order { get; set; }
    }
}
