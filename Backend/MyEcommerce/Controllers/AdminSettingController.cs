using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MyEcommerce.Models;

namespace MyEcommerce.Controllers
{
    // DTO for PUT request
    public class UpdateStockVisibleDto
    {
        public bool Value { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminSettingsController : ControllerBase
    {
        private readonly MyEcomContext _context;
        private const string StockVisibleKey = "StockVisible";

        public AdminSettingsController(MyEcomContext context)
        {
            _context = context;
        }

        // GET: api/AdminSettings/StockVisible
        // GET: api/AdminSettings/StockVisible
        [HttpGet("StockVisible")]
        [AllowAnonymous]
        public async Task<IActionResult> GetStockVisible()
        {
            var setting = await _context.AppSettings
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.SettingName == StockVisibleKey);

            if (setting == null)
            {
                // Default ON
                setting = new AppSetting
                {
                    SettingName = StockVisibleKey,
                    SettingValue = "1"
                };
                _context.AppSettings.Add(setting);
                await _context.SaveChangesAsync();
            }

            bool isVisible = setting.SettingValue == "1";

            return Ok(new { value = isVisible });
        }


        // PUT: api/AdminSettings/StockVisible

        // PUT: api/AdminSettings/StockVisible
        [HttpPut("StockVisible")]
        public async Task<IActionResult> UpdateStockVisible([FromBody] UpdateStockVisibleDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid data.");

            var setting = await _context.AppSettings
                .FirstOrDefaultAsync(s => s.SettingName == StockVisibleKey);

            if (setting == null)
            {
                setting = new AppSetting
                {
                    SettingName = StockVisibleKey,
                    SettingValue = dto.Value ? "1" : "0"
                };
                _context.AppSettings.Add(setting);
            }
            else
            {
                setting.SettingValue = dto.Value ? "1" : "0";
            }

            await _context.SaveChangesAsync();

            
            return Ok(new { value = dto.Value });
        }

    }
}
