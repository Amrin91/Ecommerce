using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyEcommerce.Migrations
{
    /// <inheritdoc />
    public partial class T : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__categori__3213E83F7DA35446", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    stock = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    category_id = table.Column<int>(type: "int", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__products__3213E83FFC9E60A3", x => x.id);
                    table.ForeignKey(
                        name: "FK__products__catego__656C112C",
                        column: x => x.category_id,
                        principalTable: "categories",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "SubCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SubCateg__3214EC07F8FBD500", x => x.Id);
                    table.ForeignKey(
                        name: "FK__SubCatego__Categ__160F4887",
                        column: x => x.CategoryId,
                        principalTable: "categories",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "orders",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "pending"),
                    total = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__orders__3213E83FAB6A0DF6", x => x.id);
                    table.ForeignKey(
                        name: "FK__orders__user_id__75A278F5",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "cart_items",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: true),
                    product_id = table.Column<int>(type: "int", nullable: true),
                    quantity = table.Column<int>(type: "int", nullable: true, defaultValue: 1),
                    added_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__cart_ite__3213E83F9BC0059C", x => x.id);
                    table.ForeignKey(
                        name: "FK__cart_item__produ__6FE99F9F",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__cart_item__user___6EF57B66",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "product_images",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    product_id = table.Column<int>(type: "int", nullable: true),
                    image_url = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    is_primary = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__product___3213E83F76F02187", x => x.id);
                    table.ForeignKey(
                        name: "FK__product_i__produ__693CA210",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "order_items",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    order_id = table.Column<int>(type: "int", nullable: true),
                    product_id = table.Column<int>(type: "int", nullable: true),
                    quantity = table.Column<int>(type: "int", nullable: true),
                    price_at_purchase = table.Column<decimal>(type: "decimal(10,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__order_it__3213E83F5B1A7BCD", x => x.id);
                    table.ForeignKey(
                        name: "FK__order_ite__order__787EE5A0",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__order_ite__produ__797309D9",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "payments",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    order_id = table.Column<int>(type: "int", nullable: true),
                    payment_method = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    amount = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    paid_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__payments__3213E83FE3349C2E", x => x.id);
                    table.ForeignKey(
                        name: "FK__payments__order___7D439ABD",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_cart_items_product_id",
                table: "cart_items",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_cart_items_user_id",
                table: "cart_items",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_order_items_order_id",
                table: "order_items",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "IX_order_items_product_id",
                table: "order_items",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_orders_user_id",
                table: "orders",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_payments_order_id",
                table: "payments",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "IX_product_images_product_id",
                table: "product_images",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_products_category_id",
                table: "products",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_SubCategories_CategoryId",
                table: "SubCategories",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cart_items");

            migrationBuilder.DropTable(
                name: "order_items");

            migrationBuilder.DropTable(
                name: "payments");

            migrationBuilder.DropTable(
                name: "product_images");

            migrationBuilder.DropTable(
                name: "SubCategories");

            migrationBuilder.DropTable(
                name: "orders");

            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "categories");
        }
    }
}
