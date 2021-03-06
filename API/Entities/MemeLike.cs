using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("MemeLikes")]
    public class MemeLike
    {
        public AppUser SourceUser { get; set; }
        public int SourceUserId { get; set; }
        public Memes LikedMeme { get; set; }
        public int LikedMemeId { get; set; }
        public bool Disliked { get; set; }
        
    }
}