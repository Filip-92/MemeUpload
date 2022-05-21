using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class Something : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfLikes",
                table: "Likes");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfLikes",
                table: "Likes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
