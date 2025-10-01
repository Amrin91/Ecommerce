using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyEcommerce.Models
{
    public class ProductImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("image_url", TypeName = "varchar(max)")]
        public string ImageUrl { get; set; } = string.Empty;

        [Column("is_primary")]
        public bool IsPrimary { get; set; } = false;

        [ForeignKey("Product")]
        [Column("product_id")]
        public int ProductId { get; set; }

        public Product Product { get; set; } = null!;
    }
}
