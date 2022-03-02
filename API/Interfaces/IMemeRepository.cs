using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMemeRepository
    {
         Task<IEnumerable<MemeForApprovalDto>> GetUnapprovedMemes();
         Task<PagedList<MemeDto>> GetMemes(MemeParams memeParams);
         Task<IEnumerable<MemeDto>> GetMemes();
         Task<Memes> GetMemeById(int id);
         void RemoveMeme(Memes meme);
    }
}