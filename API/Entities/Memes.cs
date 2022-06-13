using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Memes")]
    public class Memes
    {
        public Memes() {
            Comments = new List<Comments>();
        }
        public int Id { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsApproved { get; set; }
        public ICollection<Comments> Comments { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        public DateTime Uploaded {get; set; } = DateTime.Now;
        public int Division { get; set; }
        public int NumberOfLikes { get; set; }
    }
}