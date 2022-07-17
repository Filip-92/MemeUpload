using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class CommentsFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MemesId",
                table: "Comments",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comments_MemesId",
                table: "Comments",
                column: "MemesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Memes_MemesId",
                table: "Comments",
                column: "MemesId",
                principalTable: "Memes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Memes_MemesId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_MemesId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "MemesId",
                table: "Comments");
        }
    }
}
