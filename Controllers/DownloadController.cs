using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using oak.Models;
using System;
using System.Data;
using System.IO;
using static oak.Models.ServicesModels;

namespace oak.Controllers
{
    [Route("[controller]/[action]")]
    public class DownloadController : Controller
    {
        //readonly string conn = SQLDatabase.ConnectionString;

        //[HttpGet]
        //public async Task<IActionResult> Downloadfilefn(string source, string downloadfrom, string containername)
        //{
        //    if (source != null && source != "" && source != "undefined")
        //    {
        //        var _source = SharedServices.JsonToSPparams(source);
        //        DataTable dt = (DataTable)SharedServices.Query(conn, true, _source);

        //        if (dt.Rows.Count > 0 && dt.Columns.Contains("downloadfrom"))
        //            downloadfrom = dt.Rows[0]["downloadfrom"].ToString();
        //    }

        //    try
        //    {
        //        if (UploadModel.UploadProfile == "AzureStorage")
        //        {
        //            if (containername == null || containername == "")
        //                containername = AzureStorageAccountModel.DefaultContainer;

        //            MemoryStream stream = await DownloadModel.DownloadFromAzureAsync(downloadfrom, containername);
        //            return File(stream, "application/octet-stream", Path.GetFileName(downloadfrom));
        //        }
        //        else if (UploadModel.UploadProfile == "RemoteStorage")
        //        {
        //            var host = Request.Host.Host;

        //            downloadfrom = Path.Combine(containername , downloadfrom);
        //            FileStream filestream = DownloadModel.DownloadFromRemote(downloadfrom, host);
        //            return File(filestream, "application/octet-stream", Path.GetFileName(downloadfrom));
        //        }
        //        return BadRequest();
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { error = ex.Message });
        //    }
        //}

        [HttpGet]
        public IActionResult DownloadExcelFromDBfn(DownloadExcelModel model)
        {
            try
            {
                DataSet ds = null;
                if (model.DataSouece != null) ds = model.DataSouece;
                //  else ds = SharedServices.CallSP(conn, SharedServices.JsonToSPparams(model.Source_SP));

                if (ds.Tables.Count == 0)
                {
                    ds.Tables.Add();
                    ds.Tables[0].Columns.Add("-- ไม่พบข้อมูล-- ");
                }

                MemoryStream stream = SharedServices.ExcelStreaming(
                    source: ds,
                    SheetName: model.Excelsheetsname,
                    Template: model.Template,
                    LastRowIsSummary: model.LastRowIsSummary);
                return File(stream, "application/vnd.ms-excel", model.ExcelName + ".xlsx");
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public IActionResult DownloadExcelFromJsonfn(string fields, string data)
        {
            try
            {
                DataSet DsData = new DataSet();
                DataTable DtData = SharedServices.JsonToDT(data);
                JArray ArryFields = JArray.Parse(fields);

                for (int i = 0; i < ArryFields.Count; i++)
                {
                    DtData.Columns[i].ColumnName = ArryFields[i].ToString();
                }

                for (int i = 0; i < ArryFields.Count; i++)
                {
                    var name = ArryFields[i].ToString();
                    if (name.IndexOf(",hide") > -1)
                        DtData.Columns.Remove(name);
                }

                DsData.Tables.Add(table: DtData);
                DownloadExcelModel excelModel = new DownloadExcelModel
                {
                    DataSouece = DsData
                };
                return DownloadExcelFromDBfn(excelModel);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
