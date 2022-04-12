using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MemeLikesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public MemeLikesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetMemeLikes([FromQuery]LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var users = await _unitOfWork.LikesRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(users.CurrentPage, 
                users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }
    }
} 