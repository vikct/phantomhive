namespace Phantomhive.Application.Auth.DTOs
{
    public class SsoLoginRequest
    {
        public string IdToken { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty;
    }
}
