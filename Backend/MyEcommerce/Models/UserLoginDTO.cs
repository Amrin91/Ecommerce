using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyEcommerce.Models;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace MyEcommerce.Models
{
    public class UserLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}