using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMemeLikesRepository
    {
        Task<UserLike> GetMemeLike(int sourceUserId, int likedMemeId);
        Task<AppUser> GetMemeWithLikes(int memeId);
        Task<PagedList<LikeDto>> GetMemeLikes(LikesParams likesParams);
    }
} 