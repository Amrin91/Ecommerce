using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyEcommerce.Models;

public partial class OrderItem
{
    public int Id { get; set; }

    public int? OrderId { get; set; }

    public int? ProductId { get; set; }

    public int? Quantity { get; set; }
    //public decimal TotalAmount { get; set; }  // Order
    //public decimal Price { get; set; }        // OrderItem

    [Column("price_at_purchase")]
    public decimal? PriceAtPurchase { get; set; }

    public virtual Order? Order { get; set; }

    public virtual Product? Product { get; set; }
}
