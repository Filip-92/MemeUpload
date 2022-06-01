using System;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        private readonly IMemeService _memeService;
    
        public AdminController(UserManager<AppUser> userManager, IUnitOfWork unitOfWork, 
            IPhotoService photoService, IMemeService memeService)
        {
            _photoService = photoService;
            _memeService = memeService;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
                .Include(r => r.UserRoles)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find user");

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public async Task<ActionResult> GetPhotosForModeration()
        {
            var photos = await _unitOfWork.PhotoRepository.GetUnapprovedPhotos();

            return Ok(photos);
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("approve-photo/{photoId}")]
        public async Task<ActionResult> ApprovePhoto(int photoId)
        {
            var photo = await _unitOfWork.PhotoRepository.GetPhotoById(photoId);

            if (photo == null) return NotFound("Could not find photo");

         //   photo.IsApproved = true;

            var user = await _unitOfWork.UserRepository.GetUserByPhotoId(photoId);

            if (!user.Photos.Any(x => x.IsMain)) photo.IsMain = true;

            await _unitOfWork.Complete();

            return Ok();
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("reject-photo/{photoId}")]
        public async Task<ActionResult> RejectPhoto(int photoId)
        {
            var photo = await _unitOfWork.PhotoRepository.GetPhotoById(photoId);

            if (photo == null) return NotFound("Could not find photo");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);

                if (result.Result == "ok")
                {
                    _unitOfWork.PhotoRepository.RemovePhoto(photo);
                }
            }
            else
            {
                _unitOfWork.PhotoRepository.RemovePhoto(photo);
            }

            await _unitOfWork.Complete();

            return Ok();
        }

        [Authorize(Policy = "ModerateMemeRole")]
        [HttpGet("memes-to-moderate")]
        public async Task<ActionResult<IEntityTypeConfiguration<MemeDto>>> GetMemesForModeration([FromQuery] MemeParams memeParams)
        {
            var memes = await _unitOfWork.MemeRepository.GetUnapprovedMemes(memeParams);

            Response.AddPaginationHeader(memes.CurrentPage, memes.PageSize, 
                memes.TotalCount, memes.TotalPages);

            return Ok(memes);
        }

        [AllowAnonymous]
        [HttpGet("member-memes-to-moderate/{memberUsername}")]
        public async Task<ActionResult> GetMemberMemes([FromQuery] MemeParams memeParams, string username)
        {
            var memes = await _unitOfWork.MemeRepository.GetMemberMemes(memeParams, username);

            return Ok(memes);
        }

        [Authorize(Policy = "ModerateMemeRole")]
        [HttpPost("approve-meme/{memeId}")]
        public async Task<ActionResult> ApproveMeme(int memeId)
        {
            var meme = await _unitOfWork.MemeRepository.GetMemeById(memeId);

            if (meme == null) return NotFound("Could not find meme");

            meme.IsApproved = true;

            var user = await _unitOfWork.UserRepository.GetUserByMemeId(memeId);

            await _unitOfWork.Complete();

            return Ok();
        }

        [Authorize(Policy = "ModerateMemeRole")]
        [HttpPost("push-meme-to-main/{memeId}")]
        public async Task<ActionResult> PushMemeToMain(int memeId)
        {
            var meme = await _unitOfWork.MemeRepository.GetMemeById(memeId);

            if (meme == null) return NotFound("Could not find meme");

            meme.IsMain = true;
            meme.IsApproved = true;

            var user = await _unitOfWork.UserRepository.GetUserByMemeId(memeId);

            await _unitOfWork.Complete();

            return Ok();
        }

        [Authorize(Policy = "ModerateMemeRole")]
        [HttpPost("reject-meme/{memeId}")]
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

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("/remove-user/{userId}"), ActionName("Delete")]
        public async Task<ActionResult> RemoveUser(int userId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(userId);

            if (user == null) return NotFound("Could not find user");

            // if (userId != null)
            {
                var result = _userManager.DeleteAsync(user);
            }

            await _unitOfWork.Complete();

            return Ok();
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("ban-user/{username}/{days}")]
        public async Task<ActionResult> BanUser(string username, int days, MemberDto memberDto)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find user");

            user.IsBanned = true;
            user.BanExpiration = DateTime.Now;
            user.BanExpiration = user.BanExpiration.AddDays(days);
            user.BanReason = memberDto.BanReason;

            await _unitOfWork.Complete();

            return Ok();
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("unban-user/{username}")]
        public async Task<ActionResult> UnbanUser(string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find meme");

            user.IsBanned = false;
            user.BanExpiration = DateTime.Now;
            user.BanReason = null;

            await _unitOfWork.Complete();

            return Ok();
        }

    }
}