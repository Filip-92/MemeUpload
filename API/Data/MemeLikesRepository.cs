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

        public async Task<MemeLike> GetMemeLike(int sourceUserId, int likedMemeId)
        {
            return await _context.MemeLikes.FindAsync(sourceUserId, likedMemeId);
        }

        // public async Task<PagedList<MemeLikeDto>> GetUserLikes(MemeLikesParams likesParams)
        // {
        //     var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
        //     var likes = _context.MemeLikes.AsQueryable();

        //     if (likesParams.Predicate == "liked")
        //     {
        //         likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
        //         users = likes.Select(like => like.LikedUser);
        //     }

        //     var likedMemes = users.Select(meme => new MemeLikeDto
        //     {
        //         Username = meme.UserName,
        //         Id = meme.Id
        //     });

        //     return await PagedList<MemeLikeDto>.CreateAsync(likedMemes, 
        //         likesParams.PageNumber, likesParams.PageSize);
        // }
        public async Task<IEnumerable<MemeLikeDto>> GetUserLikes(int userId)
        {
            // var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            // var likes = _context.MemeLikes.AsQueryable();

             return await _context.MemeLikes
                .IgnoreQueryFilters()
                .Where(m => m.SourceUserId == userId)
                .Select(u => new MemeLikeDto
                {
                    SourceUserId = u.SourceUserId,
                    LikedMemeId = u.LikedMemeId,
                    Disliked = u.Disliked
                }).ToListAsync();
        }
        public async Task<IEnumerable<MemeLikeDto>> GetMemesLikedByUser(int userId)
        {
            return await _context.MemeLikes
            .IgnoreQueryFilters()
            .Where(m => m.SourceUserId == userId)
            .Select(u => new MemeLikeDto
                {
                    SourceUserId = u.SourceUserId,
                    LikedMemeId = u.LikedMemeId,
                    Disliked = u.Disliked
            }).ToListAsync();
        }

        public async Task<AppUser> GetMemeWithLikes(int memeId)
        {
            return await _context.Users
                .Include(x => x.LikedMemes)
                .FirstOrDefaultAsync(x => x.Id == memeId);
        }

        public async Task<IEnumerable<MemeLikeDto>> GetMemeLikes2(int id)
        {
                return await _context.MemeLikes
                .IgnoreQueryFilters()
                .Where(m => m.LikedMemeId == id)
                .Select(u => new MemeLikeDto
                {
                    SourceUserId = u.SourceUserId,
                    LikedMemeId = u.LikedMemeId
                }).ToListAsync();
        }
    }
} 