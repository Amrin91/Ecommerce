using Microsoft.EntityFrameworkCore;

namespace MyEcommerce.Models
{
    public partial class MyEcomContext : DbContext
    {
        public MyEcomContext()
        {
        }

        public MyEcomContext(DbContextOptions<MyEcomContext> options)
            : base(options)
        {
        }
        public virtual DbSet<AppSetting> AppSettings { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<CartItem> CartItems { get; set; }
        public virtual DbSet<OrderItem> OrderItems { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<SubCategory> SubCategories { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }
        public virtual DbSet<ProductImage> ProductImages { get; set; }
        public virtual DbSet<Wishlist> Wishlists { get; set; }
        public virtual DbSet<ReturnRequest> ReturnRequests { get; set; }
        public virtual DbSet<Salesperson> Salespersons { get; set; }



        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost;Database=MyEcom;Trusted_Connection=True;TrustServerCertificate=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("Users");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Name)
                      .HasMaxLength(100)
                      .IsUnicode(false)
                      .HasColumnName("name");
                entity.Property(e => e.Email)
                      .HasMaxLength(100)
                      .IsUnicode(false)
                      .HasColumnName("email");

               
            });

            // Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("categories");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Name)
                      .HasMaxLength(100)
                      .IsUnicode(false)
                      .HasColumnName("name");

