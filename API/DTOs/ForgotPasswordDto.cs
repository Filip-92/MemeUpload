using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        // [Required]
        // public string ClientURI { get; set; }
    }
}