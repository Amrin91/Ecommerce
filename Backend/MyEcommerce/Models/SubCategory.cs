using MyEcommerce.Models;
using System.Text.Json.Serialization;

public class SubCategory
{
    public int Id { get; set; }
    public string? Name { get; set; } = null!;
    public int CategoryId { get; set; }   

   
    public virtual Category? Category { get; set; }
}
