using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class replyChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReplyingToUser",
                table: "Responses",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReplyingToUser",
                table: "Responses");
        }
    }
}
