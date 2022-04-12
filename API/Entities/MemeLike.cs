namespace API.Entities
{
    public class MemeLike
    {
        public AppUser SourceUser { get; set; }
        public int SourceUserId { get; set; }
        public Memes LikedMeme { get; set; }
        public int LikedMemeId { get; set; }
        public int NumberOfLikes { get; set; }
        
    }
}