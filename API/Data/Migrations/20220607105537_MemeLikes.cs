using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class MemeLikes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_AspNetUsers_AppUserId",
                table: "Likes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MemeLikes",
                table: "MemeLikes");

            migrationBuilder.DropIndex(
                name: "IX_MemeLikes_SourceUserId",
                table: "MemeLikes");

            migrationBuilder.DropIndex(
                name: "IX_Likes_AppUserId",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Likes");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "MemeLikes",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MemeLikes",
                table: "MemeLikes",
                columns: new[] { "SourceUserId", "LikedMemeId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MemeLikes",
                table: "MemeLikes");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "MemeLikes",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Likes",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MemeLikes",
                table: "MemeLikes",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_MemeLikes_SourceUserId",
                table: "MemeLikes",
                column: "SourceUserId");

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
    }
}
