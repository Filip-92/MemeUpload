using System;

namespace API.DTOs
{
    public class MemeDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Uploaded { get; set; } = DateTime.Now;
        public bool IsApproved { get; set; }
    }
}