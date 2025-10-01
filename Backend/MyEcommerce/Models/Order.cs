using System;
using System.Collections.Generic;

namespace MyEcommerce.Models;

public partial class Order
{
    public int Id { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? Status { get; set; }
    public decimal? Total { get; set; }

    public string? Name { get; set; }
    public string? Address { get; set; }
    public string? Mobile { get; set; }
    public int? UserId { get; set; }
    public User? User { get; set; }

    //public decimal TotalAmount { get; set; }  // Order
    //public decimal Price { get; set; }        // OrderItem


    public int? SalespersonId { get; set; }
    public Salesperson? Salesperson { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    // ✅ Add this for payments
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
