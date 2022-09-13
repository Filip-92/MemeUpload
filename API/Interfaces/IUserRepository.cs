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
        Task<MemberPagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<MemberDto> GetMemberAsync(string username, bool isCurrentUser);
        Task<AppUser> GetUserByPhotoId(int photoId);
        Task<AppUser> GetUserByMemeId(int memeId);
        Task<AppUser> GetUserByCommentId(int commentId);
        Task<AppUser> GetUserByReplyId(int replyId);
        Task<string> GetUserGender(string username);
        Task<AppUser> GetUserByEmailAsync(string email);
        Task<UserDto> GetUserNumberOfLikes(string username);
        Task<PagedList<MemberDto>> SearchForMembers(UserParams userParams, string searchString);
        Task<IEnumerable<ContactFormDto>> GetContactFormMessages();
        Task<IEnumerable<NotificationDto>> GetNotifications(int id);
        Task<Notifications> GetNotificationById(int id);
        void RemoveNotification(Notifications notification);
        Task<IEnumerable<NotificationDto>> GetUnreadNotifications(int id);
        Task<ContactForm> GetMessageById(int id);
        void RemoveMessage(ContactForm message);
        Task<AppUser> CheckIfBanned(int id);
        Task<IEnumerable<Announcement>> GetAnnouncement();
    }
}