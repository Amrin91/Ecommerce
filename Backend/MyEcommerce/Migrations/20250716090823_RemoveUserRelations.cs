using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyEcommerce.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__cart_item__user___6EF57B66",
                table: "cart_items");

            migrationBuilder.DropForeignKey(
                name: "FK__orders__user_id__75A278F5",
                table: "orders");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Users",
                newName: "role");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "Users",
                newName: "password_hash");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Users",
                newName: "created_at");

            migrationBuilder.AddForeignKey(
                name: "FK_cart_items_Users_user_id",
                table: "cart_items",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_orders_Users_user_id",
                table: "orders",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_cart_items_Users_user_id",
                table: "cart_items");

            migrationBuilder.DropForeignKey(
                name: "FK_orders_Users_user_id",
                table: "orders");

            migrationBuilder.RenameColumn(
                name: "role",
                table: "Users",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "password_hash",
                table: "Users",
                newName: "PasswordHash");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Users",
                newName: "CreatedAt");

            migrationBuilder.AddForeignKey(
                name: "FK__cart_item__user___6EF57B66",
                table: "cart_items",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK__orders__user_id__75A278F5",
                table: "orders",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
