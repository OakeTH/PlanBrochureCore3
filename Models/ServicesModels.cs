using System.IO;
using System.Net;
using System.Net.Http;

namespace oak.Models
{
    public class ServicesModels
    {
        public class P
        {
            public string Key { get; set; }
            public object Value { get; set; }
        }

        public class AjaxReponse
        {
            public string json;
            public string html;
            public MemoryStream memoryStream;
            public string errorMessage = null;
            public HttpStatusCode? statusCode = null;
        }

        public class AjaxParameter
        {
            public string url;
            public HttpMethod method = HttpMethod.Get;
            public string parametors = "";
            public WebHeaderCollection headers = null;
            public string ContentType = null;
        }

    }
}
