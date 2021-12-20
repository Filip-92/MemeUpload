using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Extensions.Configuration;
using System.Web;
using EmailService;
using Message = EmailService.Message;
using API.Extensions;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _config;
        public AccountController(
            UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager, 
            ITokenService tokenService, 
            IMapper mapper,
            IConfiguration config,
            IUnitOfWork unitOfWork,
            IEmailSender emailSender
            )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
            _config = config;
            _unitOfWork = unitOfWork;
            _emailSender = emailSender;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

            if (await EmailExists(registerDto.Email)) return BadRequest("Email is taken");

            var user = _mapper.Map<AppUser>(registerDto);

            user.UserName = registerDto.Username.ToLower();

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                Email = user.Email,
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                Gender = user.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .Include(p => p.Photos)
                // .Include(p => p.Memes) // moze zepsuc
                .SingleOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

            if (user == null) return Unauthorized("Invalid email");

            var result = await _signInManager
                .CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized("Wrong Password");

            return new UserDto
            {
                Email = user.Email,
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                // MemeUrl = user.Memes.FirstOrDefault(x => x.IsApproved)?.Url, // moze zepsuc
                Gender = user.Gender
            };
        }

        [HttpPut]
        public async Task<ActionResult<UserDto>> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _signInManager
                .CheckPasswordSignInAsync(user, changePasswordDto.OldPassword, false);

            if (!result.Succeeded) return Unauthorized("Wrong Password");
            
            _mapper.Map(changePasswordDto, user);

            _unitOfWork.UserRepository.Update(user);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPost("forgotpassword")]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordDto forgotPassword)
        {
            var user = await _userManager.Users
                        .IgnoreQueryFilters()
                        .Where(e => e.Email.ToLower() == forgotPassword.Email.ToLower())
                        .FirstOrDefaultAsync();

            if (user == null) return Unauthorized("Username not Found");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var uriBuilder = new UriBuilder(_config["returnPaths:PasswordChange"]);
            var query = HttpUtility.ParseQueryString(uriBuilder.Query);
            query["token"] = token;
            query["userid"] = user.Id.ToString();
            uriBuilder.Query = query.ToString();
            var changePasswordLink = uriBuilder.ToString();

            var message = new Message(new string[] { user.Email }, "Change Password link", changePasswordLink, null);
            await _emailSender.SendEmailAsync(message);

            return Ok();
        }

        [HttpPost("resetpassword")]
        public async Task<ActionResult> ResetPassword(ResetPasswordDto resetPassword)
        {
            var user = await _userManager.FindByIdAsync(resetPassword.UserId);
            if (user == null) return Unauthorized("Username not Found");

            var result = await _userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.Password);
            if (result.Succeeded) return Ok();

            return BadRequest("Unable to reset password");
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

        private async Task<bool> EmailExists(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email);
        }
    }
} 