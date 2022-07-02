using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class NotificationUnreadFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Unread",
                table: "Notifications",
                newName: "IsRead");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsRead",
                table: "Notifications",
                newName: "Unread");
        }
    }
}
