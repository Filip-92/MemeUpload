using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMemeRepository
    {
         Task<PagedList<MemeForApprovalDto>> GetUnapprovedMemes(MemeParams memeParams);
         Task<PagedList<MemeDto>> GetMemes(MemeParams memeParams);
         Task<MemeDto> GetMemeAsync(int id);
         Task<IEnumerable<MemeDto>> GetMeme(int id);
         Task<PagedList<MemeDto>> GetMemesLast24H(MemeParams memeParams);
         Task<IEnumerable<MemeDto>> GetMemberMemes(int userId);
         Task<Memes> GetMemeById(int id);
         void RemoveMeme(Memes meme);
    }
}