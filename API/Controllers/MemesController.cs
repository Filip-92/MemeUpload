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
                // PublicId = result.PublicId,
                Title = memeDto.Title,
                Description = memeDto.Description
            };

            user.Memes.Add(meme);

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<MemeDto>(meme));
            }

            return BadRequest("Problem addding meme");
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

        [HttpGet("display-meme-detail/{memeId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<MemeDto>>> GetMeme(int memeId)
        {
            var meme = await _unitOfWork.MemeRepository.GetMeme(memeId);

            return Ok(meme);
        }

        [HttpGet("search-memes/{searchString}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<MemeDto>>> SearchForMemes([FromQuery] MemeParams memeParams, string searchString)
        {
            var memes = await _unitOfWork.MemeRepository.SearchForMemes(memeParams, searchString);

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

        [HttpPost("add-meme-like/{memeId}")]
        public async Task<ActionResult> AddLike(int memeId)
        {
            var sourceUserUsername = User.GetUsername();
            var likedMeme = await _unitOfWork.MemeRepository.GetMeme(memeId);
            // var sourceUser = await _unitOfWork.MemeLikesRepository.GetMemeWithLikes(sourceUserId);

            // if (likedMeme == null) return NotFound();

            if (likedMeme.Username == sourceUserUsername) return BadRequest("You cannot like yourself");

            // var userLike = await _unitOfWork.LikesRepository.GetUserLike(sourceUserId, likedUser.Id);

            likedMeme.NumberOfLikes++;

            // if (userLike != null)
            // {
            //     sourceUser.LikedUsers.Remove(userLike);
            // }
            // else if (userLike == null)
            // {
            //     userLike = new UserLike
            //     {
            //         SourceUserId = sourceUserId,
            //         LikedUserId = likedUser.Id
            //     };

            //     sourceUser.LikedUsers.Add(userLike);
            // }

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to like meme");
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

            var comment = new Comments
            {
                Content = commentDto.Content,
                //Url = commentDto.Url
                MemeId = commentDto.MemeId
            };

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<CommentDto>(comment));
            }

            return BadRequest("Problem adding comment: " + commentDto.Content + " " + user + commentDto.MemeId);
        }

        [HttpGet("get-comments/{memeId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<CommentDto>>> GetComments(int memeId)
        {
            var comments = await _unitOfWork.MemeRepository.GetComments(memeId);

            return Ok(comments);
        }

        [HttpGet("get-member-comments/{username}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<CommentDto>>> GetMemberComments(string username)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            var comments = await _unitOfWork.MemeRepository.GetMemberComments(user.Id);

            return Ok(comments);
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

            if (user.UserName == "lisa") {
                BadRequest(user.Id);
            }

            var photo = await _unitOfWork.PhotoRepository.GetUserPhoto(user.Id);

            return Ok(photo);
        }
    }
}