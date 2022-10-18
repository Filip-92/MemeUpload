using System;

namespace API.DTOs
{
    public class CommentResponseDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public int MemeId { get; set; }
        public int CommentId { get; set; }
        public string PublicId { get; set; }
        public string Content { get; set; }
        public string Quote { get; set; }
        public string Username { get; set; }
        public DateTime Uploaded { get; set; } = DateTime.Now;
        public bool IsEdited { get; set; }
        public int NumberOfLikes { get; set; }
        public string ReplyingToUser { get; set; }
        public int ReplyingToReplyId { get; set; }
    }
}