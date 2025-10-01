using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyEcommerce.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyEcommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly MyEcomContext _context;

        public CategoriesController(MyEcomContext context)
        {
            _context = context;
        }


        // GET: api/categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        // GET: api/categories/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            return Ok(category);
        }

        // POST: api/categories
        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            if (category == null || string.IsNullOrWhiteSpace(category.Name))
                return BadRequest("Category name is required.");

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }
        [HttpDelete("{Id}")]
        public IActionResult DeleteCategory(int Id)
        {

            var category = _context.Categories.Find(Id);


            if (category == null)
            {
                return NotFound();
            }


            _context.Categories.Remove(category);


            _context.SaveChanges();


            return NoContent();
        }

    }

}
