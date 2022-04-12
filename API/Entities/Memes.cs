using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Memes")]
    public class Memes
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsApproved { get; set; }
        public string PublicId { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        public DateTime Uploaded {get; set; } = DateTime.Now;
        // public int NumberOfLikes { get; set; }
        // public int NumberOfDislikes { get; set; }
        // public int OverallRank { get; set; }
    }
}