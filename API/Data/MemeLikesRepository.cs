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

        public async Task<Favourite> GetFavourites(int sourceUserId, int favouriteMemeId)
        {
            return await _context.Favourites.FindAsync(sourceUserId, favouriteMemeId);
        }

        public async Task<IEnumerable<FavouriteDto>> GetUserFavourites(int userId)
        {
            return await _context.Favourites
            .IgnoreQueryFilters()
            .Where(m => m.SourceUserId == userId)
            .Select(u => new FavouriteDto
                {
                    SourceUserId = u.SourceUserId,
                    MemeId = u.MemeId
            }).ToListAsync();
        }

        public async Task<IEnumerable<MemeDto>> GetMemesList(List<int> memeIds)
        {
                return await _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Id == memeIds[0])
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes
                }).ToListAsync();
        }

        public async Task<CommentLike> GetCommentLikes(int sourceUserId, int commentId)
        {
            return await _context.CommentLikes.FindAsync(sourceUserId, commentId);
        }

        public async Task<IEnumerable<CommentLikeDto>> GetCommentLikes(int userId)
        {
            // var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            // var likes = _context.MemeLikes.AsQueryable();

             return await _context.CommentLikes
                .IgnoreQueryFilters()
                .Where(m => m.SourceUserId == userId)
                .Select(u => new CommentLikeDto
                {
                    SourceUserId = u.SourceUserId,
                    LikedCommentId = u.LikedCommentId,
                    Disliked = u.Disliked
                }).ToListAsync();
        }
    }
} 