

// POST: api/AdminProducts
/*[HttpPost]
[Authorize(Roles = "user,admin")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> AddProduct([FromForm] ProductCreateDto dto)
{
    if (dto.Images == null || dto.Images.Count == 0)
        return BadRequest("At least one image is required.");

    // Create product entity
    var product = new Product
    {
        Name = dto.Name,
        Brand = dto.Brand,
        Price = dto.Price,
        Stock = dto.Stock,
        CategoryId = dto.CategoryId,
        SubCategoryId = dto.SubCategoryId,
        CreatedAt = DateTime.UtcNow,
        ImagePath = "" // will set after first image upload
    };

    _context.Products.Add(product);
    await _context.SaveChangesAsync(); // save to get product.Id

    var uploadsFolder = Path.Combine(_env.WebRootPath ?? "", "images", "products");
    if (!Directory.Exists(uploadsFolder))
        Directory.CreateDirectory(uploadsFolder);

    for (int i = 0; i < dto.Images.Count; i++)
    {
        var image = dto.Images[i];
        var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        // Save file to wwwroot/images/products
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var imageUrl = $"{baseUrl}/images/products/{uniqueFileName}";

        // Set first image as default ImagePath, or primary image if specified
        if (i == 0 || (dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value))
            product.ImagePath = imageUrl;

        var productImage = new ProductImage
        {
            ProductId = product.Id,
            ImageUrl = imageUrl,
            IsPrimary = dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value
        };

        _context.ProductImages.Add(productImage);
    }

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Product added successfully",
        productId = product.Id,
        defaultImage = product.ImagePath
    });
}*/

// POST: api/AdminProducts


