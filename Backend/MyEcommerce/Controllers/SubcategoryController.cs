using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyEcommerce.Models;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class SubCategoriesController : ControllerBase
{
    private readonly MyEcomContext _context;

    public SubCategoriesController(MyEcomContext context)
    {
        _context = context;
    }

    // ✅ Clean GET with projection (no $id/$values)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var subcategories = await _context.SubCategories
            .Include(sc => sc.Category) // Ensure Category navigation property is loaded
            .Select(sc => new
            {
                sc.Id,
                sc.Name,
                sc.CategoryId,
                CategoryName = sc.Category != null ? sc.Category.Name : null
            })
            .ToListAsync();

        return Ok(subcategories);
    }


    [HttpPost]
    public async Task<IActionResult> PostSubCategory([FromBody] SubCategory subCategory)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(new { message = "Validation failed", errors });
        }

        bool categoryExists = await _context.Categories.AnyAsync(c => c.Id == subCategory.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = "Category with this Id does not exist." });
        }

        _context.SubCategories.Add(subCategory);
        await _context.SaveChangesAsync();

        return Ok(subCategory);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sub = await _context.SubCategories.FindAsync(id);
        if (sub == null) return NotFound();

        _context.SubCategories.Remove(sub);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, SubCategory updated)
    {
        if (id != updated.Id)
            return BadRequest(new { message = "ID mismatch" });

        bool categoryExists = await _context.Categories.AnyAsync(c => c.Id == updated.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = "Category with this Id does not exist." });
        }

        var existing = await _context.SubCategories.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = updated.Name;
        existing.CategoryId = updated.CategoryId;

        try
        {
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException ex)
        {
            return StatusCode(500, new { message = "Failed to update", details = ex.Message });
        }
    }
}
