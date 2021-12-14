using System.Linq;
using System.Threading.Tasks;
using API.Entities;
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

        [Authorize(Policy = "ModerateMemeRole")]
        [HttpGet("memes-to-moderate")]
        public async Task<ActionResult> GetPhotosForModeration()
        {
            var photos = await _unitOfWork.MemeRepository.GetUnapprovedMemes();

            return Ok(photos);
        }

        [Authorize(Policy = "ModerateMemeRole")]
        [HttpPost("approve-meme/{memeId}")]
        public async Task<ActionResult> ApproveMeme(int memeId)
        {
            var meme = await _unitOfWork.MemeRepository.GetMemeById(memeId);

            if (meme == null) return NotFound("Could not find photo");

            meme.IsApproved = true;

            var user = await _unitOfWork.UserRepository.GetUserByPhotoId(memeId);

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

    }
}