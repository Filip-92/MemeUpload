using System;

namespace API.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int MemeId { get; set; }
        public DateTime SentTime {get; set; } = DateTime.Now;
        public Boolean IsRead { get; set; }
    }
}