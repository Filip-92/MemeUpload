namespace API.DTOs
{
    public class UserDto
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }
        public string PhotoUrl { get; set; }
        public string MemeUrl { get; set; }
        public string Gender { get; set; }
        public int NumberOfLikes { get; set; }
    }
}