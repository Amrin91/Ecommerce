using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyEcommerce.Models; 

namespace MyEcommerce.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Brand { get; set; }

        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public int Stock { get; set; } = 0;

        public int? CategoryId { get; set; }

        public int? SubCategoryId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public string ImagePath { get; set; } = string.Empty;

       
        public string? SKU { get; set; }                      // SKU
        public string? Color { get; set; }                     // Color
        public string? Specification { get; set; }             // Specification
        public bool? Inactive { get; set; }                     // Inactive

        //// Optional discounts
        public decimal? DiscountPercent { get; set; }  // null by default
        public decimal? DiscountPrice { get; set; }    // null by default
        public decimal? finalprice { get; set; }


        //public decimal FinalPrice
        //{
        //    get
        //    {
        //        if (DiscountPercent.HasValue)
        //            return Price * (1 - DiscountPercent.Value / 100m);
        //        else if (DiscountPrice.HasValue)
        //            return Price - DiscountPrice.Value;
        //        else
        //            return Price;
        //    }
        //}

        public virtual Category? Category { get; set; }
        [Column("Subcategory_id")]
        public virtual SubCategory? SubCategory { get; set; }

        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
    }
}
