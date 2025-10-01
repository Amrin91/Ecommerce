using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyEcommerce.Models
{
    public partial class User
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string? Name { get; set; }

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("password_hash")]
        public string PasswordHash { get; set; } = null!;

        [Column("role")]
        public string? Role { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpiry { get; set; }
        public string? Mobile { get; set; }                      // For phone number
        public string? PasswordResetOtp { get; set; }            // OTP for password reset
        public DateTime? PasswordResetOtpExpiry { get; set; }    // OTP expiry time

    }
}
