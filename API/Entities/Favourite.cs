using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Favourites")]
    public class Favourite
    {
        public AppUser SourceUser { get; set; }
        public int SourceUserId { get; set; }
        public Memes FavouriteMeme { get; set; }
        public int MemeId { get; set; }   
    }
}