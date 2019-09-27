using System;
using System.Data;

namespace oak.Models
{
    public class DownloadModel
    {
        public static string ConnectionString { get; set; }
        public static string InitialPath { get; set; }
        public static string PublicAccess { get; set; }
        //public static async Task<MemoryStream> DownloadFromAzureAsync(string target, string containername)
        //{
        //    CloudBlobContainer Container = await AzureStorageAccountModel.SignInAsync(
        //                    AzureStorageAccountModel.ConnectionString,
        //                    containername,// AzureStorageAccountModel.DefaultContainer,
        //                    AzureStorageAccountModel.DefaultPublicAccess);

        //    return await AzureStorageAccountModel.DownloadAsync(Container, target);
        //}
        //public static FileStream DownloadFromRemote(string target,string Host)
        //{
        //    var downloadpath = "";
        //    if (RemoteStorageModel.Server.Substring(0, 8) != "https://")
        //    {
        //        if (Host.ToLower() == "localhost" )
        //            downloadpath = Path.Combine(RemoteStorageModel.Server_LocalTesting, target);
        //        else
        //            downloadpath = Path.Combine(RemoteStorageModel.Server, target);

        //        downloadpath = downloadpath.Replace("/", @"\");
        //        if (!downloadpath.StartsWith(@"\"))
        //            downloadpath = @"\\" + downloadpath;
        //    }
        //    else
        //        downloadpath = Path.Combine(RemoteStorageModel.Server, target);

        //    if (File.Exists(downloadpath)) return new FileStream(downloadpath, FileMode.Open);
        //    else return null;
        //}

    }
    public class DownloadExcelModel
    {
        public string Source_SP { get; set; }//<-- Getting source by call stored procedure
        public DataSet DataSouece { get; set; }//<-- Getting source by existing dataset
        public string ExcelName { get; set; } = "Excel " + DateTime.Today.ToString("dd-MM-yyyy");
        public string Excelsheetsname { get; set; } = "";
        public string Template { get; set; }
        public string LastRowIsSummary { get; set; } = "";
    }


}
