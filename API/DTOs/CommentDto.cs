using System;

namespace API.DTOs
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public int MemeId { get; set; }
        public string Content { get; set; }
        public string Username { get; set; }
        public DateTime Uploaded { get; set; } = DateTime.Now;
        public int NumberOfLikes { get; set; }
    }
}