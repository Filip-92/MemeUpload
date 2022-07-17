using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class ResponseAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Contact Form",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Responses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Content = table.Column<string>(type: "TEXT", nullable: true),
                    Url = table.Column<string>(type: "TEXT", nullable: true),
                    AppUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    MemeId = table.Column<int>(type: "INTEGER", nullable: false),
                    CommentId = table.Column<int>(type: "INTEGER", nullable: false),
                    Uploaded = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NumberOfLikes = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Responses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Responses_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contact Form_AppUserId",
                table: "Contact Form",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Responses_AppUserId",
                table: "Responses",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contact Form_AspNetUsers_AppUserId",
                table: "Contact Form",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contact Form_AspNetUsers_AppUserId",
                table: "Contact Form");

            migrationBuilder.DropTable(
                name: "Responses");

            migrationBuilder.DropIndex(
                name: "IX_Contact Form_AppUserId",
                table: "Contact Form");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Contact Form");
        }
    }
}
