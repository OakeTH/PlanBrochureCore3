using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using oak.Data;
using oak.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace oak
{
    public interface IUserService
    {
        Task<Users> Authenticate(string password, string employeecode, string role);
    }

    public class UserService : IUserService
    {
        private readonly AppSettings appSettings;
        private readonly EntityContextWEB contextWeb;

        public UserService(IOptions<AppSettings> _appSettings, EntityContextWEB _contextWeb)
        {
            appSettings = _appSettings.Value;
            contextWeb = _contextWeb;
        }

        public async Task<Users> Authenticate(string password, string employeecode, string rolename)
        {
            Users users = await new Users().LoginAsync(employeecode, password, contextWeb);

            if (users == null)
                users = new Users() { EmployeeCode = employeecode, RoleName = rolename };

            //else if (!string.IsNullOrEmpty(employeecode) && !string.IsNullOrEmpty(rolename))
            //    users = new Users() { EmployeeCode = employeecode, RoleName = rolename };
            //if (users == null) return null;

            // <--- authentication successful so generate jwt token
            int currentHour = DateTime.Today.Hour;
            int remainHourtoMidNight = 24 - currentHour;
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = Encoding.ASCII.GetBytes(appSettings.JWT.SecretKey);
            var claimsIdentity = new ClaimsIdentity(new Claim[] {
                  new Claim("u", users.EmployeeCode),
                  new Claim("r", users.RoleName)
            });
            var tokenDescriptor = new SecurityTokenDescriptor // .SecurityTokenDescriptor
            {
                Subject = claimsIdentity,
                Expires = DateTime.UtcNow.AddDays(appSettings.JWT.Expires).AddHours(remainHourtoMidNight),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            users.Token = tokenHandler.WriteToken(token);
            return users;
        }
    }
}
