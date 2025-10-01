using System;
using System.ComponentModel.DataAnnotations;
public class UserSignupDto
{
    public string? Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;

    public string? Role { get; set; }  // optional, default "customer"
}
