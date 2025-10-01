using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MyEcommerce.Models;
using System.Threading.Tasks;
using System;
using System.Security.Cryptography;
using System.Net.Mail;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json.Serialization;
using System.Linq;

namespace MyEcommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly MyEcomContext _context;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher;

        public UsersController(MyEcomContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        // -----------------------------
        // Normal Login Endpoint
        // -----------------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
                return BadRequest(new { message = "Email and password are required." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
                return BadRequest(new { message = "User not found." });

            if (string.IsNullOrEmpty(user.PasswordHash))
                return BadRequest(new { message = "User does not have a password. Try OAuth login or reset password." });

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (verificationResult != PasswordVerificationResult.Success)
                return BadRequest(new { message = "Incorrect password." });

            var token = GenerateJwtToken(user);
            return Ok(new { token, role = user.Role });
        }
        //    using Microsoft.AspNetCore.Authorization;
        //using Microsoft.AspNetCore.Mvc;
        //using Microsoft.EntityFrameworkCore;
        //using MyEcommerce.Models;

        //namespace MyEcommerce.Controllers
        //{
        //    [ApiController]
        //    [Route("users")]
        //    public class UsersController : ControllerBase
        //    {
        //        private readonly MyDbContext _context;

        //        public UsersController(MyEcomContext context)
        //        {
        //            _context = context;
        //        }

        // GET /users/{id}/profile
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim =
                User.FindFirst("userId") ??
                User.FindFirst("sub") ??
                User.FindFirst("nameid") ??
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { message = "User not authenticated." });
            }

            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    id = u.Id,
                    name = u.Name,
                    email = u.Email,
                    role = u.Role,
                    phone = u.Mobile,
                    createdAt = u.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }



        // -----------------------------
        // Google Login/Register Endpoint
        // -----------------------------
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] OAuthLoginDto dto)
        {
            if (string.IsNullOrEmpty(dto.AccessToken))
                return BadRequest(new { message = "Access token is required." });

            var httpClient = new System.Net.Http.HttpClient();
            var response = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={dto.AccessToken}");
            if (!response.IsSuccessStatusCode)
                return Unauthorized(new { message = "Invalid Google token." });

            var payload = System.Text.Json.JsonSerializer.Deserialize<GoogleTokenPayload>(await response.Content.ReadAsStringAsync());

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.email);
            if (user == null)
            {
                user = new User
                {
                    Name = payload.name,
                    Email = payload.email,
                    Role = "customer",
                    CreatedAt = DateTime.UtcNow,
                    PasswordHash = null // OAuth user, no password
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            var token = GenerateJwtToken(user);
            return Ok(new { id = user.Id, name = user.Name, email = user.Email, role = user.Role, token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (string.IsNullOrEmpty(dto.Name) || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
                return BadRequest(new { message = "Name, Email and Password are required." });

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already registered." });

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Role = dto.Role ?? "user",
                CreatedAt = DateTime.UtcNow
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully.", id = user.Id, role = user.Role });
        }

        // -----------------------------
        // DTO for Registration
        // -----------------------------
        public class RegisterDto
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Role { get; set; } // optional: "user" or "admin"
        }

        // -----------------------------
        // Facebook Login/Register Endpoint
        // -----------------------------
        [HttpPost("facebook-login")]
        public async Task<IActionResult> FacebookLogin([FromBody] OAuthLoginDto dto)
        {
            if (string.IsNullOrEmpty(dto.AccessToken))
                return BadRequest(new { message = "Access token is required." });

            var httpClient = new System.Net.Http.HttpClient();
            var response = await httpClient.GetAsync($"https://graph.facebook.com/me?fields=id,name,email&access_token={dto.AccessToken}");
            if (!response.IsSuccessStatusCode)
                return Unauthorized(new { message = "Invalid Facebook token." });

            var payload = System.Text.Json.JsonSerializer.Deserialize<FacebookTokenPayload>(await response.Content.ReadAsStringAsync());

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.email);
            if (user == null)
            {
                user = new User
                {
                    Name = payload.name,
                    Email = payload.email,
                    Role = "customer",
                    CreatedAt = DateTime.UtcNow,
                    PasswordHash = null // OAuth user, no password
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            var token = GenerateJwtToken(user);
            return Ok(new { id = user.Id, name = user.Name, email = user.Email, role = user.Role, token });
        }

        // -----------------------------
        // Forget Password Endpoint
        // -----------------------------
        [HttpPost("forget-password")]
        public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email) && string.IsNullOrEmpty(dto.Mobile))
                return BadRequest(new { message = "Email or Mobile number is required." });

            User user = null;

            if (!string.IsNullOrEmpty(dto.Email))
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
                if (user == null) return BadRequest(new { message = "User not found." });
            }
            else if (!string.IsNullOrEmpty(dto.Mobile))
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.Mobile == dto.Mobile);
                if (user == null) return BadRequest(new { message = "User not found." });
            }

            if (!string.IsNullOrEmpty(dto.Email))
            {
                // Generate secure token for email reset
                var tokenBytes = new byte[32];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(tokenBytes);
                }
                var token = Convert.ToBase64String(tokenBytes);

                user.PasswordResetToken = token;
                user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
                await _context.SaveChangesAsync();

                try
                {
                    var frontendUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:5173";
                    var resetLink = $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(token)}";

                    var mail = new MailMessage();
                    mail.From = new MailAddress("yourgmail@gmail.com", "Your App Name");
                    mail.To.Add(user.Email);
                    mail.Subject = "Password Reset Request";
                    mail.Body = $"Click here to reset your password: {resetLink}";

                    using (var smtp = new SmtpClient("smtp.gmail.com", 587))
                    {
                        smtp.Credentials = new System.Net.NetworkCredential("yourgmail@gmail.com", "your-app-password");
                        smtp.EnableSsl = true;
                        smtp.Send(mail);
                    }

                    return Ok(new { message = "Password reset email sent!" });
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    return StatusCode(500, new { message = "Failed to send email.", error = ex.Message });
                }
            }
            else if (!string.IsNullOrEmpty(dto.Mobile))
            {
                // Generate numeric OTP for SMS
                var random = new Random();
                var otp = random.Next(100000, 999999).ToString(); // 6-digit code

                user.PasswordResetOtp = otp;
                user.PasswordResetOtpExpiry = DateTime.UtcNow.AddMinutes(10);
                await _context.SaveChangesAsync();

                try
                {
                    // TODO: Integrate with SMS provider like Twilio, Nexmo, etc.
                    // Example: SendSms(user.Mobile, $"Your password reset code is {otp}");
                    Console.WriteLine($"OTP for {user.Mobile}: {otp}"); // For testing

                    return Ok(new { message = "Password reset code sent to mobile." });
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    return StatusCode(500, new { message = "Failed to send SMS.", error = ex.Message });
                }
            }

            return BadRequest(new { message = "Invalid request." });
        }

        // -----------------------------
        // Reset Password Endpoint
        // -----------------------------
        /*[HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (string.IsNullOrEmpty(dto.Token) || string.IsNullOrEmpty(dto.NewPassword))
                return BadRequest(new { message = "Token and new password are required." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == dto.Token &&
                                                                    u.PasswordResetTokenExpiry > DateTime.UtcNow);
            if (user == null)
                return BadRequest(new { message = "Invalid or expired token." });

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.NewPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password has been reset successfully." });
        }*/

        //[Route("api/[controller]")] // ensure only logged-in users can call
        [Authorize]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {

            if (string.IsNullOrEmpty(dto.NewPassword))
                return BadRequest(new { message = "New password is required." });

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("id")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "User not authenticated." });


            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound(new { message = "User not found." });


            user.PasswordHash = _passwordHasher.HashPassword(user, dto.NewPassword);


            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully." });
        }


        // -----------------------------
        // DTOs
        // -----------------------------
        public class LoginDto { public string Email { get; set; } public string Password { get; set; } }
        public class OAuthLoginDto { public string AccessToken { get; set; } }
        public class GoogleTokenPayload { public string email { get; set; } public string name { get; set; } }
        public class FacebookTokenPayload { public string email { get; set; } public string name { get; set; } public string id { get; set; } }
        public class ForgetPasswordDto
        {
            public string? Email { get; set; }      // optional
            public string? Mobile { get; set; }     // optional
        }

        //public class ResetPasswordDto { public string Token { get; set; } public string NewPassword { get; set; } }
        public class ResetPasswordDto
        {
            [JsonPropertyName("NewPassword")]
            public string NewPassword { get; set; }
        }

        // -----------------------------
        // Helpers
        // -----------------------------
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, user.Name ?? ""),
            new Claim(ClaimTypes.Role, user.Role ?? "user"),
            new Claim("id", user.Id.ToString()),
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
