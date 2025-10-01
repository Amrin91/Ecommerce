using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyEcommerce.Models; // make sure your namespace is correct

namespace MyEcommerce.Models
{
    [Table("ReturnRequests")]
    public class ReturnRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending";

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // 🔹 Navigation properties
        public User? User { get; set; }
        public Order? Order { get; set; }
        public Product? Product { get; set; }
    }
}
