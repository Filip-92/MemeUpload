using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        [Key]
        [Column("email")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override string Email { get; set; }
        public AppUser() 
        {}
        public DateTime DateOfBirth { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;
        public string Gender { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<Memes> Memes { get; set; }
        public ICollection<Comments> Comments { get; set; }
        public ICollection<UserLike> LikedByUsers { get; set; }
        public ICollection<UserLike> LikedUsers { get; set; }
        public ICollection<UserLike> LikedMemes { get; set; }
        public int NumberOfLikes { get; set; } = 0;
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
        public bool IsBanned { get; set; }
        public DateTime BanExpiration { get; set; }
        public string BanReason { get; set; }

    }
} 