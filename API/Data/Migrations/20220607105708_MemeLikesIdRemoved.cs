using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class MemeLikesIdRemoved : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "MemeLikes");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "MemeLikes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
