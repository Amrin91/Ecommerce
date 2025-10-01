using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MyEcommerce.Models;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Linq;
using System;

namespace MyEcommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ProductWishlistController : ControllerBase
    {
        private readonly MyEcomContext _context;

        public ProductWishlistController(MyEcomContext context)
        {
            _context = context;
        }

        // ---------------- Helper Methods ----------------
        private int? GetUserId()
        {
            string[] claimTypes = new[] {
                ClaimTypes.NameIdentifier,
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
                "sub",
                "id",
                "userId",
                "nameid"
            };

            foreach (var type in claimTypes)
            {
                var claim = User.FindFirst(type);
                if (claim != null && int.TryParse(claim.Value, out int id))
                    return id;
            }

            return null;
        }

        private string? GetUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;
        }

        // ---------------- GET api/productwishlist ----------------
        [HttpGet]
        public async Task<IActionResult> GetWishlistProducts()
        {
            var userId = GetUserId();
            var role = GetUserRole();

            if (userId == null || string.IsNullOrEmpty(role))
                return Unauthorized("User not authenticated");

            var wishlistProducts = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Product)
                .Select(w => new
                {
                    id = w.Product.Id,
                    title = w.Product.Name,
                    price = w.Product.Price,
                    thumbnail = w.Product.ImagePath,
                    isWishlisted = true
                })
                .ToListAsync();

            return Ok(wishlistProducts);
        }


        // ---------------- POST api/productwishlist/toggle ----------------
        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleWishlist([FromBody] ToggleWishlistDto dto)
        {
            var userId = GetUserId();
            var role = GetUserRole();

            if (userId == null || string.IsNullOrEmpty(role) || role.ToLower() != "customer")
                return Unauthorized("Only customers can modify wishlist");

            var productExists = await _context.Products.AnyAsync(p => p.Id == dto.ProductId);
            if (!productExists)
                return NotFound(new { message = $"Product with id {dto.ProductId} not found." });

            var existing = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == dto.ProductId);

            if (existing != null)
            {
                // Remove from wishlist
                _context.Wishlists.Remove(existing);
                await _context.SaveChangesAsync();
                return Ok(new { isWishlisted = false, productId = dto.ProductId });
            }
            else
            {
                // Add to wishlist
                var wishlist = new Wishlist
                {
                    UserId = userId.Value,
                    ProductId = dto.ProductId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Wishlists.Add(wishlist);
                await _context.SaveChangesAsync();

                // Return full product info for frontend
                var product = await _context.Products
                    .Where(p => p.Id == dto.ProductId)
                    .Select(p => new
                    {
                        id = p.Id,
                        title = p.Name,
                        price = p.Price,
                        thumbnail = p.ImagePath,
                        IsWishlisted = true
                    })
                    .FirstOrDefaultAsync();

                return Ok(new { isWishlisted = true, product });
            }
        }


        // ---------------- DELETE api/productwishlist/{productId} ----------------
        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            var userId = GetUserId();
            var role = GetUserRole();

            if (userId == null || string.IsNullOrEmpty(role) || role.ToLower() != "customer")
                return Unauthorized("Only customers can delete wishlist items");

            var item = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (item == null)
                return NotFound();

            _context.Wishlists.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTO for toggle
    public class ToggleWishlistDto
    {
        public int ProductId { get; set; }
    }
}
