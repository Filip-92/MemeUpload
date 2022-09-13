using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class AnnouncementFix2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Announcement",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Announcement_AppUserId",
                table: "Announcement",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Announcement_AspNetUsers_AppUserId",
                table: "Announcement",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcement_AspNetUsers_AppUserId",
                table: "Announcement");

            migrationBuilder.DropIndex(
                name: "IX_Announcement_AppUserId",
                table: "Announcement");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Announcement");
        }
    }
}
