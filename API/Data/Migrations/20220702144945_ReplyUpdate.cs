using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class ReplyUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReplyingToReplyId",
                table: "Responses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReplyingToReplyId",
                table: "Responses");
        }
    }
}
