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
    public class MemeRepository : IMemeRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MemeRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Memes> GetMemeById(int id)
        {
            return await _context.Memes
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<PagedList<MemeForApprovalDto>> GetUnapprovedMemes(MemeParams memeParams)
        {
                var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.IsApproved == false)
                .Select(u => new MemeForApprovalDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                    IsApproved = u.IsApproved,
                    IsMain = u.IsMain,
                    NumberOfLikes = u.NumberOfLikes,
                    NumberOfFlags = u.NumberOfSpamFlags,
                    Division = u.Division
                }).AsNoTracking()
                .OrderByDescending(u => u.Id);

            return await PagedList<MemeForApprovalDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<MemeDto> GetMemeAsync(int id)
        {
            var query = _context.Memes
                .Where(x => x.Id == id)
                .ProjectTo<MemeDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

            return await query.FirstOrDefaultAsync();
        }

        public async Task<PagedList<MemeDto>> GetMemes(MemeParams memeParams)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.IsMain == false && m.Division == 0 && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    IsMain = u.IsMain,
                    IsHidden = u.IsHidden,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                    NumberOfLikes = u.NumberOfLikes,
                    Division = u.Division
                }).AsNoTracking()
                .OrderByDescending(u => u.Id);

            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<PagedList<MemeDto>> GetMemesMain(MemeParams memeParams)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.IsMain == true && m.Division == 0 && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    IsMain = u.IsMain,
                    IsHidden = u.IsHidden,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                    NumberOfLikes = u.NumberOfLikes,
                }).AsNoTracking()
                .OrderByDescending(u => u.Id);

            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<PagedList<MemeDto>> GetMemesByDivision(MemeParams memeParams, int divisionId)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Division == divisionId && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    IsMain = u.IsMain,
                    IsHidden = u.IsHidden,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                    NumberOfLikes = u.NumberOfLikes,
                    Division = u.Division
                }).AsNoTracking()
                .OrderByDescending(u => u.Id);

            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<IEnumerable<MemeDto>> GetMemesList()
        {
                return await _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes
                }).ToListAsync();
        }

        public async Task<MemeDto> GetMeme(int id)
        {
            return await _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Id == id)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes,
                    Division = u.Division
                }).SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemeDto>> SearchForMemes(MemeParams memeParams, string searchString, string type)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Title.ToLower().Contains(searchString) && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                }).AsNoTracking()
                .OrderByDescending(u => u.Id);

            if (type == "Images") {
                query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Title.ToLower().Contains(searchString) && m.IsHidden == false)
                .Where(m => m.Url.Contains(".jpg") || m.Url.Contains(".png"))
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                }).AsNoTracking()
                .OrderByDescending(u => u.Id);
            } else if (type == "Gifs") {
                query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Title.ToLower().Contains(searchString) && m.IsHidden == false)
                .Where(m => m.Url.Contains(".gif"))
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                }).AsNoTracking()
                .OrderByDescending(u => u.Id);
            } else if (type == "Video") {
                query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Title.ToLower().Contains(searchString))
                .Where(m => m.Url.Contains(".mp4"))
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                }).AsNoTracking()
                .OrderByDescending(u => u.Id);
            }

            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<PagedList<MemeDto>> GetMemberMemes(MemeParams memeParams, string username)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.AppUser.UserName == username && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                }).AsNoTracking()
                .OrderByDescending(u => u.Id);
            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<IEnumerable<MemeDto>> GetMemberMainMemes(string username)
        {
            return await _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.AppUser.UserName == username && m.IsMain == true && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                }).ToListAsync();
        }

        public async Task<PagedList<MemeDto>> GetMemesLast24H(MemeParams memeParams)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.IsMain == false && m.Division == 0 && m.Uploaded > (DateTime.Now.AddDays(-1)) && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes 
                }).AsNoTracking()
                .OrderByDescending(u => u.NumberOfLikes);

            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<PagedList<MemeDto>> GetMemesLast24HMain(MemeParams memeParams)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.IsMain == true && m.Uploaded > (DateTime.Now.AddDays(-1)) && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes 
                }).AsNoTracking()
                .OrderByDescending(u => u.NumberOfLikes);

            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<PagedList<MemeDto>> GetMemesLast24HDivision(MemeParams memeParams, int division)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Division == division && m.Uploaded > (DateTime.Now.AddDays(-1)) && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes 
                }).AsNoTracking()
                .OrderByDescending(u => u.NumberOfLikes);

            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<PagedList<MemeDto>> GetMemesLast48H(MemeParams memeParams)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.IsMain == false && m.Division == 0 && m.Uploaded > (DateTime.Now.AddDays(-2)) && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes 
                }).AsNoTracking()
                .OrderByDescending(u => u.NumberOfLikes);

            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<PagedList<MemeDto>> GetMemesLast48HMain(MemeParams memeParams)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.IsMain == true && m.Uploaded > (DateTime.Now.AddDays(-2)) && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes 
                }).AsNoTracking()
                .OrderByDescending(u => u.NumberOfLikes);

            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public async Task<PagedList<MemeDto>> GetMemesLast48HDivision(MemeParams memeParams, int division)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Division == division && m.Uploaded > (DateTime.Now.AddDays(-2)) && m.IsHidden == false)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes 
                }).AsNoTracking()
                .OrderByDescending(u => u.NumberOfLikes);

            return await PagedList<MemeDto>.CreateAsync(query, 
            memeParams.PageNumber, memeParams.PageSize);
        }

        public void RemoveMeme(Memes meme)
        {
            _context.Memes.Remove(meme);
        }

        public async Task<IEnumerable<CommentDto>> GetComments(int id)
        {
                return await _context.Comments
                .IgnoreQueryFilters()
                .Where(m => m.MemeId == id)
                .Select(u => new CommentDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Content = u.Content,
                    Uploaded = u.Uploaded,
                    MemeId = u.MemeId,
                    NumberOfLikes = u.NumberOfLikes
                }).OrderByDescending(u => u.Id)
                .ToListAsync();
        }

        public async Task<IEnumerable<CommentDto>> GetMemberComments(int id)
        {
                return await _context.Comments
                .IgnoreQueryFilters()
                .Where(m => m.AppUserId == id)
                .Select(u => new CommentDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Content = u.Content,
                    Uploaded = u.Uploaded,
                    MemeId = u.MemeId,
                    NumberOfLikes = u.NumberOfLikes
                }).OrderByDescending(u => u.Id)
                .ToListAsync();
        }

        public async Task<Comments> GetCommentById(int id)
        {
            return await _context.Comments
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public void RemoveComment(Comments comment)
        {
            _context.Comments.Remove(comment);
        }

        public void Update(Comments comment)
        {
            _context.Entry(comment).State = EntityState.Modified;
        }

        public async Task<IEnumerable<CommentResponseDto>> GetReplies(int id)
        {
                return await _context.CommentResponses
                .IgnoreQueryFilters()
                .Where(m => m.CommentId == id)
                .Select(u => new CommentResponseDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    MemeId = u.MemeId,
                    CommentId = u.CommentId,
                    Content = u.Content,
                    Quote = u.Quote,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes,
                    ReplyingToUser = u.ReplyingToUser
                }).ToListAsync();
        }

        public async Task<IEnumerable<CommentResponseDto>> GetMemeReplies(int id)
        {
                return await _context.CommentResponses
                .IgnoreQueryFilters()
                .Where(m => m.MemeId == id)
                .Select(u => new CommentResponseDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    MemeId = u.MemeId,
                    CommentId = u.CommentId,
                    Content = u.Content,
                    Quote = u.Quote,
                    Uploaded = u.Uploaded,
                    NumberOfLikes = u.NumberOfLikes
                }).ToListAsync();
        }

        public async Task<IEnumerable<CommentResponseDto>> GetMemberReplies(int id)
        {
                return await _context.CommentResponses
                .IgnoreQueryFilters()
                .Where(m => m.AppUserId == id)
                .Select(u => new CommentResponseDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Content = u.Content,
                    Uploaded = u.Uploaded,
                    MemeId = u.MemeId,
                    NumberOfLikes = u.NumberOfLikes,
                    Quote = u.Quote,
                    ReplyingToReplyId = u.ReplyingToReplyId,
                    ReplyingToUser = u.ReplyingToUser
                }).OrderByDescending(u => u.Id)
                .ToListAsync();
        }

        public async Task<CommentResponses> GetReplyById(int id)
        {
            return await _context.CommentResponses
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public void RemoveReply(CommentResponses reply)
        {
            _context.CommentResponses.Remove(reply);
        }
    
        public async Task<IEnumerable<DivisionDto>> GetDivisions()
        {
                return await _context.Divisions
                .IgnoreQueryFilters()
                .Select(u => new DivisionDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    IsCloseDivision = u.IsCloseDivision
                }).ToListAsync();
        }

        public async Task<DivisionDto> GetDivisionNameById(int id)
        {
                return await _context.Divisions
                .IgnoreQueryFilters()
                .Where(m => m.Id == id)
                .Select(u => new DivisionDto
                {
                    Name = u.Name,
                    IsCloseDivision = u.IsCloseDivision
                }).SingleOrDefaultAsync();
        }

        public async Task<DivisionDto> GetDivisionIdByName(string name)
        {
                return await _context.Divisions
                .IgnoreQueryFilters()
                .Where(m => m.Name == name)
                .Select(u => new DivisionDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    IsCloseDivision = u.IsCloseDivision
                }).SingleOrDefaultAsync();
        }

        public async Task<Division> GetDivisionById(int id)
        {
            return await _context.Divisions
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public void RemoveDivision(Division division)
        {
            _context.Divisions.Remove(division);
        }

        public async Task<Announcement> GetAnnouncementById(int announcementId)
        {
            return await _context.Announcement
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(x => x.Id == announcementId);
        }

        public void RemoveAnnouncement(Announcement announcement)
        {
            _context.Announcement.Remove(announcement);
        }
    }
}