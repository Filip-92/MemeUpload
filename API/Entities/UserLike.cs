using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Likes")]
    public class UserLike
    {
        public AppUser SourceUser { get; set; }
        
        public int SourceUserId { get; set; }

        public AppUser LikedUser { get; set; }

        public int LikedUserId { get; set; }
    }
}