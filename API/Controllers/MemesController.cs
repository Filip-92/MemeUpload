using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MemesController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IMemeService _memeService;
        private readonly IUnitOfWork _unitOfWork;
        public MemesController(IUnitOfWork unitOfWork, IMapper mapper,
            IPhotoService photoService, IMemeService memeService)
        {
            _unitOfWork = unitOfWork;
            _photoService = photoService;
            _memeService = memeService;
            _mapper = mapper;
        }

        [HttpPost("add-meme")]
        public async Task<ActionResult<MemeDto>> AddMeme(IFormFile file)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            dynamic result = null;

            if (file.ContentType.Contains("image"))
            {
                result = await _memeService.AddMemeAsync(file);
            }
            else if (file.ContentType.Contains("video"))
            {
                result = await _memeService.AddMemeVidAsync(file);
            }

            var title = file.FileName;

            string[] splitTitleAndDesc = title.Split('^');

            if (result.Error != null) return BadRequest(result.Error.Message);

            var meme = new Memes
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                Title = splitTitleAndDesc[0],
                Description = splitTitleAndDesc[1]
            };

            user.Memes.Add(meme);

            if (await _unitOfWork.Complete())
            {

                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<MemeDto>(meme));
            }

            return BadRequest("Problem addding meme");
        }

        [HttpPost("add-youtube-link")]
        public async Task<ActionResult<MemeDto>> AddYoutubeVideo(MemeDto memeDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var meme = new Memes
            {
                Url = memeDto.Url,
                Title = memeDto.Title,
                Description = memeDto.Description,
                Division = memeDto.Division
            };

            user.Memes.Add(meme);

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<MemeDto>(meme));
            }

            return BadRequest("Problem adding meme");
        }

        [HttpGet("memes-to-display")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<MemeDto>>> GetMemes([FromQuery] MemeParams memeParams)
        {
            var memes = await _unitOfWork.MemeRepository.GetMemes(memeParams);

            Response.AddPaginationHeader(memes.CurrentPage, memes.PageSize, 
                memes.TotalCount, memes.TotalPages);

            return Ok(memes);
        }

        [HttpGet("memes-to-display-main")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<MemeDto>>> GetMemesMain([FromQuery] MemeParams memeParams)
        {
            var memes = await _unitOfWork.MemeRepository.GetMemesMain(memeParams);

            Response.AddPaginationHeader(memes.CurrentPage, memes.PageSize, 
                memes.TotalCount, memes.TotalPages);

            return Ok(memes);
        }

        [HttpGet("display-meme-detail/{memeId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<MemeDto>>> GetMeme(int memeId)
        {
            var meme = await _unitOfWork.MemeRepository.GetMeme(memeId);

            return Ok(meme);
        }

        [HttpGet("search-memes/{searchString}/{type}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<MemeDto>>> SearchForMemes([FromQuery] MemeParams memeParams, string searchString, string type)
        {
            var memes = await _unitOfWork.MemeRepository.SearchForMemes(memeParams, searchString, type);

            Response.AddPaginationHeader(memes.CurrentPage, memes.PageSize, 
                memes.TotalCount, memes.TotalPages);

            return Ok(memes);
        }

        [HttpGet("get-random-meme")]
        [AllowAnonymous]
        public async Task<ActionResult> GetRandomMeme()
        {
            Random random = new Random();

            var meme = await _unitOfWork.MemeRepository.GetMemesList();

            var array = meme.ToArray();

            var index = random.Next(array.Count());
  
            return Ok(array[index]);
        }

        [HttpGet("get-member-memes/{username}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<MemeDto>>> GetMemberMemes([FromQuery] MemeParams memeParams, string username)
        {
            var memes = await _unitOfWork.MemeRepository.GetMemberMemes(memeParams, username);

            Response.AddPaginationHeader(memes.CurrentPage, memes.PageSize, 
                memes.TotalCount, memes.TotalPages);

            return Ok(memes);
        }

        [HttpPost("remove-meme/{memeId}")]
        public async Task<ActionResult> RemoveMeme(int memeId)
        {
            var meme = await _unitOfWork.MemeRepository.GetMemeById(memeId);

            if (meme == null) return NotFound("Could not find meme");

            if (meme.PublicId != null)
            {
                var result = await _memeService.DeleteMemeAsync(meme.PublicId);

                if (result.Result == "ok")
                {
                    _unitOfWork.MemeRepository.RemoveMeme(meme);
                }
            }
            else
            {
                _unitOfWork.MemeRepository.RemoveMeme(meme);
            }

            await _unitOfWork.Complete();

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("memes-to-moderate/last24H")]
        public async Task<ActionResult<IEntityTypeConfiguration<MemeDto>>> GetMemesLast24H([FromQuery] MemeParams memeParams)
        {
            var memes = await _unitOfWork.MemeRepository.GetMemesLast24H(memeParams);

            Response.AddPaginationHeader(memes.CurrentPage, memes.PageSize, 
                memes.TotalCount, memes.TotalPages);

            return Ok(memes);
        }

        [HttpPost("add-comment")]
        public async Task<ActionResult<CommentDto>> AddComment(CommentDto commentDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var memes = await _unitOfWork.MemeRepository.GetMemeById(commentDto.MemeId);

            var notifiedUser = await _unitOfWork.UserRepository.GetUserByMemeId(commentDto.MemeId);

            var comment = new Comments
            {
                Content = commentDto.Content,
                //Url = commentDto.Url
                MemeId = commentDto.MemeId
            };

            user.Comments.Add(comment);
            memes.Comments.Add(comment);

            if (await _unitOfWork.Complete())
            {
                await SendNotification(commentDto.MemeId, notifiedUser);
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<CommentDto>(comment));
            }

            return BadRequest("Problem adding comment: " + commentDto.Content + " " + user + " " + commentDto.MemeId);
        }

        [HttpPost("add-meme")]
        public async Task<ActionResult<MemeDto>> AddCommentWithImage(IFormFile file)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            dynamic result = null;

            if (file.ContentType.Contains("image"))
            {
                result = await _memeService.AddMemeAsync(file);
            }
            else if (file.ContentType.Contains("video"))
            {
                result = await _memeService.AddMemeVidAsync(file);
            }

            var title = file.FileName;

            string[] splitTitleAndDesc = title.Split('^');

            if (result.Error != null) return BadRequest(result.Error.Message);

            var meme = new Memes
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                Title = splitTitleAndDesc[0],
                Description = splitTitleAndDesc[1]
            };

            user.Memes.Add(meme);

            if (await _unitOfWork.Complete())
            {

                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<MemeDto>(meme));
            }

            return BadRequest("Problem addding meme");
        }

        public async Task<ActionResult<NotificationDto>> SendNotification(int memeId, AppUser user)
        {
            BadRequest(user);

            var notification = new Notifications
            {
                Content = "Pojawił się nowy komentarz pod Twoim memem",
                MemeId = memeId,
                AppUserId = user.Id
            };

            user.Notifications.Add(notification);

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<NotificationDto>(notification));
            }

            return BadRequest("Problem z wysłaniem powiadomienia");
        }

        [HttpGet("get-comments/{memeId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<CommentDto>>> GetComments(int memeId)
        {
            var comments = await _unitOfWork.MemeRepository.GetComments(memeId);

            return Ok(comments);
        }

        [HttpGet("get-member-comments/{username}")]
        public async Task<ActionResult<IEntityTypeConfiguration<CommentDto>>> GetMemberComments(string username)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            var comments = await _unitOfWork.MemeRepository.GetMemberComments(user.Id);

            return Ok(comments);
        }

        [HttpPost("remove-comment/{commentId}")]
        public async Task<ActionResult> RemoveComment(int commentId)
        {
            var comment = await _unitOfWork.MemeRepository.GetCommentById(commentId);

            if (comment == null) return NotFound("Could not find comment");

            _unitOfWork.MemeRepository.RemoveComment(comment);

            await _unitOfWork.Complete();

            return Ok();
        }

        [HttpPut("{commentId}")]
        public async Task<ActionResult> UpdateComment(CommentUpdateDto commentUpdateDto, int commentId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            var comment = await _unitOfWork.MemeRepository.GetCommentById(commentId);

            _mapper.Map(commentUpdateDto, user);

            _unitOfWork.MemeRepository.Update(comment);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update comment");
        }

        [HttpPost("add-reply")]
        public async Task<ActionResult<CommentResponseDto>> AddReply(CommentResponseDto commentResponseDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var memes = await _unitOfWork.MemeRepository.GetMemeById(commentResponseDto.MemeId);

            var response = new CommentResponses
            {
                Content = commentResponseDto.Content,
                //Url = commentDto.Url
                MemeId = commentResponseDto.MemeId,
                CommentId = commentResponseDto.CommentId
            };

            user.Responses.Add(response);
            //memes.Comments.Add(comment);

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<CommentResponseDto>(response));
            }

            return BadRequest("Problem adding comment: " + commentResponseDto.Content + " " + user + " " + commentResponseDto.MemeId);
        }

        [HttpGet("get-replies/{commentId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<CommentResponseDto>>> GetReplies(int commentId)
        {
            var replies = await _unitOfWork.MemeRepository.GetReplies(commentId);

            return Ok(replies);
        }

        [HttpPost("remove-reply/{replyId}")]
        public async Task<ActionResult> RemoveReply(int replyId)
        {
            var reply = await _unitOfWork.MemeRepository.GetReplyById(replyId);

            if (reply == null) return NotFound("Nie można znaleźć odpowiedzi");

            _unitOfWork.MemeRepository.RemoveReply(reply);

            await _unitOfWork.Complete();

            return Ok();
        }

        [HttpGet("get-user-photo/{userId}")]
        [AllowAnonymous]
        public async Task<ActionResult<PhotoDto>> GetPhoto(int userId)
        {
            var photo = await _unitOfWork.PhotoRepository.GetUserPhoto(userId);

            return Ok(photo);
        }

        [HttpGet("get-user-photo-by-username/{username}")]
        [AllowAnonymous]
        public async Task<ActionResult<PhotoDto>> GetPhotoByUsername(string username)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            var photo = await _unitOfWork.PhotoRepository.GetUserPhoto(user.Id);

            return Ok(photo);
        }

        [HttpGet("get-divisions")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<DivisionDto>>> GetDivisions()
        {
            var divisions = await _unitOfWork.MemeRepository.GetDivisions();

            return Ok(divisions);
        }

        [HttpGet("get-memes-by-division/{divisionId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<DivisionDto>>> GetMemesByDivision([FromQuery] MemeParams memeParams, int divisionId)
        {
            var memes = await _unitOfWork.MemeRepository.GetMemesByDivision(memeParams, divisionId);

            Response.AddPaginationHeader(memes.CurrentPage, memes.PageSize, 
                memes.TotalCount, memes.TotalPages);

            return Ok(memes);
        }

        [HttpGet("get-division-name-by-id/{divisionId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<DivisionDto>>> GetDivisionNameById(int divisionId)
        {
            var division = await _unitOfWork.MemeRepository.GetDivisionNameById(divisionId);

            return Ok(division);
        }

        [HttpGet("get-division-id-by-name/{divisionName}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<DivisionDto>>> GetDivisionIdByName(string divisionName)
        {
            var division = await _unitOfWork.MemeRepository.GetDivisionIdByName(divisionName);

            return Ok(division);
        }

        [HttpGet("get-meme-likes/{memeId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemeLikeDto>>> GetMemeLikes(int memeId)
        {
            var memes = await _unitOfWork.MemeLikesRepository.GetMemeLikes2(memeId);

            return Ok(memes);
        }

        [HttpPost("add-meme-like/{memeId}")]
        public async Task<ActionResult> AddLike(int memeId)
        {
            var sourceUserId = User.GetUserId();
            var likedMeme = await _unitOfWork.MemeRepository.GetMemeById(memeId);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);

            if (likedMeme == null) return NotFound();

            if (likedMeme.AppUserId == sourceUserId) return BadRequest("Nie możesz polubić własnego mema!");

            var userLike = await _unitOfWork.MemeLikesRepository.GetMemeLike(sourceUserId, likedMeme.Id);

            if (userLike != null)
            {
                sourceUser.LikedMemes.Remove(userLike);
                likedMeme.NumberOfLikes--;
            }
            else if (userLike == null)
            {
                userLike = new MemeLike
                {
                    SourceUserId = sourceUserId,
                    LikedMemeId = likedMeme.Id,
                    Disliked = false
                };

                sourceUser.LikedMemes.Add(userLike);
                likedMeme.NumberOfLikes++;
            }

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to like meme");
        }

        [HttpPost("add-meme-dislike/{memeId}")]
        public async Task<ActionResult> AddDislike(int memeId)
        {
            var sourceUserId = User.GetUserId();
            var likedMeme = await _unitOfWork.MemeRepository.GetMemeById(memeId);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);

            if (likedMeme == null) return NotFound();

            if (likedMeme.AppUserId == sourceUserId) return BadRequest("Nie możesz zminusować własnego mema!");

            var userLike = await _unitOfWork.MemeLikesRepository.GetMemeLike(sourceUserId, likedMeme.Id);

            if (userLike != null)
            {
                sourceUser.LikedMemes.Remove(userLike);
                likedMeme.NumberOfLikes++;
            }
            else if (userLike == null)
            {
                userLike = new MemeLike
                {
                    SourceUserId = sourceUserId,
                    LikedMemeId = likedMeme.Id,
                    Disliked = true
                };

                sourceUser.LikedMemes.Add(userLike);
                likedMeme.NumberOfLikes--;
            }

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to like meme");
        }

        [HttpGet("likes")]
        public async Task<ActionResult<IEnumerable<MemeLikeDto>>> GetMemeLikes([FromQuery]MemeLikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var memes = await _unitOfWork.MemeLikesRepository.GetUserLikes(likesParams.UserId);

            return Ok(memes);
        }

        [HttpGet("get-memes-liked-by-user/{userId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemeLikeDto>>> GetMemesLikedByUser(int userId)
        {
            var memes = await _unitOfWork.MemeLikesRepository.GetMemesLikedByUser(userId);

            return Ok(memes);
        }

        [HttpGet("get-number-of-comments/{memeId}")]
        [AllowAnonymous]
        public async Task<ActionResult> GetNumberOfComments(int memeId)
        {
            var comments = await _unitOfWork.MemeRepository.GetComments(memeId);
            
            var replies = await _unitOfWork.MemeRepository.GetMemeReplies(memeId);

            return Ok(comments.Count() + replies.Count());
        }

        [HttpPost("add-comment-like/{commentId}")]
        public async Task<ActionResult> AddCommentLike(int commentId)
        {
            var sourceUserId = User.GetUserId();
            var likedComment = await _unitOfWork.MemeRepository.GetCommentById(commentId);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);

            if (likedComment == null) return NotFound();

            if (likedComment.AppUserId == sourceUserId) return BadRequest("Nie możesz polubić własnego komentarza!");

            var userLike = await _unitOfWork.MemeLikesRepository.GetCommentLikes(sourceUserId, likedComment.Id);

            if (userLike != null)
            {
                sourceUser.LikedComments.Remove(userLike);
                likedComment.NumberOfLikes--;
            }
            else if (userLike == null)
            {
                userLike = new CommentLike
                {
                    SourceUserId = sourceUserId,
                    LikedCommentId = likedComment.Id,
                    MemeId = likedComment.MemeId,
                    Disliked = false
                };

                sourceUser.LikedComments.Add(userLike);
                likedComment.NumberOfLikes++;
            }

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to like meme");
        }

        [HttpPost("add-comment-dislike/{commentId}")]
        public async Task<ActionResult> AddCommentDislike(int commentId)
        {
            var sourceUserId = User.GetUserId();
            var likedComment = await _unitOfWork.MemeRepository.GetCommentById(commentId);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);

            if (likedComment == null) return NotFound();

            if (likedComment.AppUserId == sourceUserId) return BadRequest("Nie możesz zminusować własnego komentarza!");

            var userLike = await _unitOfWork.MemeLikesRepository.GetCommentLikes(sourceUserId, likedComment.Id);

            if (userLike != null)
            {
                sourceUser.LikedComments.Remove(userLike);
                likedComment.NumberOfLikes++;
            }
            else if (userLike == null)
            {
                userLike = new CommentLike
                {
                    SourceUserId = sourceUserId,
                    LikedCommentId = likedComment.Id,
                    MemeId = likedComment.MemeId,
                    Disliked = true
                };

                sourceUser.LikedComments.Add(userLike);
                likedComment.NumberOfLikes--;
            }

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to like meme");
        }

        [HttpGet("comment-likes")]
        public async Task<ActionResult<IEnumerable<CommentLikeDto>>> GetCommentLikes()
        {
            var userId = User.GetUserId();
            var memes = await _unitOfWork.MemeLikesRepository.GetCommentLikes(userId);

            return Ok(memes);
        }

        [HttpPost("add-reply-like/{replyId}")]
        public async Task<ActionResult> AddReplyLike(int replyId)
        {
            var sourceUserId = User.GetUserId();
            var likedComment = await _unitOfWork.MemeRepository.GetReplyById(replyId);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);

            if (likedComment == null) return NotFound();

            if (likedComment.AppUserId == sourceUserId) return BadRequest("Nie możesz polubić własnego komentarza!");

            var userLike = await _unitOfWork.MemeLikesRepository.GetReplyLikes(sourceUserId, likedComment.Id);

            if (userLike != null)
            {
                sourceUser.LikedReplies.Remove(userLike);
                likedComment.NumberOfLikes--;
            }
            else if (userLike == null)
            {
                userLike = new ReplyLike
                {
                    SourceUserId = sourceUserId,
                    LikedReplyId = likedComment.Id,
                    MemeId = likedComment.MemeId,
                    Disliked = false
                };

                sourceUser.LikedReplies.Add(userLike);
                likedComment.NumberOfLikes++;
            }

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Nie udało się polubić komentarza");
        }

        [HttpPost("add-reply-dislike/{replyId}")]
        public async Task<ActionResult> AddReplyDislike(int replyId)
        {
            var sourceUserId = User.GetUserId();
            var likedComment = await _unitOfWork.MemeRepository.GetReplyById(replyId);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);

            if (likedComment == null) return NotFound();

            if (likedComment.AppUserId == sourceUserId) return BadRequest("Nie możesz zminusować własnego komentarza!");

            var userLike = await _unitOfWork.MemeLikesRepository.GetReplyLikes(sourceUserId, likedComment.Id);

            if (userLike != null)
            {
                sourceUser.LikedReplies.Remove(userLike);
                likedComment.NumberOfLikes++;
            }
            else if (userLike == null)
            {
                userLike = new ReplyLike
                {
                    SourceUserId = sourceUserId,
                    LikedReplyId = likedComment.Id,
                    MemeId = likedComment.MemeId,
                    Disliked = true
                };

                sourceUser.LikedReplies.Add(userLike);
                likedComment.NumberOfLikes--;
            }

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Nie udało się zminusować komentarza");
        }

        [HttpGet("reply-likes")]
        public async Task<ActionResult<IEnumerable<ReplyLikeDto>>> GetReplyLikes()
        {
            var userId = User.GetUserId();
            var reply = await _unitOfWork.MemeLikesRepository.GetReplyLikes(userId);

            return Ok(reply);
        }

        [HttpPost("add-meme-to-favourite/{memeId}")]
        public async Task<ActionResult> AddMemeToFavourite(int memeId)
        {
            var sourceUserId = User.GetUserId();
            var favouriteMeme = await _unitOfWork.MemeRepository.GetMemeById(memeId);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);

            if (favouriteMeme == null) return NotFound();

            var userLike = await _unitOfWork.MemeLikesRepository.GetFavourites(sourceUserId, favouriteMeme.Id);

            if (userLike != null)
            {
                sourceUser.Favourites.Remove(userLike);
            }
            else if (userLike == null)
            {
                userLike = new Favourite
                {
                    SourceUserId = sourceUserId,
                    MemeId = favouriteMeme.Id,
                    FavouriteMeme = favouriteMeme
                };

                sourceUser.Favourites.Add(userLike);
            }

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Nie można dodać do ulubionych");
        }

        [HttpGet("get-user-favourites/{username}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<FavouriteDto>>> GetUserFavourites(string username)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            var memes = await _unitOfWork.MemeLikesRepository.GetUserFavourites(user.Id);

            var fav = new List<int>();

            // foreach (var meme in memes)
            // {
            //     fav.Append(meme.MemeId);
            // }

            // var favouriteMemes = await _unitOfWork.MemeLikesRepository.GetMemesList(fav);

            return Ok(memes);
        }
    }
}