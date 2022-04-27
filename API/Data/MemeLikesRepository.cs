using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MemeLikesRepository : IMemeLikesRepository
    {
        private readonly DataContext _context;
        public MemeLikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetMemeLike(int sourceUserId, int likedMemeId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedMemeId);
        }

        public async Task<PagedList<LikeDto>> GetMemeLikes(LikesParams likesParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if (likesParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
                users = likes.Select(like => like.LikedUser);
            }

            if (likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == likesParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUsers = users.Select(user => new LikeDto
            {
                Username = user.UserName,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                Id = user.Id
            });

            return await PagedList<LikeDto>.CreateAsync(likedUsers, 
                likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetMemeWithLikes(int memeId)
        {
            return await _context.Users
                .Include(x => x.LikedMemes)
                .FirstOrDefaultAsync(x => x.Id == memeId);
        }
    }
} 