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
        private DataContext context;

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
                    IsApproved = u.IsApproved
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

        public async Task<IEnumerable<MemeDto>> GetMemesList()
        {
            Random random = new Random();

                return await _context.Memes
                .IgnoreQueryFilters()
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded
                }).ToListAsync();
        }

        public async Task<IEnumerable<MemeDto>> GetMeme(int id)
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
                    Uploaded = u.Uploaded
                }).ToListAsync();
        }

        public async Task<PagedList<MemeDto>> SearchForMemes(MemeParams memeParams, string searchString)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Title.Contains(searchString))
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

        public async Task<PagedList<MemeDto>> GetMemesLast24H(MemeParams memeParams)
        {
            var query = _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.Uploaded > (DateTime.Now.AddDays(-1)))
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

        public async Task<IEnumerable<MemeDto>> GetMemberMemes(int userId)
        {
            return await _context.Memes
                .IgnoreQueryFilters()
                .Where(m => m.AppUserId == 1)
                .Select(u => new MemeDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded
                }).ToListAsync();
        }

        public void RemoveMeme(Memes meme)
        {
            _context.Memes.Remove(meme);
        }
    }
}