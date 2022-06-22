namespace API.DTOs
{
    public class ReplyLikeDto
    {
        public int Id { get; set; }
        public int SourceUserId { get; set; }
        public int LikedReplyId { get; set; }
        public bool Disliked { get; set; }
        public int MemeId { get; set; }
        public string Username { get; set; }
    }
}