/*using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using MyEcommerce.Models;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace MyEcommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly MyEcomContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(MyEcomContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // POST: Add Product with Image
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddProduct([FromForm] ProductDto productDto)
        {
            if (productDto.Image == null || productDto.Image.Length == 0)
                return BadRequest("Image is required.");

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "", "images");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid() + Path.GetExtension(productDto.Image.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await productDto.Image.CopyToAsync(stream);
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var imageUrl = $"{baseUrl}/images/{uniqueFileName}";

            var product = new Product
            {
                Name = productDto.Name,
                Price = productDto.Price,
                CategoryId = productDto.CategoryId,
                SubCategoryId = productDto.SubCategoryId,
                ImagePath = imageUrl,
                CreatedAt = DateTime.UtcNow,
                ProductImages = new List<ProductImage>() // initialize empty list
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product added successfully", productId = product.Id });
        }*/

/*[HttpPost]
[Consumes("multipart/form-data")]
public async Task<IActionResult> AddProduct([FromForm] ProductDto productDto)
{
    if (productDto.Image == null || productDto.Image.Length == 0)
        return BadRequest("Image is required.");

    // Ensure wwwroot/images folder exists
    var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "images");
    if (!Directory.Exists(uploadsFolder))
        Directory.CreateDirectory(uploadsFolder);

    // Create unique filename
    var uniqueFileName = Guid.NewGuid() + Path.GetExtension(productDto.Image.FileName);
    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

    // Save file to disk
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await productDto.Image.CopyToAsync(stream);
    }

    // URL that can be accessed in browser
    var imageUrl = $"/images/{uniqueFileName}";

    // Create product
    var product = new Product
    {
        Name = productDto.Name,
        Price = productDto.Price,
        CategoryId = productDto.CategoryId,
        SubCategoryId = productDto.SubCategoryId,
        ImagePath = imageUrl,          // Relative path
        CreatedAt = DateTime.UtcNow,
        ProductImages = new List<ProductImage>()
    };

    _context.Products.Add(product);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Product added successfully",
        productId = product.Id,
        imageUrl = $"http://{Request.Host}{imageUrl}" // Full URL
    });
}


// GET: All Products with optional filters
// GET: All Products with optional filters
[HttpGet]
public async Task<IActionResult> GetProducts(
    [FromQuery] int? categoryId,
    [FromQuery] int? subcategoryId,
    [FromQuery] string? search,
    [FromQuery] int limit = 30,
    [FromQuery] int skip = 0)
{
    const int maxLimit = 100;
    limit = (limit <= 0 || limit > maxLimit) ? 30 : limit;

    IQueryable<Product> query = _context.Products
        .Include(p => p.ProductImages)
        .Include(p => p.Category)
        .Include(p => p.SubCategory);

    if (subcategoryId.HasValue)
        query = query.Where(p => p.SubCategoryId == subcategoryId.Value);
    else if (categoryId.HasValue)
        query = query.Where(p => p.SubCategory != null && p.SubCategory.CategoryId == categoryId.Value);

    if (!string.IsNullOrWhiteSpace(search))
    {
        string keyword = search.ToLower();
        query = query.Where(p =>
            (p.Name != null && p.Name.ToLower().Contains(keyword)) ||
            (p.Description != null && p.Description.ToLower().Contains(keyword))
        );
    }

    var total = await query.CountAsync();

    var products = await query
        .OrderByDescending(p => p.CreatedAt)
        .Skip(skip)
        .Take(limit)
        .Select(p => new
        {
            id = p.Id,
            title = p.Name,
            price = p.Price,
            // EF Core-compatible way to get primary image
            thumbnail = p.ProductImages
                            .Where(img => img.IsPrimary) // no ? operator
                            .Select(img => img.ImageUrl)
                            .FirstOrDefault() ?? p.ImagePath
        })
        .ToListAsync();

    return Ok(new { total, products });
}


// GET: Product by ID
[HttpGet("{id}")]
public async Task<IActionResult> GetProductById(int id)
{
    var product = await _context.Products
        .Include(p => p.ProductImages)
        .Include(p => p.Category)
        .Include(p => p.SubCategory)
        .FirstOrDefaultAsync(p => p.Id == id);

    if (product == null)
        return NotFound();

    return Ok(new
    {
        id = product.Id,
        title = product.Name,
        price = product.Price,
        description = product.Description,
        thumbnail = product.ProductImages.FirstOrDefault(img => img.IsPrimary)?.ImageUrl ?? product.ImagePath,
        stock = product.Stock,
        categoryId = product.SubCategory?.CategoryId,
        subcategoryId = product.SubCategoryId
    });
}
}

// DTO for form-data
public class ProductDto
{
public string Name { get; set; } 
public decimal Price { get; set; }
public int CategoryId { get; set; }
public int SubCategoryId { get; set; }
public IFormFile Image { get; set; } = null!;
}
}

/* ====================
// Models (cleaned)
// ====================*/

