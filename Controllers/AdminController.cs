using Microsoft.AspNetCore.Mvc;
using oak.Data;
using oak.Models;
using System;
using System.Threading.Tasks;

namespace oak.Controllers
{
    [Route("[controller]/[action]")]
    public class AdminController : Controller
    {
        private readonly EntityContextWEB contextWeb;
        public IActionResult IndexPartail() => View();

        public AdminController(EntityContextWEB contextWeb) => this.contextWeb = contextWeb;

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                return Ok(await new Users().GetsAsync(contextWeb));
            }
            catch (Exception ex)
            {
                // throw ex.Message;dd
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [GetCurrentUser]
        public async Task<IActionResult> InsertUsers([FromForm]Users users)
        {
            try
            {
                return Ok(await new Users().InsertAsync(users, contextWeb));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [GetCurrentUser]
        public async Task<IActionResult> UpdateUsers([FromForm]Users users)
        {
            try
            {
                await new Users().UpdateAsync(users, contextWeb);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [GetCurrentUser]
        public async Task<IActionResult> DeleteUsers([FromForm]Users users)
        {
            try
            {
                await new Users().DeleteAsync(users, contextWeb);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}