using System.Collections.Generic;
using static oak.Models.ServicesModels;

namespace oak
{
    public class SpCallerModel
    {
        public string Name { get; set; }
        public List<P> Parameters { get; set; } = null;
        public IDictionary<object, object> RequestItem { get; set; } = null;
        public string Connectionstring { get; set; } = null;
    }


    public static class ContentTypes
    {
        public const string json = "application/json";
        public const string octet = "application/octet-stream";
        public const string javascript = "application/javascript";
        public const string ogg = "application/ogg";
        public const string pdf = "application/pdf";
        public const string xhtml = "application/xhtml+xml";
        public const string xml = "application/xml";
        public const string zip = "application/zip";
        public const string form = "application/x-www-form-urlencoded";
        public const string fromUTF8 = "application/x-www-form-urlencoded; charset=UTF-8";
        public const string jpeg = "image/jpeg";
        public const string png = "image/png";
        public const string excel2003lower = "application/vnd.ms-excel";
        public const string excel = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";


    }

}
