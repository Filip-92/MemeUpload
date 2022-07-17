using System;
using System.Collections.Generic;

namespace API.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string PhotoUrl { get; set; }
        public string MemeUrl { get; set; }
        public int Age { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Gender { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
        public ICollection<MemeDto> Memes { get; set; }
        public int NumberOfLikes { get; set; }
        public bool IsBanned { get; set; }
        public DateTime BanExpiration { get; set; }
        public string BanReason { get; set; }
    }
}