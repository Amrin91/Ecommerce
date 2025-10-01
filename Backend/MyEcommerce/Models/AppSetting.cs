using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyEcommerce.Models
{
    [Table("AppSettings")]
    public class AppSetting
    {
        [Key]
        
        public int Id { get; set; }

        [Required]
        
        public string SettingName { get; set; } = string.Empty;

        [Required]
        
        public string SettingValue { get; set; } = string.Empty;
    }
}
