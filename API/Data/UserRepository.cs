using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<MemberDto> GetMemberAsync(string username, bool isCurrentUser)
        {
            var query = _context.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

            if (isCurrentUser) query = query.IgnoreQueryFilters();

            return await query.FirstOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            query = query.Where(u => u.Gender == userParams.Gender);

            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };
            
            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(_mapper
                .ConfigurationProvider).AsNoTracking(), 
                    userParams.PageNumber, userParams.PageSize);
        }

        public async Task<AppUser> GetUserByEmailAsync(string email)
        {
            return await _context.Users
               .IgnoreQueryFilters()
               .Where(e => e.Email == email)
               .FirstOrDefaultAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByPhotoId(int photoId)
        {
            return await _context.Users
                .Include(p => p.Photos)
                .IgnoreQueryFilters()
                .Where(p => p.Photos.Any(p => p.Id == photoId))
                .FirstOrDefaultAsync();
        }

        public async Task<AppUser> GetUserByMemeId(int memeId)
        {
            return await _context.Users
                .Include(m => m.Memes)
                .IgnoreQueryFilters()
                .Where(m => m.Memes.Any(m => m.Id == memeId))
                .FirstOrDefaultAsync();
        }

        public async Task<AppUser> GetUserByCommentId(int commentId)
        {
            return await _context.Users
                .Include(m => m.Comments)
                .IgnoreQueryFilters()
                .Where(m => m.Comments.Any(m => m.Id == commentId))
                .FirstOrDefaultAsync();
        }

        public async Task<AppUser> GetUserByReplyId(int replyId)
        {
            return await _context.Users
                .Include(m => m.Responses)
                .IgnoreQueryFilters()
                .Where(m => m.Responses.Any(m => m.Id == replyId))
                .FirstOrDefaultAsync();
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.Photos)
                .Include(p => p.Memes)
                .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<string> GetUserGender(string username)
        {
            return await _context.Users
                .Where(x => x.UserName == username)
                .Select(x => x.Gender).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                .Include(p => p.Photos)
                .Include(p => p.Memes)
                .ToListAsync();
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<UserDto> GetUserNumberOfLikes(int userId)
        {
            return await _context.Users
                .IgnoreQueryFilters()
                .Where(u => u.Id == userId)
                .Select(u => new UserDto
                {
                    NumberOfLikes = u.NumberOfLikes
                }).SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> SearchForMembers(UserParams userParams, string searchString)
        {
            var query = _context.Users
                .IgnoreQueryFilters()
                .Where(m => m.UserName.ToLower().Contains(searchString))
                .Select(u => new MemberDto
                {
                    Id = u.Id,
                    Username = u.UserName,
                    Gender = u.Gender,
                    NumberOfLikes = u.NumberOfLikes,
                    LastActive = u.LastActive,
                    IsBanned = u.IsBanned 
                }).AsNoTracking()
                .OrderByDescending(u => u.Id);

            return await PagedList<MemberDto>.CreateAsync(query, 
            userParams.PageNumber, userParams.PageSize);
        }

        public async Task<IEnumerable<ContactFormDto>> GetContactFormMessages()
        {
                return await _context.ContactForm
                .IgnoreQueryFilters()
                .Select(u => new ContactFormDto
                {
                    Id = u.Id,
                    SenderName = u.SenderName,
                    SenderEmail = u.SenderEmail,
                    Subject = u.Subject,
                    Message = u.Message
                }).OrderByDescending(u => u.Id)
                .ToListAsync();
        }

        public async Task<IEnumerable<NotificationDto>> GetNotifications(int id)
        {
                return await _context.Notifications
                .IgnoreQueryFilters()
                .Where(m => m.AppUserId == id)
                .Select(u => new NotificationDto
                {
                    Id = u.Id,
                    Content = u.Content,
                    MemeId = u.MemeId,
                    SentTime = u.SentTime,
                    IsRead = u.IsRead
                }).OrderByDescending(u => u.Id)
                .ToListAsync();
        }

        public async Task<Notifications> GetNotificationById(int id)
        {
            return await _context.Notifications
            .IgnoreQueryFilters()
            .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<NotificationDto>> GetUnreadNotifications(int id)
        {
                return await _context.Notifications
                .IgnoreQueryFilters()
                .Where(m => m.AppUserId == id && m.IsRead == false)
                .Select(u => new NotificationDto
                {
                    Id = u.Id,
                    Content = u.Content,
                    MemeId = u.MemeId,
                    SentTime = u.SentTime,
                    IsRead = u.IsRead
                }).OrderByDescending(u => u.Id)
                .ToListAsync();
        }

        public async Task<ContactForm> GetMessageById(int id)
        {
            return await _context.ContactForm
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public void RemoveMessage(ContactForm message)
        {
            _context.ContactForm.Remove(message);
        }
    }
}