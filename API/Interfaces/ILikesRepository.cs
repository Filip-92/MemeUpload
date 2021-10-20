using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int likedUserId);
        //Task<UserLike> GetUserDislike(int sourceUserId, int dislikedUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        //Task<AppUser> GetUserWithDislikes(int userId);
        Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);
        //Task<PagedList<LikeDto>> GetUserDislikes(LikesParams likesParams);
    }
} 