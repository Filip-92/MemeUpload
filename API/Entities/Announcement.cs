using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Announcement")]
    public class Announcement
    {
        public int Id { get; set; }
        public string Content { get; set; }
    }
}