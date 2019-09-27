using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using oak.Data;
using oak.Models;
using System;
using System.IO;
using System.Threading.Tasks;
namespace oak.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]/{action}")]
    public class PlanController : Controller
    {

        private readonly IDbServices dbServices;
        private readonly AppSettings appSettings;
        private readonly EntityContextFASTTRACK contextFt;
        private readonly EntityContextWEB contextWeb;
        public PlanController(IDbServices _dbServices, IOptions<AppSettings> _appSettings, EntityContextFASTTRACK _contextFt, EntityContextWEB _contextWeb)
        {
            dbServices = _dbServices;
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
                var x = await model.GetAsync(model, contextFt);

                return Ok(x);
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
        public async Task<IActionResult> DeleteDocs([FromQuery] int id)
        {
            try
            {
                await new PlanDocs().DeleteAsync(id, contextWeb);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetDocsNameByID([FromQuery] int id)
        {
            try
            {
                var docPath = appSettings.File.PB_PlanDocsInitialPath;
                var docsName = await new PlanDocs().GetDocsNameByIDAsync(id, contextWeb);
       
                docsName = "10HL1N_แฮปปี้ไลฟ์ชำระเบี้ย10ปี(@9010).PDF";

                var fullPath = Path.Combine(docPath, docsName);

                if (System.IO.File.Exists(fullPath))
                {
                    var filename = System.Net.WebUtility.UrlEncode(docsName);
                    Response.Headers.Add("Content-Disposition", $"inline; filename=" + filename);

                    var file = new FileStream(fullPath, FileMode.Open);
                    return new FileStreamResult(file, ContentTypes.pdf);
                }
                else
                    return NotFound();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        public IActionResult _PdfPreviewDisbleDownload([FromForm]int id)
        {
            ViewBag.ID = id.ToString();
            return View();
        }

    }
}