/*using Microsoft.AspNetCore.Http;
using MyEcommerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using System;

namespace MyEcommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin,user")]
    public class AdminProductsController : ControllerBase
    {
        private readonly MyEcomContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminProductsController(MyEcomContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/AdminProducts
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? categoryId,
            [FromQuery] int? subcategoryId,
            [FromQuery] string? search,
            [FromQuery] string? brand,
            [FromQuery] string? sortPrice, // "HighToLow"/"LowToHigh"
            [FromQuery] string? sortName,  // "AtoZ"/"ZtoA"
            [FromQuery] int limit = 50,
            [FromQuery] int skip = 0
        )
        {
            const int maxLimit = 100;
            limit = (limit <= 0 || limit > maxLimit) ? 50 : limit;

            var query = _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .AsQueryable(); // Admin sees all, even inactive

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

            // Sorting
            IOrderedQueryable<Product> orderedQuery = query.OrderByDescending(p => p.CreatedAt);

            if (!string.IsNullOrWhiteSpace(sortPrice))
            {
                orderedQuery = sortPrice.ToLower() switch
                {
                    "hightolow" => query.OrderByDescending(p => p.Price),
                    "lowtohigh" => query.OrderBy(p => p.Price),
                    _ => query.OrderByDescending(p => p.CreatedAt)
                };
            }

            if (!string.IsNullOrWhiteSpace(sortName))
            {
                orderedQuery = sortName.ToLower() switch
                {
                    "atoz" => orderedQuery.ThenBy(p => p.Name ?? string.Empty),
                    "ztoa" => orderedQuery.ThenByDescending(p => p.Name ?? string.Empty),
                    _ => orderedQuery
                };
            }

            var total = await orderedQuery.CountAsync();

            var products = await orderedQuery
                .Skip(skip)
                .Take(limit)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Brand,
                    p.Price,
                    p.Stock,
                    Category = p.Category != null ? p.Category.Name : null,
                    SubCategory = p.SubCategory != null ? p.SubCategory.Name : null,
                    Thumbnail = p.ProductImages != null && p.ProductImages.Any(img => img.IsPrimary)
                        ? p.ProductImages.First(img => img.IsPrimary).ImageUrl
                        : p.ImagePath,
                    p.Inactive
                })
                .ToListAsync();

            return Ok(new { total, products });
        }

        // GET: api/AdminProducts/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            return Ok(product);
        }

        // POST: api/AdminProducts
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddProduct([FromForm] ProductCreateDto dto)
        {
            if (dto.Images == null || dto.Images.Count == 0)
                return BadRequest("At least one image is required.");

            bool isAdmin = User.IsInRole("admin");
            bool isInactive = !isAdmin;

            var product = new Product
            {
                Name = dto.Name,
                Brand = dto.Brand,
                Price = dto.Price,
                Stock = dto.Stock,
                Description = dto.Description ?? "No Description",
                CategoryId = dto.CategoryId,
                SubCategoryId = dto.SubCategoryId,
                SKU = dto.SKU ?? "No SKU",
                Color = dto.Color ?? "No Color",
                Specification = dto.Specification ?? "No Specification",
                Inactive = isInactive,
                CreatedAt = DateTime.UtcNow,
                ImagePath = ""
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "", "images", "products");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            for (int i = 0; i < dto.Images.Count; i++)
            {
                var image = dto.Images[i];
                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await image.CopyToAsync(stream);

                var imageUrl = $"/images/products/{uniqueFileName}";

                if (i == 0 || (dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value))
                    product.ImagePath = imageUrl;

                var productImage = new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = imageUrl,
                    IsPrimary = dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value
                };

                _context.ProductImages.Add(productImage);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Product added successfully", productId = product.Id, mainImage = product.ImagePath });
        }

        // PUT: api/AdminProducts/{id}
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductUpdateDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = dto.Name ?? product.Name;
            product.Brand = dto.Brand ?? product.Brand;
            product.Description = dto.Description ?? product.Description;
            product.Price = dto.Price ?? product.Price;
            product.Stock = dto.Stock ?? product.Stock;
            product.SKU = dto.SKU ?? product.SKU;
            product.Color = dto.Color ?? product.Color;
            product.Specification = dto.Specification ?? product.Specification;
            product.Inactive = dto.Inactive ?? product.Inactive;
            product.CategoryId = dto.CategoryId ?? product.CategoryId;
            product.SubCategoryId = dto.SubCategoryId ?? product.SubCategoryId;

            if (dto.Images != null && dto.Images.Count > 0)
            {
                var oldImages = _context.ProductImages.Where(pi => pi.ProductId == product.Id);
                _context.ProductImages.RemoveRange(oldImages);

                var uploadsFolder = Path.Combine(_env.WebRootPath ?? "", "images", "products");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                for (int i = 0; i < dto.Images.Count; i++)
                {
                    var image = dto.Images[i];
                    var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await image.CopyToAsync(stream);

                    var imageUrl = $"/images/products/{uniqueFileName}";

                    if (i == 0 || (dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value))
                        product.ImagePath = imageUrl;

                    var productImage = new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = imageUrl,
                        IsPrimary = dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value
                    };

                    _context.ProductImages.Add(productImage);
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/AdminProducts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            var images = _context.ProductImages.Where(pi => pi.ProductId == product.Id);
            _context.ProductImages.RemoveRange(images);

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class ProductCreateDto
    {
        public string Name { get; set; } = null!;
        public string? Brand { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public int SubCategoryId { get; set; }
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
        public int? PrimaryImageIndex { get; set; }
        public string? SKU { get; set; }
        public string? Color { get; set; }
        public string? Specification { get; set; }
        public bool? Inactive { get; set; }
    }

    public class ProductUpdateDto
    {
        public string? Name { get; set; }
        public string? Brand { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
        public int? PrimaryImageIndex { get; set; }
        public string? SKU { get; set; }
        public string? Color { get; set; }
        public string? Specification { get; set; }
        public bool? Inactive { get; set; }
    }
}*/


using Microsoft.AspNetCore.Http;
using MyEcommerce.Models;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.IO;
using System;

