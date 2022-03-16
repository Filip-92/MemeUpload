using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MemeRepository : IMemeRepository
    {
        private readonly DataContext _context;
        public MemeRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Memes> GetMemeById(int id)
        {
            return await _context.Memes
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<MemeForApprovalDto>> GetUnapprovedMemes()
        {
            return await _context.Memes
                .IgnoreQueryFilters()
                //.Where(m => m.IsApproved == false)
                .Select(u => new MemeForApprovalDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    Title = u.Title,
                    Description = u.Description,
                    Uploaded = u.Uploaded, 
                    IsApproved = u.IsApproved
                }).ToListAsync();
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

        public void RemoveMeme(Memes meme)
        {
            _context.Memes.Remove(meme);
        }
    }
}