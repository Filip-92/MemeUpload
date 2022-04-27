using System.Threading.Tasks;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace API.Interfaces
{
    public interface IMemeService
    {
        Task<ImageUploadResult> AddMemeAsync(IFormFile file);
        Task<VideoUploadResult> AddMemeVidAsync(IFormFile file);
        Task<DeletionResult> DeleteMemeAsync(string publicId);
    }
} 