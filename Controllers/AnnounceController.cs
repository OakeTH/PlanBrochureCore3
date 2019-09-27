//using AgetnCompensation.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using oak.Data;
using oak.Models;
using System;
using System.Threading.Tasks;

namespace oak.Controllers
{
    public class AnnounceController : Controller
    {
        private readonly EntityContextWEB contextWeb;
        private readonly AppSettings appSettings;
        public AnnounceController(EntityContextWEB _contextWeb, IOptions<AppSettings> _appSettings)
        {
            contextWeb = _contextWeb;
            appSettings = _appSettings.Value;
        }

        public IActionResult IndexPartail()
        {
            return View();
        }

        public async Task<IActionResult> GetAnnounceMathDocs()
        {
            return Ok(await new AnnounceMathDocs().GetAnnounceDocsAsync(contextWeb));
        }

        public IActionResult DownLoadAnnounceMathDocsByDocsName(string DocsName)
        {
            var initilPath = appSettings.File.PB_AnnounceDocsInitialPath;
            var filestram = new AnnounceMathDocs().DownLoadAnnounceMathDocsByDocsNameAsync(DocsName, initilPath);

            if (filestram != null)
                return File(filestram, ContentTypes.octet, DocsName);
            else
                return NotFound();
        }

        [HttpGet]
        public async Task<IActionResult> DeleteAnnounceMathDocs([FromQuery] int id)
        {
            try
            {
                await new AnnounceMathDocs().DeleteAsync(id, contextWeb);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}