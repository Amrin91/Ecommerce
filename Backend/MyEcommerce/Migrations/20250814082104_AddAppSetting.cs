using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyEcommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddAppSetting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__cart_item__produ__6FE99F9F",
                table: "cart_items");

            migrationBuilder.DropForeignKey(
                name: "FK__order_ite__order__787EE5A0",
                table: "order_items");

            migrationBuilder.DropForeignKey(
                name: "FK__order_ite__produ__797309D9",
                table: "order_items");

            migrationBuilder.DropForeignKey(
                name: "FK_orders_Users_user_id",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "FK__payments__order___7D439ABD",
                table: "payments");

            migrationBuilder.DropForeignKey(
                name: "FK__product_i__produ__693CA210",
                table: "product_images");

            migrationBuilder.DropForeignKey(
                name: "FK__products__catego__656C112C",
                table: "products");

            migrationBuilder.DropForeignKey(
                name: "FK__SubCatego__Categ__160F4887",
                table: "SubCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK__SubCateg__3214EC07F8FBD500",
                table: "SubCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK__products__3213E83FFC9E60A3",
                table: "products");

            migrationBuilder.DropPrimaryKey(
                name: "PK__product___3213E83F76F02187",
                table: "product_images");

            migrationBuilder.DropPrimaryKey(
                name: "PK__payments__3213E83FE3349C2E",
                table: "payments");

            migrationBuilder.DropPrimaryKey(
                name: "PK__orders__3213E83FAB6A0DF6",
                table: "orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK__order_it__3213E83F5B1A7BCD",
                table: "order_items");

            migrationBuilder.DropPrimaryKey(
                name: "PK__categori__3213E83F7DA35446",
                table: "categories");

            migrationBuilder.DropPrimaryKey(
                name: "PK__cart_ite__3213E83F9BC0059C",
                table: "cart_items");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "SubCategories",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "SubCategories",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "orders",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_orders_user_id",
                table: "orders",
                newName: "IX_orders_UserId");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "Users",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "Users",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "PasswordResetToken",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PasswordResetTokenExpiry",
                table: "Users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "SubCategories",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Mobile",
                table: "orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubCategories",
                table: "SubCategories",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_products",
                table: "products",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_product_images",
                table: "product_images",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_payments",
                table: "payments",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_orders",
                table: "orders",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_order_items",
                table: "order_items",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_categories",
                table: "categories",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_cart_items",
                table: "cart_items",
                column: "id");

            migrationBuilder.CreateTable(
                name: "AppSettings",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    setting_name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    setting_value = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSettings", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppSettings_setting_name",
                table: "AppSettings",
                column: "setting_name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_cart_items_products_product_id",
                table: "cart_items",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_order_items_orders_order_id",
                table: "order_items",
                column: "order_id",
                principalTable: "orders",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_order_items_products_product_id",
                table: "order_items",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_orders_Users_UserId",
                table: "orders",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_payments_orders_order_id",
                table: "payments",
                column: "order_id",
                principalTable: "orders",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_product_images_products_product_id",
                table: "product_images",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_products_categories_category_id",
                table: "products",
                column: "category_id",
                principalTable: "categories",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_SubCategories_categories_CategoryId",
                table: "SubCategories",
                column: "CategoryId",
                principalTable: "categories",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_cart_items_products_product_id",
                table: "cart_items");

            migrationBuilder.DropForeignKey(
                name: "FK_order_items_orders_order_id",
                table: "order_items");

            migrationBuilder.DropForeignKey(
                name: "FK_order_items_products_product_id",
                table: "order_items");

            migrationBuilder.DropForeignKey(
                name: "FK_orders_Users_UserId",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "FK_payments_orders_order_id",
                table: "payments");

            migrationBuilder.DropForeignKey(
                name: "FK_product_images_products_product_id",
                table: "product_images");

            migrationBuilder.DropForeignKey(
                name: "FK_products_categories_category_id",
                table: "products");

            migrationBuilder.DropForeignKey(
                name: "FK_SubCategories_categories_CategoryId",
                table: "SubCategories");

            migrationBuilder.DropTable(
                name: "AppSettings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SubCategories",
                table: "SubCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_products",
                table: "products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_product_images",
                table: "product_images");

            migrationBuilder.DropPrimaryKey(
                name: "PK_payments",
                table: "payments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_orders",
                table: "orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_order_items",
                table: "order_items");

            migrationBuilder.DropPrimaryKey(
                name: "PK_categories",
                table: "categories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_cart_items",
                table: "cart_items");

            migrationBuilder.DropColumn(
                name: "PasswordResetToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswordResetTokenExpiry",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "Mobile",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "orders");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "SubCategories",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "SubCategories",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "orders",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "IX_orders_UserId",
                table: "orders",
                newName: "IX_orders_user_id");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldUnicode: false,
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldUnicode: false,
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "SubCategories",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldUnicode: false,
                oldMaxLength: 100);

            migrationBuilder.AddPrimaryKey(
                name: "PK__SubCateg__3214EC07F8FBD500",
                table: "SubCategories",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK__products__3213E83FFC9E60A3",
                table: "products",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK__product___3213E83F76F02187",
                table: "product_images",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK__payments__3213E83FE3349C2E",
                table: "payments",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK__orders__3213E83FAB6A0DF6",
                table: "orders",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK__order_it__3213E83F5B1A7BCD",
                table: "order_items",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK__categori__3213E83F7DA35446",
                table: "categories",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK__cart_ite__3213E83F9BC0059C",
                table: "cart_items",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "FK__cart_item__produ__6FE99F9F",
                table: "cart_items",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK__order_ite__order__787EE5A0",
                table: "order_items",
                column: "order_id",
                principalTable: "orders",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK__order_ite__produ__797309D9",
                table: "order_items",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_orders_Users_user_id",
                table: "orders",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK__payments__order___7D439ABD",
                table: "payments",
                column: "order_id",
                principalTable: "orders",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK__product_i__produ__693CA210",
                table: "product_images",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK__products__catego__656C112C",
                table: "products",
                column: "category_id",
                principalTable: "categories",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK__SubCatego__Categ__160F4887",
                table: "SubCategories",
                column: "CategoryId",
                principalTable: "categories",
                principalColumn: "id");
        }
    }
}
