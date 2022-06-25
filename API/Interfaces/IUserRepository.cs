using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<MemberDto> GetMemberAsync(string username, bool isCurrentUser);
        Task<AppUser> GetUserByPhotoId(int photoId);
        Task<AppUser> GetUserByMemeId(int memeId);
        Task<string> GetUserGender(string username);
        Task<AppUser> GetUserByEmailAsync(string email);
        Task<UserDto> GetUserNumberOfLikes(int userId);
        Task<PagedList<MemberDto>> SearchForMembers(UserParams userParams, string searchString);
        Task<IEnumerable<ContactFormDto>> GetContactFormMessages();
        Task<IEnumerable<NotificationDto>> GetNotifications(int id);
        Task<ContactForm> GetMessageById(int id);
        void RemoveMessage(ContactForm message);
    }
}