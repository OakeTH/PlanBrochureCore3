using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using oak.Data;
using oak.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static oak.Models.ServicesModels;

namespace oak.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]/{action}")]
    public class UploadDataController : Controller
    {
        private readonly IDbServices dbServices;
        private readonly AppSettings appSettings;
        private readonly EntityContextWEB contextWeb;
        public UploadDataController(IDbServices _dbServices, IOptions<AppSettings> _appSettings, EntityContextWEB _contextWeb)
        {
            dbServices = _dbServices;
            appSettings = _appSettings.Value;
            contextWeb = _contextWeb;
        }

        public IActionResult IndexPartail() => View();

        [GetCurrentUser]
        public async Task<IActionResult> UploadCommRate([FromForm]FileUpload model)
        {
            if (model.File.Length == 0)
                return BadRequest();

            var dataSet = await SharedServices.ExcelToDataSet(model);
            List<P> parameters = new List<P>
            {
                new P { Key = "Data_PB_CommRatesImport", Value = SharedServices.StringAllColumns(dataSet.Tables[0]) },
                new P { Key = "AddBy", Value = Current.UserID }
            };

            var ds = dbServices.SpCaller(name: "dbo.PB_CommRatesImport", parameters: parameters);

            return Ok(ds.Tables[0]);
        }

        [GetCurrentUser]
        public async Task<IActionResult> UploadPlanDocs([FromForm]FileUpload model)
        {
            string initialPath = appSettings.File.PB_PlanDocsInitialPath;
            try
            {
                PlanDocs planDocs = await new PlanDocs().UploadFileAsync(model: model, initialPath: initialPath);

                return Ok(planDocs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult DownloadCommRate([FromQuery]bool IsTemplate)
        {
            DownloadExcelModel model = new DownloadExcelModel();
            List<P> parameters = new List<P>
            {
                new P { Key = "IsTemplate", Value = IsTemplate }
            };

            DataSet source = dbServices.SpCaller(name: "dbo.PB_CommRatesDownload", parameters: parameters);

            model.DataSouece = source;
            model.ExcelName = IsTemplate ? "CommRate Template" : "CommRate Data " + DateTime.Today.ToString("dd-MM-yyyy"); ;

            MemoryStream stream = SharedServices.ExcelStreaming(
                   source: source,
                   SheetName: model.Excelsheetsname,
                   Template: model.Template,
                   LastRowIsSummary: model.LastRowIsSummary
               );

            return File(stream, ContentTypes.excel, model.ExcelName + ".xlsx");
        }

        [HttpGet]
        public IActionResult GetAllPlanDocFilesName()
        {
            string initialPath = appSettings.File.PB_PlanDocsInitialPath;

            DirectoryInfo info = new DirectoryInfo(initialPath);
            var filesName = info.GetFiles()
                 .Select(p => new { p.Name, p.Extension, CreationTime = p.CreationTime.ToString("dd/MM/yyyy") })
                 .OrderBy(p => p.Name).ToArray();


            return Ok(filesName);
        }

        [GetCurrentUser]
        public async Task<IActionResult> UploadAnnounceMathDocs([FromForm]AnnounceMathDocs announce)
        {
            string initialPath = appSettings.File.PB_AnnounceDocsInitialPath;
            try
            {
                await announce.UploadFileAsync(announce: announce, initialPath: initialPath, context: contextWeb);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}