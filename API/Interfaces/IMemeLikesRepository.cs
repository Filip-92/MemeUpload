using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMemeLikesRepository
    {
        Task<MemeLike> GetMemeLike(int sourceUserId, int likedMemeId);
        Task<AppUser> GetMemeWithLikes(int memeId);
        Task<IEnumerable<MemeLikeDto>> GetUserLikes(int userId);
        Task<IEnumerable<MemeLikeDto>> GetMemesLikedByUser(int userId);
        Task<IEnumerable<MemeLikeDto>> GetMemeLikes2(int id);
    }
} 