using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class Changes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Likes",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfLikes",
                table: "Likes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Likes_AppUserId",
                table: "Likes",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_AspNetUsers_AppUserId",
                table: "Likes",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_AspNetUsers_AppUserId",
                table: "Likes");

            migrationBuilder.DropIndex(
                name: "IX_Likes_AppUserId",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "NumberOfLikes",
                table: "Likes");
        }
    }
}
