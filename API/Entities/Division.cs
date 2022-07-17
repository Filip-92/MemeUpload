using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Division")]
    public class Division
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsCloseDivision { get; set; }
    }
}