using System.Threading.Tasks;
using EmailService;

namespace API.Data
{
    public class ForgotPasswordRepository : IEmailSender
    {
        public void SendEmail(Message message)
        {
            throw new System.NotImplementedException();
        }

        public Task SendEmailAsync(Message message)
        {
            throw new System.NotImplementedException();
        }
    }
}