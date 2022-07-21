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
         Task<PagedList<MemeDto>> GetMemesMain(MemeParams memeParams);
         Task<PagedList<MemeDto>> SearchForMemes(MemeParams memeParams, string searchString, string type);
         Task<IEnumerable<MemeDto>> GetMemesList();
         Task<MemeDto> GetMemeAsync(int id);
         Task<MemeDto> GetMeme(int id);
         Task<PagedList<MemeDto>> GetMemesLast24H(MemeParams memeParams);
         Task<PagedList<MemeDto>> GetMemesLast24HMain(MemeParams memeParams);
         Task<PagedList<MemeDto>> GetMemesLast24HDivision(MemeParams memeParams, int division);
         Task<PagedList<MemeDto>> GetMemesLast48H(MemeParams memeParams);
         Task<PagedList<MemeDto>> GetMemesLast48HMain(MemeParams memeParams);
         Task<PagedList<MemeDto>> GetMemesLast48HDivision(MemeParams memeParams, int division);
         Task<PagedList<MemeDto>> GetMemberMemes(MemeParams memeParams, string username);
         Task<IEnumerable<MemeDto>> GetMemberMainMemes(string username);
         Task<Memes> GetMemeById(int id);
         void RemoveMeme(Memes meme);
         Task<IEnumerable<CommentDto>> GetComments(int id);
         Task<IEnumerable<CommentDto>> GetMemberComments(int id);
         Task<Comments> GetCommentById(int id);
         void RemoveComment(Comments comment);
         void Update(Comments comment);
         Task<IEnumerable<CommentResponseDto>> GetReplies(int id);
         Task<IEnumerable<CommentResponseDto>> GetMemeReplies(int id);
         Task<IEnumerable<CommentResponseDto>> GetMemberReplies(int id);
         Task<CommentResponses> GetReplyById(int id);
         void RemoveReply(CommentResponses reply);
         Task<IEnumerable<DivisionDto>> GetDivisions();
         Task<PagedList<MemeDto>> GetMemesByDivision(MemeParams memeParams, int divisionId);
         Task<DivisionDto> GetDivisionNameById(int id);
         Task<DivisionDto> GetDivisionIdByName(string name);
         Task<Division> GetDivisionById(int id);
         void RemoveDivision(Division division);
    }
}