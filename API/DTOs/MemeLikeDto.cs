namespace API.DTOs
{
    public class MemeLikeDto
    {
        public int Id { get; set; }
        public int SourceUserId { get; set; }
        public int LikedMemeId { get; set; }
        public bool Disliked { get; set; }
        public string Username { get; set; }
    }
}