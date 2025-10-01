using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MyEcommerce.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace MyEcommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly MyEcomContext _context;

        public OrdersController(MyEcomContext context)
        {
            _context = context;
        }

        // Get all orders or by userId
        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] int? userId)
        {
            var ordersQuery = _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payments)
                .AsQueryable();

            if (userId.HasValue)
            {
                ordersQuery = ordersQuery.Where(o => o.UserId == userId);
            }

            var orders = await ordersQuery.ToListAsync();

            var result = orders.Select(order => new
            {
                order.Id,
                order.UserId,
                order.Name,
                order.Mobile,
                order.Address,
                order.Status,
                order.Total,
                order.CreatedAt,
                PaymentMethod = order.Payments.FirstOrDefault()?.PaymentMethod ?? "No Payment",
                Items = order.OrderItems.Select(item => new
                {
                    item.ProductId,
                    item.Product.ImagePath,
                    item.Quantity,
                    item.PriceAtPurchase,
                    ProductName = item.Product.Name
                }),
                Payments = order.Payments.Select(payment => new
                {
                    payment.Amount,
                    payment.PaymentMethod,
                    payment.PaidAt
                })
            });

            return Ok(result);
        }

        // Get order by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return Ok(new
            {
                id = order.Id,
                name = order.Name,
                mobile = order.Mobile,
                address = order.Address,
                status = order.Status,
                total = order.Total,
                createdAt = order.CreatedAt,
                paymentMethod = order.Payments.FirstOrDefault()?.PaymentMethod ?? "No Payment",
                items = order.OrderItems.Select(item => new
                {
                    productId = item.ProductId,
                    quantity = item.Quantity,
                    priceAtPurchase = item.PriceAtPurchase,
                    productName = item.Product?.Name ?? "Unnamed product"
                }),
                payments = order.Payments.Select(payment => new
                {
                    amount = payment.Amount,
                    paymentMethod = payment.PaymentMethod,
                    paidAt = payment.PaidAt
                })
            });
        }

        // Place new order (Authenticated customers only)
        [HttpPost]
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderRequest request)
        {
            int? userId = null;
            string[] possibleClaimTypes = new[]
            {
                ClaimTypes.NameIdentifier,
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
                "sub", "id", "userId", "nameid"
            };

            foreach (var claimType in possibleClaimTypes)
            {
                var claim = User.FindFirst(claimType);
                if (claim != null && int.TryParse(claim.Value, out int parsedId))
                {
                    userId = parsedId;
                    break;
                }
            }

            var role = User.FindFirst(ClaimTypes.Role)?.Value?.ToLower();
            if (role != "customer")
            {
                userId = null;
            }

            if (request.Items == null || !request.Items.Any())
                return BadRequest("Cart is empty.");

            var order = new Order
            {
                Name = request.Name,
                Mobile = request.Mobile,
                Address = request.Address,
                Status = request.Status,
                Total = request.Total,
                CreatedAt = request.CreatedAt,
                UserId = userId
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var item in request.Items)
            {
                _context.OrderItems.Add(new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    PriceAtPurchase = item.UnitPrice
                });
            }

            await _context.SaveChangesAsync();

            _context.Payments.Add(new Payment
            {
                OrderId = order.Id,
                Amount = order.Total,
                PaymentMethod = request.PaymentMethod,
                PaidAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Ok(new { message = "Order placed successfully", orderId = order.Id });
        }

        // Update order status
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateDto request)
        {
            var existingOrder = await _context.Orders.FindAsync(id);
            if (existingOrder == null)
                return NotFound();

            if (!string.IsNullOrEmpty(request.Status))
                existingOrder.Status = request.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Mark order as delivered
        [HttpPost("{id}/deliver")]
        public async Task<IActionResult> MarkAsDelivered(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            order.Status = "Completed";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order marked as delivered." });
        }

        
        [HttpGet("userorders/{userId}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetUserOrders(int userId)
        {
            var userIdClaim =
                User.FindFirst("userId") ??
                User.FindFirst("sub") ??
                User.FindFirst("nameid") ??
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int loggedInUserId))
            {
                return BadRequest("Invalid user ID from token.");
            }

            
            if (loggedInUserId != userId)
            {
                return Forbid("You are not authorized to view these orders.");
            }

            
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payments)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();


            //var ordersDto = orders.Select(order => new
            //{
            //    id = order.Id,
            //    userId = order.UserId,
            //    name = order.Name,
            //    mobile = order.Mobile,
            //    address = order.Address,
            //    status = order.Status,
            //    total = order.Total,
            //    createdAt = order.CreatedAt,
            //    paymentMethod = order.Payments.FirstOrDefault()?.PaymentMethod ?? "No Payment",
            //    imagePath = item.Product?.Thumbnail ?? item.Product?.ImagePath,
            //    orderItems = order.OrderItems.Select(item => new
            //    {
            //        productId = item.ProductId,
            //        quantity = item.Quantity,
            //        priceAtPurchase = item.PriceAtPurchase,
            //        productName = item.Product?.Name ?? "Unnamed product"
            //    }),
            //    payments = order.Payments.Select(payment => new
            //    {
            //        amount = payment.Amount,
            //        paymentMethod = payment.PaymentMethod,
            //        paidAt = payment.PaidAt
            //    })
            //});
            //var ordersDto = orders.Select(order => new
            //{
            //    id = order.Id,
            //    userId = order.UserId,
            //    name = order.Name,
            //    mobile = order.Mobile,
            //    address = order.Address,
            //    status = order.Status,
            //    total = order.Total,
            //    createdAt = order.CreatedAt,
            //    paymentMethod = order.Payments.FirstOrDefault()?.PaymentMethod ?? "No Payment",


            //    imagePath = order.OrderItems
            //         .Select(i => i.Product? i.Product?.ImagePath)
            //         .FirstOrDefault(),

            //    orderItems = order.OrderItems.Select(item => new
            //    {
            //        productId = item.ProductId,
            //        quantity = item.Quantity,
            //        priceAtPurchase = item.PriceAtPurchase,
            //        productName = item.Product?.Name ?? "Unnamed product",
            //        imagePath = item.Product?. item.Product?.ImagePath
            //    }),

            //    payments = order.Payments.Select(payment => new
            //    {
            //        amount = payment.Amount,
            //        paymentMethod = payment.PaymentMethod,
            //        paidAt = payment.PaidAt
            //    })
            //});

            var ordersDto = orders.Select(order => new
            {
                id = order.Id,
                userId = order.UserId,
                name = order.Name,
                mobile = order.Mobile,
                address = order.Address,
                status = order.Status,
                total = order.Total,
                createdAt = order.CreatedAt,
                paymentMethod = order.Payments.FirstOrDefault()?.PaymentMethod ?? "No Payment",

                // প্রথম প্রোডাক্টের ইমেজ নেবার জন্য
                imagePath = order.OrderItems
        .Select(i => i.Product?.ImagePath)
        .FirstOrDefault(),

                orderItems = order.OrderItems.Select(item => new
                {
                    productId = item.ProductId,
                    quantity = item.Quantity,
                    priceAtPurchase = item.PriceAtPurchase,
                    productName = item.Product?.Name ?? "Unnamed product",
                    imagePath = item.Product?.ImagePath
                }),

                payments = order.Payments.Select(payment => new
                {
                    amount = payment.Amount,
                    paymentMethod = payment.PaymentMethod,
                    paidAt = payment.PaidAt
                })
            });



            return Ok(ordersDto.ToList());
        }

        // Get all orders for a specific date (Admin use)
        // GET: /api/orders/by-date
        [HttpGet("by-date")]
        public async Task<IActionResult> GetOrdersByDate([FromQuery] DateTime date)
        {
            var startDate = date.Date;
            var endDate = startDate.AddDays(1);

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payments)
                .Where(o => o.CreatedAt >= startDate && o.CreatedAt < endDate)
                .ToListAsync();

            var result = orders.Select(order => new
            {
                order.Id,
                order.UserId,
                order.Name,
                order.Mobile,
                order.Address,
                order.Status,
                Total = order.Total,
                CreatedAt = order.CreatedAt,
                PaymentMethod = order.Payments.FirstOrDefault()?.PaymentMethod ?? "No Payment",
                Items = order.OrderItems.Select(item => new
                {
                    item.ProductId,
                    item.Quantity,
                    item.PriceAtPurchase,
                    ProductName = item.Product?.Name ?? "Unnamed product",
                    ProductImage = item.Product.ImagePath
                }),
                Payments = order.Payments.Select(payment => new
                {
                    payment.Amount,
                    payment.PaymentMethod,
                    payment.PaidAt
                })
            });

            return Ok(result);
        }

        // GET: /api/orders/by-range
        [HttpGet("by-range")]
        public async Task<IActionResult> GetOrdersByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            // Ensure end date is after the start date
            if (endDate <= startDate)
            {
                return BadRequest(new { message = "End date must be after start date" });
            }

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payments)
                .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate)
                .ToListAsync();

            var result = orders.Select(order => new
            {
                order.Id,
                order.UserId,
                order.Name,
                order.Mobile,
                order.Address,
                order.Status,
                Total = order.Total,
                CreatedAt = order.CreatedAt,
                PaymentMethod = order.Payments.FirstOrDefault()?.PaymentMethod ?? "No Payment",
                Items = order.OrderItems.Select(item => new
                {
                    item.ProductId,
                    item.Quantity,
                    item.PriceAtPurchase,
                    ProductName = item.Product?.Name ?? "Unnamed product"
                }),
                Payments = order.Payments.Select(payment => new
                {
                    payment.Amount,
                    payment.PaymentMethod,
                    payment.PaidAt
                })
            });

            return Ok(result);
        }



        [HttpPost("cancel/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null || order.Status != "Pending") return NotFound();

            order.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        //For Assigning salesperson
        [HttpPut("{orderId}/salesperson")]
        public async Task<IActionResult> AssignSalesperson(int orderId, [FromBody] AssignSalespersonDto request)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return NotFound(new { message = "Order not found." });

            var salesperson = await _context.Set<Salesperson>().FindAsync(request.SalespersonId);
            if (salesperson == null)
                return NotFound(new { message = "Salesperson not found." });

            order.SalespersonId = request.SalespersonId;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Salesperson '{salesperson.Name}' assigned to order #{order.Id}." });
        }

        // DTO for assigning salesperson
        public class AssignSalespersonDto
        {
            public int SalespersonId { get; set; }
        }


    }
}



public class OrderRequest
{
    public int? UserId { get; set; }
    public string Name { get; set; } = null!;
    public string Mobile { get; set; } = null!;
    public string Address { get; set; } = null!;
    public decimal Total { get; set; }
    public string Status { get; set; } = null!;
    public string PaymentMethod { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
}

public class CartItemDto
{
    public int ProductId { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}

public class OrderStatusUpdateDto
{
    public string Status { get; set; } = null!;
}
