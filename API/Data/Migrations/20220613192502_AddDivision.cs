using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class AddDivision : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Division",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Division_AppUserId",
                table: "Division",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Division_AspNetUsers_AppUserId",
                table: "Division",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Division_AspNetUsers_AppUserId",
                table: "Division");

            migrationBuilder.DropIndex(
                name: "IX_Division_AppUserId",
                table: "Division");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Division");
        }
    }
}
