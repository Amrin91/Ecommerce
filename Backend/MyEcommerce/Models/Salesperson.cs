using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyEcommerce.Models;
using System.Collections.Generic;
public class Salesperson
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; }

    // Navigation property for orders
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
