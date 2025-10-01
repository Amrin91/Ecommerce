using System;
using System.Net;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MyEcommerce.Models;
using System.Text;
using System.Text.Json.Serialization;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MyEcommerce.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<MyEcomContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 64;
    });


// ✅ CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
        {
            var uri = new Uri(origin);
            return uri.Host == "localhost"; // Accept any localhost port
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// ✅ Read JWT settings from config
var jwtKey = builder.Configuration["JwtSettings:SecretKey"];
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"];
var jwtAudience = builder.Configuration["JwtSettings:Audience"];

if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("JWT SecretKey is missing in configuration (JwtSettings:SecretKey)");
}

// ✅ JWT Authentication Configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };

        // ✅ Log authentication results for debugging
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("❌ JWT Authentication Failed:");
                Console.WriteLine(context.Exception.ToString());
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("✅ JWT Token Validated:");
                Console.WriteLine("User: " + context.Principal.Identity?.Name);
                return Task.CompletedTask;
            }
        };
    });

// ✅ Swagger for development
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

var app = builder.Build();

// ✅ Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Middleware pipeline
app.UseHttpsRedirection();
app.UseRouting();

app.UseCors("AllowFrontend");

app.UseStaticFiles();

// ✅ Auth Middleware Order
app.UseAuthentication(); // 🔑 Must come before UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();