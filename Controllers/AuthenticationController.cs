//using AgentCompensation.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using oak.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static oak.Models.ServicesModels;

namespace oak.Controllers
{
    [Authorize]
    [ApiController]
    [Route("{action=Index}")]
    [Route("[controller]/{action=Index}")]
    public class AuthenticationController : Controller
    {
        private readonly IUserService userService;
        private readonly IDbServices dbServices;
        // private readonly ILog _log = LogManager.GetLogger(typeof(AuthenticationController));
        //private readonly AppSettings appSettings;
        //private readonly EntityContextFASTTRACK context;
        public AuthenticationController(IUserService _userService, IDbServices _dbServices)
        {
            userService = _userService;
            dbServices = _dbServices;
            //context = _context;
            //   appSettings = _appSettings.Value;
        }

        public IActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public IActionResult Login()
        {
            return View();
        }

        [AllowAnonymous]
        public async Task<IActionResult> LoginMember([FromForm]Users user, [FromForm] string externalUser)
        {
            try
            {
                if (!string.IsNullOrEmpty(externalUser))
                {
                    user.EmployeeCode = "620029";
                    user.Password = "620029";
                }

                if (user.EmployeeCode == null && user.RoleName == null)
                    return Unauthorized();

                user = await userService.Authenticate(
                      password: user.Password,
                      employeecode: user.EmployeeCode,
                      role: user.RoleName);

                List<P> parameters = new List<P> { new P { Key = "RoldName", Value = user.RoleName } };
                var menu = dbServices.SpCaller(name: "[dbo].[PB_GetMneuByRoldID]", parameters: parameters)?.Tables?[0];

                user.Menu = JsonConvert.SerializeObject(menu);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [GetCurrentUser]
        public IActionResult GetMenu()
        {
            var user = new Users
            {
                RoleName = Current.RoldName,
                EmployeeCode = Current.UserID
            };

            List<P> parameters = new List<P> { new P { Key = "RoldName", Value = Current.RoldName } };
            var menu = dbServices.SpCaller(name: "[dbo].[PB_GetMneuByRoldID]", parameters: parameters)?.Tables?[0];

            return Ok(user);
        }

    }
}