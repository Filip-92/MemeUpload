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
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IMemeService _memeService;
        private readonly IUnitOfWork _unitOfWork;
        public UsersController(IUnitOfWork unitOfWork, IMapper mapper,
            IPhotoService photoService, IMemeService memeService)
        {
            _unitOfWork = unitOfWork;
            _photoService = photoService;
            _memeService = memeService;
            _mapper = mapper;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var gender = await _unitOfWork.UserRepository.GetUserGender(User.GetUsername());
            userParams.CurrentUsername = User.GetUsername();

            if (string.IsNullOrEmpty(userParams.Gender))
                userParams.Gender = gender == "male" ? "female" : "male";

            var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize,
                users.TotalCount, users.TotalPages);

            return Ok(users);
        }

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var currentUsername = User.GetUsername();
            return await _unitOfWork.UserRepository.GetMemberAsync(username,
                isCurrentUser: currentUsername == username
            );
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            _mapper.Map(memberUpdateDto, user);

            _unitOfWork.UserRepository.Update(user);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update user");
        }

        // Photos

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            user.Photos.Add(photo);

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Problem addding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo.IsMain) return BadRequest("This is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("You cannot delete your main photo");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to delete the photo");
        }

        // Memes

        [HttpPost("{description}")]
        public string AddDescription(MemeDto memeDto)
        {  
            var description = memeDto.Description;

            return description;
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

            if (result.Error != null) return BadRequest(result.Error.Message);

            var meme = new Memes
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                Title = file.FileName,
                Description = ""
            };

            user.Memes.Add(meme);

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<MemeDto>(meme));
            }

            return BadRequest("Problem addding meme");
        }

        [HttpPost("add-youtube-video")]
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

        [HttpDelete("delete-meme/{memeId}")]
        public async Task<ActionResult> DeleteMeme(int memeId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var meme = user.Memes.FirstOrDefault(x => x.Id == memeId);

            if (meme == null) return NotFound();

            if (meme.PublicId != null)
            {
                var result = await _memeService.DeleteMemeAsync(meme.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Memes.Remove(meme);

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to delete the meme");
        }

        [HttpPost("{memeId}")]
        public async Task<ActionResult> AddLike(int id)
        {
            var sourceUserId = User.GetUserId();
            var likedMeme = await _unitOfWork.MemeRepository.GetMemeById(id);
            var sourceUser = await _unitOfWork.MemeLikesRepository.GetMemeWithLikes(sourceUserId);

            // if (likedMeme == null) return NotFound();

            // if (sourceUser.UserName == username) return BadRequest("You cannot like yourself");

            // var userLike = await _unitOfWork.LikesRepository.GetUserLike(sourceUserId, likedUser.Id);

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

            return BadRequest("Failed to like user");
        }

        [Authorize(Policy = "ModerateMemeRole")]
        [HttpPost("remove-meme/{memeId}")]
        public async Task<ActionResult> RejectMeme(int memeId)
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
    }
}