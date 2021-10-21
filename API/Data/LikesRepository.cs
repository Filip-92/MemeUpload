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
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        public LikesRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        // public async Task<UserLike> GetUserDislike(int sourceUserId, int dislikedUserId)
        // {
        //     return await _context.Likes.FindAsync(sourceUserId, dislikedUserId);
        // }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
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

        // public async Task<PagedList<LikeDto>> GetUserDislikes(LikesParams likesParams)
        // {
        //     var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
        //     var dislikes = _context.Likes.AsQueryable();

        //     if (likesParams.Predicate == "disliked")
        //     {
        //         dislikes = dislikes.Where(dislike => dislike.SourceUserId == likesParams.UserId);
        //         users = dislikes.Select(dislike => dislike.DislikedUser);
        //     }

        //     if (likesParams.Predicate == "dislikedBy")
        //     {
        //         dislikes = dislikes.Where(dislike => dislike.LikedUserId == likesParams.UserId);
        //         users = dislikes.Select(like => like.SourceUser);
        //     }

        //     var dislikedUsers = users.Select(user => new LikeDto
        //     {
        //         Username = user.UserName,
        //         Age = user.DateOfBirth.CalculateAge(),
        //         PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
        //         Id = user.Id
        //     });

        //     return await PagedList<LikeDto>.CreateAsync(dislikedUsers, 
        //         likesParams.PageNumber, likesParams.PageSize);
        // }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
                .Include(x => x.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }

        // public async Task<AppUser> GetUserWithDislikes(int userId)
        // {
        //     return await _context.Users
        //         .Include(x => x.DislikedUsers)
        //         .FirstOrDefaultAsync(x => x.Id == userId);
        // }

    }
}  