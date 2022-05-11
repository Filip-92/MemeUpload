using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class AddLike : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfDislikes",
                table: "Memes");

            migrationBuilder.DropColumn(
                name: "NumberOfLikes",
                table: "Memes");

            migrationBuilder.DropColumn(
                name: "OverallRank",
                table: "Memes");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfLikes",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfLikes",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfDislikes",
                table: "Memes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfLikes",
                table: "Memes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OverallRank",
                table: "Memes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
