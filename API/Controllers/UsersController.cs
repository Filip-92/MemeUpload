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

        // [HttpPost("add-photo")]
        // public async Task<ActionResult<PhotoDto>> AddPhoto(PhotoDto photoDto)
        // {
        //     var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        //     var photo = new Photo
        //     {
        //         Url = photoDto.Url
        //     };

        //     user.Photos.Add(photo);

        //     if (await _unitOfWork.Complete())
        //     {
        //         return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
        //     }

        //     return BadRequest("Problem addding photo");
        // }

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

            // if (photo.IsMain) return BadRequest("You cannot delete your main photo");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to delete the photo");
        }

        [HttpPost("submit-contact-form")]
        [AllowAnonymous]
        public async Task<ActionResult<ContactFormDto>> SubmitMessage([FromBody] ContactFormDto contactFormDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(1);

            var contactForm = new ContactForm
            {
                SenderName = contactFormDto.SenderName,
                SenderEmail = contactFormDto.SenderEmail,
                Subject = contactFormDto.Subject,
                Message = contactFormDto.Message
            };

            user.Messages.Add(contactForm);

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<ContactFormDto>(contactForm));
            }

            return BadRequest("Problem z wysyłaniem wiadomości");
        }

        [HttpGet("get-user-likes-no/{username}")]
        public async Task<ActionResult<IEntityTypeConfiguration<MemberDto>>> GetUserNumberOfLikes(string username)
        {
            var member = await _unitOfWork.UserRepository.GetUserNumberOfLikes(username);

            return Ok(member.NumberOfLikes);
        }

        [HttpGet("search-members/{searchString}")]
        public async Task<ActionResult<IEntityTypeConfiguration<MemberDto>>> SearchForMembers([FromQuery] UserParams userParams, string searchString)
        {
            var members = await _unitOfWork.UserRepository.SearchForMembers(userParams, searchString);

            Response.AddPaginationHeader(members.CurrentPage, members.PageSize, 
                members.TotalCount, members.TotalPages);

            return Ok(members);
        }

        [HttpGet("get-notifications/{username}")]
        public async Task<ActionResult<IEntityTypeConfiguration<NotificationDto>>> GetNotifications(string username)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var notifications = await _unitOfWork.UserRepository.GetNotifications(user.Id);

            return Ok(notifications);
        }

        [HttpPost("mark-notification-as-read/{notificationId}")]
        public async Task<ActionResult> MarkNotificationAsRead(int notificationId)
        {
            var notification = await _unitOfWork.UserRepository.GetNotificationById(notificationId);

            if (notification == null) return NotFound("Could not find notification");

            if (notification.IsRead) return Ok();

            notification.IsRead = true;

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Nie można otworzyć notyfikacji");
        }

        [HttpGet("get-unread-notifications/{username}")]
        public async Task<ActionResult<IEntityTypeConfiguration<NotificationDto>>> GetUnreadNotifications(string username)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var notifications = await _unitOfWork.UserRepository.GetUnreadNotifications(user.Id);

            return Ok(notifications);
        }

        [HttpPost("remove-notification/{notificationId}")]
        public async Task<ActionResult> RemoveNotification(int notificationId)
        {
            var notification = await _unitOfWork.UserRepository.GetNotificationById(notificationId);

            if (notification == null) return NotFound("Nie można znaleźć powiadomienia");

            _unitOfWork.UserRepository.RemoveNotification(notification);

            await _unitOfWork.Complete();

            return Ok();
        }

        [HttpGet("get-user-email-by-id/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetEmailById(int userId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(userId);

            return Ok(user);
        }

        [HttpGet("get-announcement")]
        [Authorize]
        public async Task<ActionResult> GetAnnouncement()
        {
            var announcement = await _unitOfWork.UserRepository.GetAnnouncement();

            return Ok(announcement);
        }
    }
}