                entity.HasMany(c => c.SubCategories)
                      .WithOne(sc => sc.Category)
                      .HasForeignKey(sc => sc.CategoryId)
                      .OnDelete(DeleteBehavior.ClientSetNull);
            });

            // SubCategory
            modelBuilder.Entity<SubCategory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("SubCategories");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Name)
                      .HasMaxLength(100)
                      .IsUnicode(false)
                      .HasColumnName("name");
                entity.Property(e => e.CategoryId).HasColumnName("CategoryId");
            });

            // Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("products");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Name)
                      .HasMaxLength(150)
                      .IsUnicode(false)
                      .HasColumnName("name");

                entity.Property(e => e.Brand)
                      .HasMaxLength(150)
                      .IsUnicode(false)
                      .HasColumnName("brand");

                entity.Property(e => e.Description)
                      .HasColumnType("text")
                      .HasColumnName("description");

                entity.Property(e => e.Price)
                      .HasColumnType("decimal(10,2)")
                      .HasColumnName("price");

                entity.Property(e => e.Stock)
                      .HasDefaultValue(0)
                      .HasColumnName("stock");

                entity.Property(e => e.CategoryId).HasColumnName("category_id");

                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("(getdate())")
                      .HasColumnType("datetime")
                      .HasColumnName("created_at");

                ////New discount fields
                entity.Property(e => e.DiscountPercent)
                      .HasColumnType("decimal(5,2)")
                      .IsRequired(false)           // nullable
                      .HasColumnName("DiscountPercent");

                entity.Property(e => e.DiscountPrice)
                      .HasColumnType("decimal(10,2)")
                      .IsRequired(false)           // nullable
                      .HasColumnName("DiscountPrice");

                entity.Property(p => p.finalprice)
                       .HasColumnType("decimal(10,2)")
                       .IsRequired(false)
                       .HasColumnName("finalprice");



                entity.HasOne(p => p.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(p => p.CategoryId)
                      .OnDelete(DeleteBehavior.ClientSetNull);
            });


            // ProductImage
            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("product_images");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.ImageUrl)
                      .IsUnicode(false)
                      .HasColumnName("image_url");
                entity.Property(e => e.IsPrimary)
                      .HasDefaultValue(false)
                      .HasColumnName("is_primary");
                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.HasOne(pi => pi.Product)
                      .WithMany(p => p.ProductImages)
                      .HasForeignKey(pi => pi.ProductId)
                      .OnDelete(DeleteBehavior.ClientSetNull);
            });

            // Order
            // Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("orders");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("GETDATE()")
                      .HasColumnType("datetime")
                      .HasColumnName("created_at");

                entity.Property(e => e.Status)
                      .HasMaxLength(20)
                      .IsUnicode(false)
                      .HasDefaultValue("pending")
                      .HasColumnName("status");

                // Old 'Total' property
                /*entity.Property(e => e.Total)
                      .HasColumnType("decimal(10,2)")
                      .HasColumnName("total");

                // New 'TotalAmount' property with precision
                entity.Property(e => e.TotalAmount)
                      .HasPrecision(18, 2)
                      .HasColumnName("total_amount"); // optional, match DB column*/

                entity.Property(e => e.Name)
                      .HasMaxLength(200)
                      .HasColumnName("Name");

                entity.Property(e => e.Address)
                      .HasMaxLength(500)
                      .HasColumnName("Address");

                entity.Property(e => e.Mobile)
                      .HasMaxLength(50)
                      .HasColumnName("Mobile");

                entity.Property(e => e.UserId)
                      .HasColumnName("UserId");

                entity.HasMany(o => o.Payments)
                      .WithOne(p => p.Order)
                      .HasForeignKey(p => p.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.SalespersonId)
                      .HasColumnName("salesperson_id");

                entity.HasMany(o => o.OrderItems)
                      .WithOne(oi => oi.Order)
                      .HasForeignKey(oi => oi.OrderId);

                entity.HasOne(o => o.Salesperson)
                      .WithMany(s => s.Orders)
                      .HasForeignKey(o => o.SalespersonId)
                      .HasConstraintName("FK_Order_Salesperson")
                      .OnDelete(DeleteBehavior.SetNull);
            });




            // OrderItem
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("order_items");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.OrderId).HasColumnName("order_id");
                entity.Property(e => e.ProductId).HasColumnName("product_id");
                entity.Property(e => e.Quantity).HasColumnName("quantity");

                // Price property with precision
                /*entity.Property(e => e.Price)
                      .HasColumnType("decimal(18,2)") // safe precision for money
                      .HasColumnName("price");*/

                entity.HasOne(oi => oi.Order)
                      .WithMany(o => o.OrderItems)
                      .HasForeignKey(oi => oi.OrderId)
                      .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(oi => oi.Product)
                      .WithMany(p => p.OrderItems)
                      .HasForeignKey(oi => oi.ProductId)
                      .OnDelete(DeleteBehavior.ClientSetNull);
            });


            // CartItem
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("cart_items");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.AddedAt)
                      .HasDefaultValueSql("(getdate())")
                      .HasColumnType("datetime")
                      .HasColumnName("added_at");
                entity.Property(e => e.ProductId).HasColumnName("product_id");
                entity.Property(e => e.Quantity)
                      .HasDefaultValue(1)
                      .HasColumnName("quantity");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(ci => ci.Product)
                      .WithMany(p => p.CartItems)
                      .HasForeignKey(ci => ci.ProductId)
                      .OnDelete(DeleteBehavior.ClientSetNull);
            });

            // Payment
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("payments");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Amount)
                      .HasColumnType("decimal(10, 2)")
                      .HasColumnName("amount");
                entity.Property(e => e.OrderId).HasColumnName("order_id");
                entity.Property(e => e.PaidAt)
                      .HasDefaultValueSql("(getdate())")
                      .HasColumnType("datetime")
                      .HasColumnName("paid_at");
                entity.Property(e => e.PaymentMethod)
                      .HasMaxLength(50)
                      .IsUnicode(false)
                      .HasColumnName("payment_method");

                entity.HasOne(p => p.Order)
                      .WithMany(o => o.Payments)
                      .HasForeignKey(p => p.OrderId)
                      .OnDelete(DeleteBehavior.ClientSetNull);
            });
            // Salesperson
            modelBuilder.Entity<Salesperson>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("salesperson");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Name)
                      .HasMaxLength(200)
                      .HasColumnName("name");
            });

            modelBuilder.Entity<AppSetting>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("AppSettings");

                entity.Property(e => e.Id).HasColumnName("Id"); // match SQL
                entity.Property(e => e.SettingName)
                      .HasMaxLength(200)
                      .IsUnicode(true)
                      .IsRequired()
                      .HasColumnName("SettingName"); // match SQL
                entity.Property(e => e.SettingValue)
                      .HasMaxLength(200)
                      .IsUnicode(true)
                      .HasColumnName("SettingValue"); // match SQL

                entity.HasIndex(e => e.SettingName).IsUnique();
            });
            modelBuilder.Entity<Wishlist>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => new { e.UserId, e.ProductId }).IsUnique();

                entity.HasOne(w => w.User)
                      .WithMany()
                      .HasForeignKey(w => w.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(w => w.Product)
                      .WithMany()
                      .HasForeignKey(w => w.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            base.OnModelCreating(modelBuilder);





            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
