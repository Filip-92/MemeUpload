using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class QuoteFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quote",
                table: "Comments");

            migrationBuilder.AddColumn<string>(
                name: "Quote",
                table: "Responses",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quote",
                table: "Responses");

            migrationBuilder.AddColumn<string>(
                name: "Quote",
                table: "Comments",
                type: "TEXT",
                nullable: true);
        }
    }
}
