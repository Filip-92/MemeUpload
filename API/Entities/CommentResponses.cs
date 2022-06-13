using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Responses")]
    public class CommentResponses
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string Url { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        public int MemeId { get; set; }
        public int CommentId { get; set; }
        public DateTime Uploaded {get; set; } = DateTime.Now;
        public int NumberOfLikes { get; set; } = 0;
    }
}