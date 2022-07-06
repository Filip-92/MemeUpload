using System.Collections.Generic;

namespace API.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }
        public string PhotoUrl { get; set; }
        public string MemeUrl { get; set; }
        public string Gender { get; set; }
        public int NumberOfLikes { get; set; }
        public List<string> Roles { get; set; }
        public bool IsBanned { get; set; }
    }
}