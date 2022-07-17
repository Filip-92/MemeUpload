using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class AddImageToComment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfSpamFlags",
                table: "Memes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PublicId",
                table: "Comments",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfSpamFlags",
                table: "Memes");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Comments");
        }
    }
}
