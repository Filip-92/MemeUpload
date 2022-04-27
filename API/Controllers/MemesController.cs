using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MemesController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IMemeService _memeService;
        private readonly IUnitOfWork _unitOfWork;
        public MemesController(IUnitOfWork unitOfWork, IMapper mapper,
            IPhotoService photoService, IMemeService memeService)
        {
            _unitOfWork = unitOfWork;
            _photoService = photoService;
            _memeService = memeService;
            _mapper = mapper;
        }

        [HttpGet("memes-to-display")]
        [AllowAnonymous]
        public async Task<ActionResult<IEntityTypeConfiguration<MemeDto>>> GetMemes([FromQuery] MemeParams memeParams)
        {
            var memes = await _unitOfWork.MemeRepository.GetMemes(memeParams);

            Response.AddPaginationHeader(memes.CurrentPage, memes.PageSize, 
                memes.TotalCount, memes.TotalPages);

            return Ok(memes);
        }
    }
}