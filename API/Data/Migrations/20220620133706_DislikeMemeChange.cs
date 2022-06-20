using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class DislikeMemeChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DislikedMemeId",
                table: "MemeLikes",
                newName: "Disliked");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Disliked",
                table: "MemeLikes",
                newName: "DislikedMemeId");
        }
    }
}
