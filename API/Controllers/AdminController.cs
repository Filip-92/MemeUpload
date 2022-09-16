using System;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        private readonly IMemeService _memeService;
        public AdminController(UserManager<AppUser> userManager, IUnitOfWork unitOfWork, 
            IPhotoService photoService, IMemeService memeService, IMapper mapper)
        {
            _photoService = photoService;
            _memeService = memeService;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
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
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList(),
                    IsBanned = u.IsBanned
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("search-users/{searchString}")]
        public async Task<ActionResult> SearchForUsers([FromQuery] UserParams userParams, string searchString)
        {
            var users = await _userManager.Users
                .Include(r => r.UserRoles)
                .ThenInclude(r => r.Role)
                .Where(m => m.UserName.ToLower().Contains(searchString))
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList(),
                    IsBanned = u.IsBanned
                })
                .ToListAsync();

            return Ok(users);

            // Response.AddPaginationHeader(users.CurrentPage, users.PageSize, 
            //     users.TotalCount, users.TotalPages);

            // return Ok(users);
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
        [HttpPost("disapprove-meme/{memeId}")]
        public async Task<ActionResult> DisapproveMeme(int memeId)
        {
            var meme = await _unitOfWork.MemeRepository.GetMemeById(memeId);

            if (meme == null) return NotFound("Could not find meme");

            meme.IsApproved = false;
            meme.IsMain = false;

            var user = await _unitOfWork.UserRepository.GetUserByMemeId(memeId);

            await _unitOfWork.Complete();

            return Ok();
        }

        [Authorize(Policy = "ModerateMemeRole")]
        [HttpPost("hide-meme/{memeId}")]
        public async Task<ActionResult> HideMeme(int memeId)
        {
            var meme = await _unitOfWork.MemeRepository.GetMemeById(memeId);

            if (meme == null) return NotFound("Could not find meme");

            meme.IsApproved = false;
            meme.IsMain = false;
            meme.IsHidden = true;

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

            await SendNotification(meme.Id, user);

            return Ok();
        }

        public async Task<ActionResult<NotificationDto>> SendNotification(int memeId, AppUser user)
        {
            var notification = new Notifications
            {
                Content = "Twój mem został dodany na stronę główną",
                MemeId = memeId,
                AppUserId = user.Id
            };

            user.Notifications.Add(notification);

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<NotificationDto>(notification));
            }

            return BadRequest("Problem adding meme");
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
        [HttpPost("remove-message/{messageId}")]
        public async Task<ActionResult> RemoveMessage(int messageId)
        {
            var message = await _unitOfWork.UserRepository.GetMessageById(messageId);

            if (message == null) return NotFound("Could not find message");

            _unitOfWork.UserRepository.RemoveMessage(message);

            await _unitOfWork.Complete();

            return Ok();
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("remove-user/{username}")]
        public async Task<ActionResult> RemoveUser(string username)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound("Nie znaleziono użytkownika");

            await _userManager.UpdateSecurityStampAsync(user);

            new UserDto
            {
                Email = user.Email,
                Username = user.UserName,
                Token = null,
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Gender = user.Gender,
                NumberOfLikes = user.NumberOfLikes
            };

            var result = _userManager.DeleteAsync(user);

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
            if (days <= 30) {
                user.BanExpiration = user.BanExpiration.AddDays(days);
            }
            else if (days > 30) {
                user.BanExpiration = user.BanExpiration.AddYears(10);
            }
            user.BanReason = memberDto.BanReason;

            var result = await _userManager.UpdateSecurityStampAsync(user);

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

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("contact-form-messages")]
        public async Task<ActionResult> GetContactFormMessages()
        {
            var messages = await _unitOfWork.UserRepository.GetContactFormMessages();

            return Ok(messages);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("announcement")]
        public async Task<ActionResult> GetAnnouncement()
        {
            var announcement = await _unitOfWork.UserRepository.GetAnnouncement();

            return Ok(announcement);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("add-announcement")]
        public async Task<ActionResult<AnnouncementDto>> AddAnnouncement(AnnouncementDto announcementDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var announcement = new Announcement
            {
                Id = announcementDto.Id,
                Content = announcementDto.Content
            };

            user.Announcement.Add(announcement);

            if (await _unitOfWork.Complete()) 
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<AnnouncementDto>(announcement));
            }

            return BadRequest("Problem z dodawaniem ogłoszenia");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("remove-announcement/{announcementId}")]
        public async Task<ActionResult<Announcement>> RemoveAnnouncement(int announcementId)
        {
            var announcement = await _unitOfWork.MemeRepository.GetAnnouncementById(announcementId);

            if (announcement == null) return NotFound("Nie znaleziono ogłoszenia");

            _unitOfWork.MemeRepository.RemoveAnnouncement(announcement);

            if (await _unitOfWork.Complete()) 
            {
                return Ok();
            }

            return BadRequest("Problem z usunięciem działu");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("add-division")]
        public async Task<ActionResult<DivisionDto>> AddDivision(DivisionDto divisionDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var division = new Division
            {
                Id = divisionDto.Id,
                Name = divisionDto.Name,
                IsCloseDivision = divisionDto.IsCloseDivision
            };

            user.Divisions.Add(division);

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<DivisionDto>(division));
            }

            return BadRequest("Problem z dodawaniem działu");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("remove-division/{divisionId}")]
        public async Task<ActionResult<Division>> RemoveDivision(int divisionId)
        {
            var division = await _unitOfWork.MemeRepository.GetDivisionById(divisionId);

            if (division == null) return NotFound("Nie znaleziono działu");

            _unitOfWork.MemeRepository.RemoveDivision(division);

            if (await _unitOfWork.Complete()) 
            {
                return Ok();
            }

            return BadRequest("Problem z usunięciem działu");
        }

        [Authorize(Policy = "ModerateMemeRole")]
        [HttpPut("switch-divisions/{memeId}")]
        public async Task<ActionResult> SwitchDivisions(DivisionUpdateDto divisionUpdateDto, int memeId)
        {
            var meme = await _unitOfWork.MemeRepository.GetMemeById(memeId);

            if (meme == null) return NotFound("Nie znaleziono mema");

            meme.Division = divisionUpdateDto.Id;

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Nie udało się zmienić działu.");
        }
    }
}