using System;
using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;
namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => 
                    src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => 
                    src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.MemeUrl, opt => opt.MapFrom(src => 
                    src.Memes.FirstOrDefault(x => x.IsApproved).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<Memes, MemeDto>();
            CreateMap<Comments, CommentDto>();
            CreateMap<CommentResponses, CommentResponseDto>();
            CreateMap<ContactForm, ContactFormDto>();
            CreateMap<Division, DivisionDto>();
            CreateMap<Notifications, NotificationDto>();
            CreateMap<CommentLike, CommentLikeDto>();
            CreateMap<ReplyLike, ReplyLikeDto>();
            CreateMap<Favourite, FavouriteDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<CommentUpdateDto, AppUser>();
            CreateMap<DivisionUpdateDto, MemeDto>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderPhotoUrl, opt => opt.MapFrom(src => 
                    src.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.RecipientPhotoUrl, opt => opt.MapFrom(src => 
                    src.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<MessageDto, Message>();
        }
    }
} 