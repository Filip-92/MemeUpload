using System;

namespace API.DTOs
{
    public class MemeDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsApproved { get; set; }
        public bool IsMain { get; set; }
        public string Username { get; set; }
        public DateTime Uploaded { get; set; } = DateTime.Now;
        public int Division { get; set; }
        public int NumberOfLikes { get; set; }
        public int NumberOfSpamFlags { get; set; }
    }
}