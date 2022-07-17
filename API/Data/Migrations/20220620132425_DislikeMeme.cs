using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class DislikeMeme : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NumberOfLikes",
                table: "MemeLikes",
                newName: "DislikedMemeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DislikedMemeId",
                table: "MemeLikes",
                newName: "NumberOfLikes");
        }
    }
}
