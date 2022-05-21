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
         Task<PagedList<MemeDto>> SearchForMemes(MemeParams memeParams, string searchString);
         Task<IEnumerable<MemeDto>> GetMemesList();
         Task<MemeDto> GetMemeAsync(int id);
         Task<MemeDto> GetMeme(int id);
         Task<PagedList<MemeDto>> GetMemesLast24H(MemeParams memeParams);
         Task<PagedList<MemeDto>> GetMemberMemes(MemeParams memeParams, string username);
         Task<Memes> GetMemeById(int id);
         void RemoveMeme(Memes meme);
         Task<IEnumerable<CommentDto>> GetComments(int id);
    }
}