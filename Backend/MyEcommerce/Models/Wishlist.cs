using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyEcommerce.Models
{
    [Table("Wishlist")]
    public class Wishlist
    {
        [Key]
        [Column("WishlistID")]
        public int Id { get; set; }

        [Required]
        [Column("UserID")]
        public int UserId { get; set; }

        [Required]
        [Column("ProductID")]
        public int ProductId { get; set; }

        [Required]
        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
