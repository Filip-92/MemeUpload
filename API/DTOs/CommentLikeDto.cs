namespace API.DTOs
{
    public class CommentLikeDto
    {
        public int Id { get; set; }
        public int SourceUserId { get; set; }
        public int LikedCommentId { get; set; }
        public bool Disliked { get; set; }
        public int MemeId { get; set; }
        public string Username { get; set; }
    }
}