using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("CommentLikes")]
    public class CommentLike
    {
        public AppUser SourceUser { get; set; }
        public int SourceUserId { get; set; }
        public Comments LikedComment { get; set; }
        public int MemeId { get; set; }
        public int LikedCommentId { get; set; }
        public bool Disliked { get; set; }
        
    }
}