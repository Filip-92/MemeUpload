using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Comments")]
    public class Comments
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string Url { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        public int MemeId { get; set; }
        public int PublicId { get; set; }
        public DateTime Uploaded {get; set; } = DateTime.Now;
        public int NumberOfLikes { get; set; } = 0;
    }
}