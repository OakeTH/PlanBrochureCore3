//using AgentCompensation.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public AuthenticationController(IUserService _userService, IDbServices _dbServices)
        {
            userService = _userService;
            dbServices = _dbServices;
        }

        public IActionResult Index() => View();

        [AllowAnonymous]
        public IActionResult Login() => View();

        [AllowAnonymous]
        public async Task<IActionResult> LoginMember([FromForm]Users user)
        {
            try
            {
                if (user.RoleName == null)
                    return Unauthorized();

                user = await userService.Authenticate(
                      password: user.Password,
                      employeecode: user.EmployeeCode,
                      role: user.RoleName);

                List<P> parameters = new List<P> { new P { Key = "RoldName", Value = user.RoleName } };
                user.Menu = dbServices.SpCaller(name: "[dbo].[PB_GetMneuByRoldID]", parameters: parameters)?.Tables?[0];


                //user.Menu = dbServices.SpCallerV2(opt =>
                //  {
                //      opt.Name = "[dbo].[PB_GetMneuByRoldID]";
                //      opt.Parameters = parameters;
                //  }).ToJsonString();


                return Ok(user);
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
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
            user.Menu = dbServices.SpCaller(name: "[dbo].[PB_GetMneuByRoldID]", parameters: parameters)?.Tables?[0];
            return Ok(user);
        }

        //public IActionResult AAAA() {
        //    List<P> parameters = new List<P> { new P { Key = "RoldName", Value = Current.RoldName } };
        //    //var x = dbServices.SpCaller(name: "[dbo].[PB_GetMneuByRoldID222]", parameters: parameters)?.Tables?[0];
        //    var x = dbServices.SpCallerV2(opt =>
        //    {
        //        opt.Name = "[dbo].[PB_GetMneuByRoldID333]";
        //        opt.Parameters = parameters;
        //    }).ToJsonString();

        //    return Ok(x);

        //}

    }
}