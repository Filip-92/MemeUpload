using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("ReplyLikes")]
    public class ReplyLike
    {
        public AppUser SourceUser { get; set; }
        public int SourceUserId { get; set; }
        public CommentResponses LikedReply { get; set; }
        public int MemeId { get; set; }
        public int LikedReplyId { get; set; }
        public bool Disliked { get; set; }
        
    }
}