using System;

namespace API.DTOs
{
    public class MemeForApprovalDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Username { get; set; }
        public DateTime Uploaded { get; set; } = DateTime.Now;
        public bool IsApproved { get; set; }
    }
}