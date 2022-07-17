using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MemeLikesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public MemeLikesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
} 