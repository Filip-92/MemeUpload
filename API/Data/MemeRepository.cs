using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
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
                //.Where(p => p.IsApproved == false)
                .Select(u => new MemeForApprovalDto
                {
                    Id = u.Id,
                    Username = u.AppUser.UserName,
                    Url = u.Url,
                    //IsApproved = u.IsApproved
                }).ToListAsync();
        }

        public void RemoveMeme(Memes meme)
        {
            _context.Memes.Remove(meme);
        }
    }
}