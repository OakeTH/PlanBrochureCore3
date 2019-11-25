using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using oak.Data;
using oak.Models;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
namespace oak.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]/{action}")]
    public class PlanController : Controller
    {
        private readonly AppSettings appSettings;
        private readonly EntityContextFASTTRACK contextFt;
        private readonly EntityContextWEB contextWeb;
        public PlanController(IOptions<AppSettings> _appSettings, EntityContextFASTTRACK _contextFt, EntityContextWEB _contextWeb)
        {
            appSettings = _appSettings.Value;
            contextFt = _contextFt;
            contextWeb = _contextWeb;
        }
        public IActionResult IndexPartail()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetPlans()
        {
            try
            {
                return Ok(await new AmqPlan().GetAsync(contextFt));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDocByID([FromQuery]PlanDocs model)
        {
            try
            {
                return Ok(await new PlanDocs().GetDocByIDAsync(model, contextWeb));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetCVRate([FromQuery]AmqCvRate model)
        {
            try
            {
                var result = await model.GetAsync(model, contextFt);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetCommRate([FromQuery] string PlanCode)
        {
            try
            {
                CommRates rates = new CommRates();
                AmqPlan plan = new AmqPlan();

                if (await plan.IsActivePlan(PlanCode, contextFt))
                    return Ok(await rates.GetByPlanCodeAsync(PlanCode, contextWeb));
                else
                    return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult DeleteDocs([FromQuery] string fileName)
        {
            try
            {
                fileName = fileName.Replace("@@_push_@@", "+");
                string initialPath = appSettings.File.PB_PlanDocsInitialPath;
                string fullPath = Path.Combine(initialPath, fileName);

                if (System.IO.File.Exists(fullPath))
                    System.IO.File.Delete(fullPath);


                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetFileNameByPlanCode([FromQuery] string plancode)
        {
            if (plancode.Count() == 6)
                plancode = plancode.Remove(0, 2);

            string initialPath = appSettings.File.PB_PlanDocsInitialPath;
            string[] extensions = { "pdf", "png", "jpeg" };

            var docFile = Directory
                .GetFiles(initialPath)
                .Where(f => f.IndexOf(plancode, StringComparison.OrdinalIgnoreCase) > 0 && extensions.Any(f.Contains) == true)
                .FirstOrDefault();

            if (docFile != null)
                docFile = Path.GetFileName(docFile);

            return Ok(new { docFile });
        }

        [HttpGet]
        public IActionResult DownloadDocByPlanCode([FromQuery] string filename)
        {
            try
            {
                filename = filename.Replace("@@_push_@@", "+");
                string initialPath = appSettings.File.PB_PlanDocsInitialPath;
                string fullPath = Path.Combine(initialPath, filename);
                string fileExtension = Path.GetExtension(filename);
                string contypeType;

                if (fileExtension == ".pdf")
                    contypeType = ContentTypes.pdf;
                else if (fileExtension == ".png")
                    contypeType = ContentTypes.png;
                else
                    contypeType = ContentTypes.jpeg;

                var file = new FileStream(fullPath, FileMode.Open);
                return new FileStreamResult(file, contypeType);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}