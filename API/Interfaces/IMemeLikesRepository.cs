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
        Task<Favourite> GetFavourites(int sourceUserId, int favouriteMemeId);
        Task<PagedList<FavouriteDto>> GetUserFavourites(MemeParams memeParams, int userId);
        Task<IEnumerable<FavouriteDto>> GetUserFavourites(int userId);
        Task<IEnumerable<MemeDto>> GetMemesList(List<int> memeIds);
        Task<CommentLike> GetCommentLikes(int sourceUserId, int commentId);
        Task<IEnumerable<CommentLikeDto>> GetCommentLikes(int userId);
        Task<ReplyLike> GetReplyLikes(int sourceUserId, int replyId);
        Task<IEnumerable<ReplyLikeDto>> GetReplyLikes(int userId);
    }
} 