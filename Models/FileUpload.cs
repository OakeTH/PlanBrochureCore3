using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace oak.Models
{
    public class FileUpload
    {
        public string FileName { get; set; }
        public string UploadBy { get; set; }

        [Required(ErrorMessage = "ไม่พบไฟล์")]
        public IFormFile File { get; set; }
        ////<-- For Excel only
        public string ExcelSheetName { get; set; }
        public bool CastToString { get; set; }
    }
}