/*namespace MyEcommerce.Models
{
public class Product
{
public int Id { get; set; }
public string Name { get; set; } = string.Empty;
public string? Description { get; set; }
public decimal Price { get; set; }
public int Stock { get; set; }
public int CategoryId { get; set; }
public int SubCategoryId { get; set; }
public string ImagePath { get; set; } = string.Empty;
public DateTime CreatedAt { get; set; }

public Category? Category { get; set; }
public SubCategory? SubCategory { get; set; }
public List<ProductImage> ProductImages { get; set; } = new();
}

public class ProductImage
{
public int Id { get; set; }
public string ImageUrl { get; set; } = string.Empty;
public bool IsPrimary { get; set; }
public int ProductId { get; set; }
public Product Product { get; set; } = null!;
}

public class Category
{
public int Id { get; set; }
public string Name { get; set; } = string.Empty;
}

public class SubCategory
{
public int Id { get; set; }
public string Name { get; set; } = string.Empty;
public int CategoryId { get; set; }
public Category Category { get; set; } = null!;
}
}*/


using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using MyEcommerce.Models;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace MyEcommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly MyEcomContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(MyEcomContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: /api/products
        // GET: /api/products
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetProducts(
            [FromQuery] int? categoryId,
            [FromQuery] int? subcategoryId,
            [FromQuery] string? search,
            [FromQuery] string? brand,
            [FromQuery] string? sortPrice,   // "HighToLow" / "LowToHigh"
            [FromQuery] string? sortName,    // "AtoZ" / "ZtoA"
            [FromQuery] int limit = 30,
            [FromQuery] int skip = 0
        )
        {
            const int maxLimit = 100;
            limit = (limit <= 0 || limit > maxLimit) ? 30 : limit;

            var query = _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Where(p => !p.Inactive == true)
                .AsQueryable();

            // Category/Subcategory filter
            if (subcategoryId.HasValue)
                query = query.Where(p => p.SubCategoryId == subcategoryId.Value);
            else if (categoryId.HasValue)
                query = query.Where(p => p.SubCategory != null && p.SubCategory.CategoryId == categoryId.Value);

            // Brand filter
            if (!string.IsNullOrWhiteSpace(brand) && brand.ToLower() != "all")
                query = query.Where(p => p.Brand != null && p.Brand.ToLower() == brand.ToLower());

            // Search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                string keyword = search.ToLower();
                query = query.Where(p =>
                    (p.Name != null && p.Name.ToLower().Contains(keyword)) ||
                    (p.Description != null && p.Description.ToLower().Contains(keyword))
                );
            }

            // Sorting: allow combined price + name sorting
            IOrderedQueryable<Product>? orderedQuery = null;

            // First apply price sorting if provided
            if (!string.IsNullOrWhiteSpace(sortPrice))
            {
                orderedQuery = sortPrice.ToLower() switch
                {
                    "hightolow" => query.OrderByDescending(p => p.Price),
                    "lowtohigh" => query.OrderBy(p => p.Price),
                    _ => query.OrderByDescending(p => p.CreatedAt)
                };

                // Then apply name sorting (secondary)
                if (!string.IsNullOrWhiteSpace(sortName))
                {
                    orderedQuery = sortName.ToLower() switch
                    {
                        "atoz" => orderedQuery.ThenBy(p => p.Name ?? string.Empty),
                        "ztoa" => orderedQuery.ThenByDescending(p => p.Name ?? string.Empty),
                        _ => orderedQuery
                    };
                }
            }
            // If only name sorting is provided
            else if (!string.IsNullOrWhiteSpace(sortName))
            {
                orderedQuery = sortName.ToLower() switch
                {
                    "atoz" => query.OrderBy(p => p.Name ?? string.Empty),
                    "ztoa" => query.OrderByDescending(p => p.Name ?? string.Empty),
                    _ => query.OrderByDescending(p => p.CreatedAt)
                };
            }
            // Default: sort by newest
            else
            {
                orderedQuery = query.OrderByDescending(p => p.CreatedAt);
            }


            var total = await orderedQuery.CountAsync();

            var products = await orderedQuery
                .Skip(skip)
                .Take(limit)
                .Select(p => new ProductPublicListDto
                {
                    Id = p.Id,
                    Title = p.Name,
                    Price = p.Price,
                    DiscountPrice = p.DiscountPrice,           
                    DiscountPercent = p.DiscountPercent,       
                    finalprice = p.finalprice ?? p.Price,      
                    Stock = p.Stock,
                    Brand = p.Brand,
                    Category = p.Category != null ? p.Category.Name : null,
                    SubCategory = p.SubCategory != null ? p.SubCategory.Name : null,
                    Thumbnail = p.ProductImages != null && p.ProductImages.Any(img => img.IsPrimary)
                        ? p.ProductImages.First(img => img.IsPrimary).ImageUrl
                        : p.ImagePath
                })
                .ToListAsync();

            return Ok(new { total, products });
        }

        // GET: /api/inactive-products
        [HttpGet("inactive-products")]
        [AllowAnonymous]
        public async Task<IActionResult> GetInactiveProducts(
            [FromQuery] int? categoryId,
            [FromQuery] int? subcategoryId,
            [FromQuery] string? search,
            [FromQuery] string? brand
        )
        {
            // Start by including related data and filtering for inactive products
            var query = _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Where(p => p.Inactive == true) // Only Inactive Products
                .AsQueryable();

            // Apply Category/Subcategory filter
            //if (subcategoryId.HasValue)
            //    query = query.Where(p => p.SubCategoryId == subcategoryId.Value);
            //else if (categoryId.HasValue)
            //    query = query.Where(p => p.SubCategory != null && p.SubCategory.CategoryId == categoryId.Value);

            //// Apply Brand filter
            //if (!string.IsNullOrWhiteSpace(brand) && brand.ToLower() != "all")
            //    query = query.Where(p => p.Brand != null && p.Brand.ToLower() == brand.ToLower());

            //// Apply Search filter
            //if (!string.IsNullOrWhiteSpace(search))
            //{
            //    string keyword = search.ToLower();
            //    query = query.Where(p =>
            //        (p.Name != null && p.Name.ToLower().Contains(keyword)) ||
            //        (p.Description != null && p.Description.ToLower().Contains(keyword))
            //    );
            //}

            // Fetch the products
            var products = await query
                .Select(p => new ProductPublicListDto
                {
                    Id = p.Id,
                    Title = p.Name,
                    Price = p.Price,
                    Stock = p.Stock,
                    Brand = p.Brand,
                    Category = p.Category != null ? p.Category.Name : null,
                    SubCategory = p.SubCategory != null ? p.SubCategory.Name : null,
                    Thumbnail = p.ProductImages != null && p.ProductImages.Any(img => img.IsPrimary)
                        ? p.ProductImages.First(img => img.IsPrimary).ImageUrl
                        : p.ImagePath
                })
                .ToListAsync();

            // Return the products without pagination
            return Ok(new { total = products.Count, products });
        }

        [HttpPut("{id}/toggle-inactive")]
        public async Task<IActionResult> ToggleInactive(int id)
        {
            // Create a debug log string to send in the response
            var debugLogs = new List<string>();

            // Debug: Log the received ID
            debugLogs.Add("Received Product ID: " + id);

            // Attempt to find the product in the database
            var product = await _context.Products.FindAsync(id);

            // Debug: Check if the product is null
            if (product == null)
            {
                debugLogs.Add("Product not found with ID: " + id);
                return NotFound(new { debugLogs });
            }

            // Debug: Log the current 'inactive' value of the product
            debugLogs.Add("Current 'Inactive' status: " + product.Inactive);

            // Toggle the 'inactive' status
            product.Inactive = !product.Inactive;

            // Debug: Log the new 'inactive' value after toggling
            debugLogs.Add("New 'Inactive' status: " + product.Inactive);

            // Mark the product entity as modified (optional)
            _context.Entry(product).State = EntityState.Modified;

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
                debugLogs.Add("Product status successfully updated!");
            }
            catch (Exception ex)
            {
                // Debug: Log error if there is an exception during SaveChanges
                debugLogs.Add("Error occurred while saving changes: " + ex.Message);
                return StatusCode(500, new { debugLogs, error = "Internal server error while updating product status." });
            }

            // Return successful response with debug logs
            return Ok(new { debugLogs, message = "Product status updated successfully!" });
        }



        // GET: /api/products/{id}
        //[HttpGet("{id}")]
        //[AllowAnonymous]
        //public async Task<IActionResult> GetProductById(int id)
        //{
        //    var product = await _context.Products
        //        .Include(p => p.ProductImages)
        //        .Include(p => p.Category)
        //        .Include(p => p.SubCategory)
        //        .FirstOrDefaultAsync(p => p.Id == id);

        //    if (product == null) return NotFound();

        //    var dto = new ProductPublicDetailDto
        //    {
        //        Id = product.Id,
        //        Title = product.Name,
        //        Price = product.Price,
        //        Stock = product.Stock,
        //        Description = product.Description,
        //        Brand = product.Brand,
        //        Category = product.Category?.Name,
        //        SubCategory = product.SubCategory?.Name,
        //        Thumbnail = product.ProductImages.FirstOrDefault(img => img.IsPrimary)?.ImageUrl ?? product.ImagePath,
        //        Images = product.ProductImages.Select(pi => pi.ImageUrl).ToList()
        //    };

        //    return Ok(dto);
        //}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            // Calculate final price
            decimal finalprice = product.Price;

            if (product.DiscountPercent.HasValue && product.DiscountPercent.Value > 0)
            {
                finalprice = product.Price * (1 - product.DiscountPercent.Value / 100);
            }
            else if (product.DiscountPrice.HasValue && product.DiscountPrice.Value > 0)
            {
                finalprice = product.Price - product.DiscountPrice.Value;
            }

            var dto = new ProductPublicDetailDto
            {
                Id = product.Id,
                Title = product.Name,
                Price = product.Price,
                Stock = product.Stock,
                Description = product.Description,
                Brand = product.Brand,
                Category = product.Category?.Name,
                SubCategory = product.SubCategory?.Name,
                Thumbnail = product.ProductImages.FirstOrDefault(img => img.IsPrimary)?.ImageUrl ?? product.ImagePath,
                Images = product.ProductImages.Select(pi => pi.ImageUrl).ToList(),

                // Discount fields
                DiscountPercent = product.DiscountPercent,
                DiscountPrice = product.DiscountPrice,
                finalprice = finalprice
            };

            return Ok(dto);
        }


        // DTOs
        public class ProductPublicListDto
        {
            public int Id { get; set; }
            public string Title { get; set; } = null!;
            public decimal Price { get; set; }
            public int Stock { get; set; }
            public string? Brand { get; set; }
            public string? Category { get; set; }
            public string? SubCategory { get; set; }
            public string? Thumbnail { get; set; }
            public decimal? DiscountPercent { get; set; }
            public decimal? DiscountPrice { get; set; }
            public decimal? finalprice { get; set; }
        }

        public class ProductPublicDetailDto
        {
            public int Id { get; set; }
            public string Title { get; set; } = null!;
            public decimal Price { get; set; }
            public int Stock { get; set; }
            public string? Brand { get; set; }
            public string? Description { get; set; }
            public string? Category { get; set; }
            public string? SubCategory { get; set; }
            public string? Thumbnail { get; set; }
            public List<string> Images { get; set; } = new List<string>();
            public decimal? DiscountPercent { get; set; }
            public decimal? DiscountPrice { get; set; }
            public decimal? finalprice { get; set; }
        }
    }
}
