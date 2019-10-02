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


    public class JwtServices
    {
        public string Create(Action<JWTModel> action)
        {
            JWTModel model = new JWTModel();
            action.Invoke(obj: model);

            int currentHour = DateTime.Today.Hour;
            int remainHourtoMidNight = model.ExpiresAtMidnight ? (24 - currentHour) : 0;

            byte[] secretKey = Encoding.ASCII.GetBytes(model.SecretKey);
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(model.Claims);
            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claimsIdentity,
                Expires = DateTime.UtcNow.AddDays(model.ExpiresDate).AddHours(remainHourtoMidNight),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), model.SecurityAlgorithms)
            };

            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
