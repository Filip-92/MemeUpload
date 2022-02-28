using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IMemeRepository
    {
         Task<IEnumerable<MemeForApprovalDto>> GetUnapprovedMemes();
         Task<IEnumerable<MemeForApprovalDto>> GetMemes();
         Task<Memes> GetMemeById(int id);
         void RemoveMeme(Memes meme);
    }
}