using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyEcommerce.Models
{
    public class ReturnRequestDto
    {
        public int OrderId { get; set; }       
        public int ProductId { get; set; }     
    }
}
