/*using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyEcommerce.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using System;

namespace MyEcommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly MyEcomContext _context;

        public CartController(MyEcomContext context)
        {
            _context = context;
        }

        // GET: api/Cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var cartItems = await _context.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .ToListAsync();

            var totalAmount = cartItems.Sum(ci => (ci.Product?.Price ?? 0) * (ci.Quantity ?? 0));

            return Ok(new
            {
                items = cartItems.Select(ci => new
                {
                    ci.Id,
                    ProductId = ci.ProductId,
                    ProductName = ci.Product?.Name,
                    ci.Quantity,
                    Price = ci.Product?.Price,
                    SubTotal = (ci.Product?.Price ?? 0) * (ci.Quantity ?? 0)
                }),
                totalAmount
            });
        }

        // POST: api/Cart/add
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] CartItem dto)
        {
            if (dto.ProductId == null || dto.Quantity == null || dto.Quantity <= 0)
                return BadRequest("Invalid product or quantity.");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
                _context.CartItems.Update(existingItem);
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                    AddedAt = DateTime.UtcNow
                };
                await _context.CartItems.AddAsync(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Product added to cart." });
        }

        // PUT: api/Cart/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, [FromBody] CartItem dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.Id == id && ci.UserId == userId);

            if (cartItem == null) return NotFound("Cart item not found.");

            if (dto.Quantity != null && dto.Quantity > 0)
                cartItem.Quantity = dto.Quantity;
            else
                return BadRequest("Invalid quantity.");

            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart item updated." });
        }

        // DELETE: api/Cart/remove/{id}
        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveCartItem(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.Id == id && ci.UserId == userId);

            if (cartItem == null) return NotFound("Cart item not found.");

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart item removed." });
        }

        // POST: api/Cart/checkout
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var cartItems = await _context.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any()) return BadRequest("Cart is empty.");

            // Create Order
            var order = new Order
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                TotalAmount = cartItems.Sum(ci => (ci.Product?.Price ?? 0) * (ci.Quantity ?? 0))
            };
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            // Add OrderItems
            foreach (var ci in cartItems)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    Price = ci.Product?.Price ?? 0
                };
                await _context.OrderItems.AddAsync(orderItem);

                // Optionally reduce stock
                if (ci.Product != null && ci.Product.Stock >= ci.Quantity)
                {
                    ci.Product.Stock -= ci.Quantity ?? 0;
                    _context.Products.Update(ci.Product);
                }
            }

            // Clear cart
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Checkout successful.", orderId = order.Id });
        }
    }
}*/
