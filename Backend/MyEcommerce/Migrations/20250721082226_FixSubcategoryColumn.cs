using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyEcommerce.Migrations
{
    /// <inheritdoc />
    public partial class FixSubcategoryColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SubCategoryId",
                table: "products",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_products_SubCategoryId",
                table: "products",
                column: "SubCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_products_SubCategories_SubCategoryId",
                table: "products",
                column: "SubCategoryId",
                principalTable: "SubCategories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_products_SubCategories_SubCategoryId",
                table: "products");

            migrationBuilder.DropIndex(
                name: "IX_products_SubCategoryId",
                table: "products");

            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "products");

            migrationBuilder.DropColumn(
                name: "SubCategoryId",
                table: "products");
        }
    }
}