namespace MyEcommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin,user")]
    public class AdminProductsController : ControllerBase
    {
        private readonly MyEcomContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminProductsController(MyEcomContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/AdminProducts
        /*[HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Include(p => p.ProductImages)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(products);
        }*/

        /*[HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Include(p => p.ProductImages)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(products);
        }*/

        // AdminProductsController.cs
        //[ApiController]
        [Route("api/[controller]")]
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll(
                [FromQuery] int? categoryId,
                [FromQuery] int? subcategoryId,
                [FromQuery] string? search,
                [FromQuery] string? brand,
                [FromQuery] string? sortPrice, // "HighToLow"/"LowToHigh"
                [FromQuery] string? sortName,  // "AtoZ"/"ZtoA"
                [FromQuery] int limit = 50,
                [FromQuery] int skip = 0
            )
        {
            const int maxLimit = 100;
            limit = (limit <= 0 || limit > maxLimit) ? 50 : limit;

            var query = _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .AsQueryable(); // Admin sees all, even inactive

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

            // Sorting
            IOrderedQueryable<Product>? orderedQuery = null;

            if (!string.IsNullOrWhiteSpace(sortPrice))
            {
                orderedQuery = sortPrice.ToLower() switch
                {
                    "hightolow" => query.OrderByDescending(p => p.Price),
                    "lowtohigh" => query.OrderBy(p => p.Price),
                    _ => query.OrderByDescending(p => p.CreatedAt)
                };

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
            else if (!string.IsNullOrWhiteSpace(sortName))
            {
                orderedQuery = sortName.ToLower() switch
                {
                    "atoz" => query.OrderBy(p => p.Name ?? string.Empty),
                    "ztoa" => query.OrderByDescending(p => p.Name ?? string.Empty),
                    _ => query.OrderByDescending(p => p.CreatedAt)
                };
            }
            else
            {
                orderedQuery = query.OrderByDescending(p => p.CreatedAt);
            }

            var total = await orderedQuery.CountAsync();

            var products = await orderedQuery
                .Skip(skip)
                .Take(limit)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Brand,
                    p.Price,
                    p.Stock,
                    Category = p.Category != null ? p.Category.Name : null,
                    SubCategory = p.SubCategory != null ? p.SubCategory.Name : null,
                    Thumbnail = p.ProductImages != null && p.ProductImages.Any(img => img.IsPrimary)
                        ? p.ProductImages.First(img => img.IsPrimary).ImageUrl
                        : p.ImagePath,
                    p.Inactive
                })
                .ToListAsync();

            return Ok(new { total, products });
        }
    


        // GET: api/AdminProducts/filter
        [HttpGet("filter")]
        [Authorize(Roles = "admin,user")]
        public async Task<IActionResult> GetFiltered(
       [FromQuery] int? subcategoryId,
       [FromQuery] string? brand,
       [FromQuery] string? sortPrice,   // "HighToLow" / "LowToHigh"
       [FromQuery] string? sortName,    // "AtoZ" / "ZtoA"
       [FromQuery] int limit = 30,
       [FromQuery] int skip = 0
   )
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Include(p => p.ProductImages)
                .AsQueryable();

            // Role check
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userRole == "user")
            {
                // Users see only active products
                query = query.Where(p => p.Inactive == false);
            }

            if (subcategoryId.HasValue)
                query = query.Where(p => p.SubCategoryId == subcategoryId.Value);

            if (!string.IsNullOrEmpty(brand) && brand.ToLower() != "all")
                query = query.Where(p => p.Brand != null && p.Brand.ToLower() == brand.ToLower());

            if (!string.IsNullOrEmpty(sortPrice))
            {
                query = sortPrice.ToLower() switch
                {
                    "hightolow" => query.OrderByDescending(p => p.Price),
                    "lowtohigh" => query.OrderBy(p => p.Price),
                    _ => query
                };
            }

            if (!string.IsNullOrEmpty(sortName))
            {
                query = sortName.ToLower() switch
                {
                    "atoz" => query.OrderBy(p => p.Name),
                    "ztoa" => query.OrderByDescending(p => p.Name),
                    _ => query
                };
            }

            var total = await query.CountAsync();

            var products = await query
                .Skip(skip)
                .Take(limit)
                .Select(p => new
                {
                    id = p.Id,
                    title = p.Name,
                    brand = p.Brand,
                    description = p.Description,
                    price = p.Price,
                    stock = p.Stock,
                    sku = p.SKU,
                    color = p.Color,
                    specification = p.Specification,
                    inactive = p.Inactive ?? false, // coalesce null to false
                    category = p.Category != null ? p.Category.Name : null,
                    subcategory = p.SubCategory != null ? p.SubCategory.Name : null,
                    thumbnail = p.ImagePath
                })
                .ToListAsync();

            return Ok(new { total, products });
        }


        // GET: api/AdminProducts/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            return Ok(product);
        }

        // POST: api/AdminProducts
        [HttpPost]
        [Authorize(Roles = "admin,user")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddProduct([FromForm] ProductCreateDto dto)
        {
            if (dto.Images == null || dto.Images.Count == 0)
                return BadRequest("At least one image is required.");

            // Check the current user's role
            bool isAdmin = User.IsInRole("admin");
            bool isInactive = !isAdmin;  // If not admin, set Inactive to true (1)

            var product = new Product
            {
                Name = dto.Name,
                Brand = dto.Brand,
                Price = dto.Price,
                Stock = dto.Stock,
                Description = dto.Description ??" " ,
                CategoryId = dto.CategoryId,
                SubCategoryId = dto.SubCategoryId,
                SKU = dto.SKU ?? "No SKU",
                Color = dto.Color ?? "No Color",
                Specification = dto.Specification ?? "No Specification",
                Inactive = isInactive,  // Set Inactive based on role
                CreatedAt = DateTime.UtcNow,
                ImagePath = ""
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "", "images", "products");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            for (int i = 0; i < dto.Images.Count; i++)
            {
                var image = dto.Images[i];
                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await image.CopyToAsync(stream);

                var imageUrl = $"{Request.Scheme}://{Request.Host}/images/products/{uniqueFileName}";

                if (i == 0 && !dto.PrimaryImageIndex.HasValue)
                    product.ImagePath = imageUrl;

                if (dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value)
                    product.ImagePath = imageUrl;

                var productImage = new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = imageUrl,
                    IsPrimary = dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value
                };

                _context.ProductImages.Add(productImage);
            }

            await _context.SaveChangesAsync();

            var images = await _context.ProductImages
                .Where(pi => pi.ProductId == product.Id)
                .Select(pi => new { pi.ImageUrl, pi.IsPrimary })
                .ToListAsync();

            return Ok(new
            {
                message = "Product added successfully",
                productId = product.Id,
                mainImage = product.ImagePath,
                images
            });
        }

        // GET: api/AdminProducts/search?query=phone
        [HttpGet("search")]
        [Authorize(Roles = "admin,user")]
        public async Task<IActionResult> Search(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(new List<object>()); // return empty if no query

            query = query.ToLower();

            var products = await _context.Products
                .Where(p => (p.Name != null && p.Name.ToLower().Contains(query))
                         || (p.SKU != null && p.SKU.ToLower().Contains(query)))
                .Select(p => new {
                    id = p.Id,
                    title = p.Name,
                    brand = p.Brand,
                    price = p.Price,
                    thumbnail = p.ImagePath
                })
                .ToListAsync();

            return Ok(products);
        }


        // PUT: api/AdminProducts/{id}
        //[HttpPut("{id}")]
        //[Consumes("multipart/form-data")]
        //public async Task<IActionResult> Update(int id, [FromForm] ProductUpdateDto dto)
        //{
        //    var product = await _context.Products.FindAsync(id);
        //    if (product == null) return NotFound();

        //    product.Name = dto.Name ?? product.Name;
        //    product.Brand = dto.Brand ?? product.Brand;
        //    product.Description = dto.Description ?? product.Description;
        //    product.Price = dto.Price ?? product.Price;
        //    product.Stock = dto.Stock ?? product.Stock;
        //    product.SKU = dto.SKU ?? product.SKU;
        //    product.Color = dto.Color ?? product.Color;
        //    product.Specification = dto.Specification ?? product.Specification;

        //    if (dto.Inactive.HasValue)
        //        product.Inactive = dto.Inactive.Value;

        //    if (dto.CategoryId.HasValue)
        //        product.CategoryId = dto.CategoryId.Value;

        //    if (dto.SubCategoryId.HasValue)
        //        product.SubCategoryId = dto.SubCategoryId.Value;

        //    if (dto.Images != null && dto.Images.Count > 0)
        //    {
        //        var oldImages = _context.ProductImages.Where(pi => pi.ProductId == product.Id);
        //        _context.ProductImages.RemoveRange(oldImages);

        //        var uploadsFolder = Path.Combine(_env.WebRootPath ?? "", "images", "products");
        //        if (!Directory.Exists(uploadsFolder))
        //            Directory.CreateDirectory(uploadsFolder);

        //        for (int i = 0; i < dto.Images.Count; i++)
        //        {
        //            var image = dto.Images[i];
        //            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        //            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        //            using (var stream = new FileStream(filePath, FileMode.Create))
        //            {
        //                await image.CopyToAsync(stream);
        //            }

        //            var imageUrl = $"/images/products/{uniqueFileName}";

        //            if (i == 0 || (dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value))
        //                product.ImagePath = imageUrl;

        //            var productImage = new ProductImage
        //            {
        //                ProductId = product.Id,
        //                ImageUrl = imageUrl,
        //                IsPrimary = dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value
        //            };

        //            _context.ProductImages.Add(productImage);
        //        }
        //    }

        //    await _context.SaveChangesAsync();
        //    return NoContent();
        //}

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductUpdateDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound("Product not found.");

            // ==============================
            // Update basic fields
            // ==============================
            product.Name = dto.Name ?? product.Name;
            product.Brand = dto.Brand ?? product.Brand;
            product.Description = dto.Description ?? product.Description;
            product.Price = dto.Price ?? product.Price;
            product.Stock = dto.Stock ?? product.Stock;
            product.SKU = dto.SKU ?? product.SKU;
            product.Color = dto.Color ?? product.Color;
            product.Specification = dto.Specification ?? product.Specification;

            if (dto.Inactive.HasValue)
                product.Inactive = dto.Inactive.Value;

            if (dto.CategoryId.HasValue)
                product.CategoryId = dto.CategoryId.Value;

            if (dto.SubCategoryId.HasValue)
                product.SubCategoryId = dto.SubCategoryId.Value;

            // ==============================
            // Handle discount fields
            // ==============================
            //if (dto.DiscountPercent.HasValue && dto.DiscountPrice.HasValue)
            //    return BadRequest("Only one type of discount is allowed at a time.");

            //product.DiscountPercent = dto.DiscountPercent;
            //product.DiscountPrice = dto.DiscountPrice;

            // ==============================
            // Handle images
            // ==============================
            if (dto.Images != null && dto.Images.Count > 0)
            {
                // Remove old images
                var oldImages = _context.ProductImages.Where(pi => pi.ProductId == product.Id);
                _context.ProductImages.RemoveRange(oldImages);

                var uploadsFolder = Path.Combine(_env.WebRootPath ?? "", "images", "products");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                for (int i = 0; i < dto.Images.Count; i++)
                {
                    var image = dto.Images[i];
                    var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await image.CopyToAsync(stream);

                    var imageUrl = $"{Request.Scheme}://{Request.Host}/images/products/{uniqueFileName}";

                    // Set main image
                    if (i == 0 && !dto.PrimaryImageIndex.HasValue)
                        product.ImagePath = imageUrl;

                    if (dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value)
                        product.ImagePath = imageUrl;

                    var productImage = new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = imageUrl,
                        IsPrimary = dto.PrimaryImageIndex.HasValue && i == dto.PrimaryImageIndex.Value
                    };

                    _context.ProductImages.Add(productImage);
                }
            }

            await _context.SaveChangesAsync();

            // ==============================
            // Calculate final price
            // ==============================
            //decimal finalPrice = product.Price;
            //if (product.DiscountPercent.HasValue)
            //    finalPrice = product.Price * (1 - product.DiscountPercent.Value / 100m);
            //else if (product.DiscountPrice.HasValue)
            //    finalPrice = product.Price - product.DiscountPrice.Value;

            // ==============================
            // Return updated product info
            // ==============================
            var images = await _context.ProductImages
                .Where(pi => pi.ProductId == product.Id)
                .Select(pi => new { pi.ImageUrl, pi.IsPrimary })
                .ToListAsync();

            return Ok(new
            {
                message = "Product updated successfully",
                productId = product.Id,
                mainImage = product.ImagePath,
                price = product.Price,
                //discountPercent = product.DiscountPercent,
                //discountPrice = product.DiscountPrice,
                //finalPrice,
                images
            });
        }




        //[HttpPut("{id}/discount")]
        //public async Task<IActionResult> UpdateDiscount(int id, [FromBody] DiscountUpdateDto dto)
        //{
        //    var product = await _context.Products.FindAsync(id);
        //    if (product == null) return NotFound("Product not found.");

        //    // ==============================
        //    // Validate discount
        //    // ==============================
        //    if (dto.DiscountPercent.HasValue && dto.DiscountPrice.HasValue)
        //        return BadRequest("Only one type of discount is allowed at a time.");

        //    if (dto.DiscountPercent.HasValue && (dto.DiscountPercent.Value < 0 || dto.DiscountPercent.Value > 100))
        //        return BadRequest("Discount percent must be between 0 and 100.");

        //    if (dto.DiscountPrice.HasValue && dto.DiscountPrice.Value >= product.Price)
        //        return BadRequest("Discount price must be less than the original price.");

        //    // ==============================
        //    // Apply discount & override price
        //    // ==============================
        //    if (dto.DiscountPercent.HasValue)
        //    {
        //        product.DiscountPercent = dto.DiscountPercent;
        //        product.DiscountPrice = null;
        //        product.Price = product.Price * (1 - dto.DiscountPercent.Value / 100m);
        //    }
        //    else if (dto.DiscountPrice.HasValue)
        //    {
        //        product.DiscountPrice = dto.DiscountPrice;
        //        product.DiscountPercent = null;
        //        product.Price = product.Price - dto.DiscountPrice.Value;
        //    }
        //    else
        //    {
        //        product.DiscountPercent = null;
        //        product.DiscountPrice = null;
        //    }

        //    await _context.SaveChangesAsync();

        //    return Ok(new
        //    {
        //        message = "Discount applied successfully",
        //        productId = product.Id,
        //        price = product.Price,
        //        discountPercent = product.DiscountPercent,
        //        discountPrice = product.DiscountPrice
        //    });
        //}

        [HttpPut("{id}/discount")]
        public async Task<IActionResult> UpdateDiscount(int id, [FromBody] DiscountUpdateDto dto)
        {
            // 1. Find product
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound("Product not found.");

            // 2. Validate discount
            if (dto.DiscountPercent.HasValue && dto.DiscountPrice.HasValue)
                return BadRequest("Only one type of discount is allowed at a time.");

            if (dto.DiscountPercent.HasValue && (dto.DiscountPercent.Value < 0 || dto.DiscountPercent.Value > 100))
                return BadRequest("Discount percent must be between 0 and 100.");

            if (dto.DiscountPrice.HasValue && dto.DiscountPrice.Value >= product.Price)
                return BadRequest("Discount price must be less than the original price.");

            // 3. Apply discount
            product.DiscountPercent = dto.DiscountPercent;
            product.DiscountPrice = dto.DiscountPrice;

            // 4. Update finalprice in DB (only if normal column, not computed)
            product.finalprice = product.DiscountPercent.HasValue
                ? product.Price * (1 - product.DiscountPercent.Value / 100m)
                : product.DiscountPrice.HasValue
                    ? product.Price - product.DiscountPrice.Value
                    : product.Price;

            // 5. Save changes
            await _context.SaveChangesAsync();

            // 6. Return response
            return Ok(new
            {
                message = "Discount updated successfully",
                productId = product.Id,
                price = product.Price,                       // original price
                discountPercent = product.DiscountPercent,   // discount percent
                discountPrice = product.DiscountPrice,       // discount amount
                finalPrice = product.finalprice              // discounted price
            });
        }



        // DELETE: api/AdminProducts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            var images = _context.ProductImages.Where(pi => pi.ProductId == product.Id);
            _context.ProductImages.RemoveRange(images);

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    // DTOs for adding and updating products
    public class ProductCreateDto
    {
        public string Name { get; set; } = null!;
        public string? Brand { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
        public int? PrimaryImageIndex { get; set; }
        public string? SKU { get; set; }
        public string? Color { get; set; }
        public string? Specification { get; set; }
        public bool? Inactive { get; set; }
        public decimal? DiscountPercent { get; set; }  // null by default
        public decimal? DiscountPrice { get; set; }    // null by default
    }

    public class ProductUpdateDto
    {
        public string? Name { get; set; }
        public string? Brand { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
        public int? PrimaryImageIndex { get; set; }
        public string? SKU { get; set; }
        public string? Color { get; set; }
        public string? Specification { get; set; }
        public bool? Inactive { get; set; }
        public decimal? DiscountPercent { get; set; }  // null by default
        public decimal? DiscountPrice { get; set; }    // null by default

    }
    public class DiscountUpdateDto
    {
        public decimal? DiscountPercent { get; set; }
        public decimal? DiscountPrice { get; set; }
        public decimal? finalprice { get; set; }

    }

}

