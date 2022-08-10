using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public MessagesController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery]
            MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize,
                messages.TotalCount, messages.TotalPages);

            return messages;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();

            var message = await _unitOfWork.MessageRepository.GetMessage(id);

            if (message.Sender.UserName != username && message.Recipient.UserName != username)
                return Unauthorized();

            if (message.Sender.UserName == username) message.SenderDeleted = true;

            if (message.Recipient.UserName == username) message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                _unitOfWork.MessageRepository.DeleteMessage(message);

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Problem deleting the message");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> EditMessage(MessageUpdateDto messageUpdateDto, int id)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            var message = await _unitOfWork.MessageRepository.GetMessage(id);

            _mapper.Map(messageUpdateDto, user);

            message.Content = messageUpdateDto.Content;

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Nie udało się edytować wiadomości");
        }

        [HttpPost("remove-message/{id}")]
        public async Task<ActionResult> RemoveMessage(int id)
        {
            var message = await _unitOfWork.MessageRepository.GetMessage(id);

            if (message == null) return NotFound("Nie można znaleźć wiadomości");

            // if (reply.PublicId != null) 
            // {
            //     await _memeService.DeleteMemeAsync(reply.PublicId);
            // }

            _unitOfWork.MessageRepository.DeleteMessage(message);

            await _unitOfWork.Complete();

            return Ok();
        }

        [HttpGet("get-unread-messages/{username}")]
        public async Task<ActionResult<IEntityTypeConfiguration<MessageDto>>> GetUnreadMessages(string username)
        {
            // var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var messages = await _unitOfWork.MessageRepository.GetUnreadMessages(username);

            return Ok(messages);
        }
    }
}