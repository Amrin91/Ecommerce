using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyEcommerce.Models;
using System.Threading.Tasks;
using System.Linq;

namespace MyEcommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalespersonController : ControllerBase
    {
        private readonly MyEcomContext _context;

        public SalespersonController(MyEcomContext context)
        {
            _context = context;
        }

        // GET: api/salesperson
        [HttpGet]
        public async Task<IActionResult> GetAllSalespersons()
        {
            var salespersons = await _context.Salespersons
                .Include(s => s.Orders) // include the collection of orders
                .ToListAsync();

            var result = salespersons.Select(s => new
            {
                s.Id,
                s.Name,
                Orders = s.Orders.Select(o => new
                {
                    o.Id,
                    o.Status,
                    o.Total
                })
            });

            return Ok(result);
        }

        // PUT: api/salesperson/{orderId}/salesperson
        [HttpPut("{orderId}/salesperson")]
        public async Task<IActionResult> AssignSalesperson(int orderId, [FromBody] AssignSalespersonDto dto)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound();

            order.SalespersonId = dto.SalespersonId;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class AssignSalespersonDto
        {
            public int? SalespersonId { get; set; }
        }

        // GET: api/salesperson/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSalespersonById(int id)
        {
            var sp = await _context.Salespersons
                .Include(s => s.Orders)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sp == null)
                return NotFound();

            var result = new
            {
                sp.Id,
                sp.Name,
                Orders = sp.Orders.Select(o => new
                {
                    o.Id,
                    o.Status,
                    o.Total
                })
            };

            return Ok(result);
        }
    }
}
