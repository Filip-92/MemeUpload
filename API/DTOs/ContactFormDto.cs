using System;

namespace API.DTOs
{
    public class ContactFormDto
    {
        public int Id { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
    }
}