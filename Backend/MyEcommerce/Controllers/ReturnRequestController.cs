using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyEcommerce.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MyEcommerce.Controllers
{
    // =======================
    // Admin Controller
    // =======================
    [ApiController]
    [Route("api/admin/return-requests")]
    [Authorize(Roles = "admin")]
    public class AdminReturnRequestsController : ControllerBase
    {
        private readonly MyEcomContext _context;

        public AdminReturnRequestsController(MyEcomContext context)
        {
            _context = context;
        }

        // GET: api/admin/return-requests
        [HttpGet]
        public async Task<IActionResult> GetAllRequests()
        {
            var requests = await _context.ReturnRequests
                .Include(r => r.Order)
                    .ThenInclude(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                .Include(r => r.User)
                .AsNoTracking()
                .ToListAsync(); // <-- ToListAsync() already gives List, important

            var result = requests.Select(r => new
            {
                r.Id,
                r.Status,
                r.CreatedAt,
                User = r.User == null ? null : new
                {
                    r.User.Id,
                    r.User.Name,
                    r.User.Mobile,
                    r.User.Email
                },
                Order = r.Order == null ? null : new
                {
                    r.Order.Id,
                    r.Order.Name,
                    r.Order.Mobile,
                    r.Order.Address,
                    r.Order.Status,
                    r.Order.Total,
                    r.Order.CreatedAt,
                    Items = r.Order.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        ProductName = oi.Product?.Name ?? "Unnamed product",
                        ProductImage = oi.Product?.ImagePath ?? "", // <-- empty string if null
                        oi.Quantity,
                        oi.PriceAtPurchase
                    }).ToList() // <-- important
                },
                r.ProductId
            }).ToList(); // <-- important

            return Ok(result);
        }


        // PUT: api/admin/return-requests/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateRequestStatus(int id, [FromBody] ReturnRequestStatusUpdateDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Status))
                return BadRequest("Status is required.");

            var req = await _context.ReturnRequests.FindAsync(id);
            if (req == null) return NotFound();

            req.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                req.Id,
                req.Status,
                req.CreatedAt
            });
        }
    }

    // =======================
    // User Controller
    // =======================
    [ApiController]
    [Route("api/orders/return-request")]
    public class UserReturnRequestsController : ControllerBase
    {
        private readonly MyEcomContext _context;

        public UserReturnRequestsController(MyEcomContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> SubmitReturn([FromBody] ReturnRequestDto dto)
        {
            if (dto == null || dto.OrderId <= 0 || dto.ProductId <= 0)
                return BadRequest("Invalid data.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var req = new ReturnRequest
            {
                UserId = userId,
                OrderId = dto.OrderId,
                ProductId = dto.ProductId,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.ReturnRequests.Add(req);
            await _context.SaveChangesAsync();

            return Ok(req);
        }
    }

    // =======================
    // DTOs
    // =======================
    public class ReturnRequestStatusUpdateDto
    {
        public string Status { get; set; } = null!;
    }

    public class ReturnRequestDto
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
    }
}
