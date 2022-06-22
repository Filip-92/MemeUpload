using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class CommentLikes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CommentLikes",
                columns: table => new
                {
                    SourceUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    LikedCommentId = table.Column<int>(type: "INTEGER", nullable: false),
                    MemeId = table.Column<int>(type: "INTEGER", nullable: false),
                    Disliked = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommentLikes", x => new { x.SourceUserId, x.LikedCommentId });
                    table.ForeignKey(
                        name: "FK_CommentLikes_AspNetUsers_SourceUserId",
                        column: x => x.SourceUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CommentLikes_Comments_LikedCommentId",
                        column: x => x.LikedCommentId,
                        principalTable: "Comments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Favourites",
                columns: table => new
                {
                    SourceUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    MemeId = table.Column<int>(type: "INTEGER", nullable: false),
                    FavouriteMemeId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favourites", x => new { x.SourceUserId, x.MemeId });
                    table.ForeignKey(
                        name: "FK_Favourites_AspNetUsers_SourceUserId",
                        column: x => x.SourceUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Favourites_Memes_FavouriteMemeId",
                        column: x => x.FavouriteMemeId,
                        principalTable: "Memes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReplyLikes",
                columns: table => new
                {
                    SourceUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    LikedReplyId = table.Column<int>(type: "INTEGER", nullable: false),
                    MemeId = table.Column<int>(type: "INTEGER", nullable: false),
                    Disliked = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReplyLikes", x => new { x.SourceUserId, x.LikedReplyId });
                    table.ForeignKey(
                        name: "FK_ReplyLikes_AspNetUsers_SourceUserId",
                        column: x => x.SourceUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReplyLikes_Responses_LikedReplyId",
                        column: x => x.LikedReplyId,
                        principalTable: "Responses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CommentLikes_LikedCommentId",
                table: "CommentLikes",
                column: "LikedCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_Favourites_FavouriteMemeId",
                table: "Favourites",
                column: "FavouriteMemeId");

            migrationBuilder.CreateIndex(
                name: "IX_ReplyLikes_LikedReplyId",
                table: "ReplyLikes",
                column: "LikedReplyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CommentLikes");

            migrationBuilder.DropTable(
                name: "Favourites");

            migrationBuilder.DropTable(
                name: "ReplyLikes");
        }
    }
}
