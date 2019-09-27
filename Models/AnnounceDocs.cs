//using AgentCompensation.Models;
//using AgetnCompensation.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using oak.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using Z.EntityFramework.Plus;

namespace oak.Models
{
    [Table("PB_AnnounceMathDocs")]
    public class AnnounceMathDocs : AnnounceMathDocsFn
    {
        [Key]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "ชื่อไฟล์")]
        public string DocsName { get; set; }


        [JsonProperty(PropertyName = "ประเภทไฟล์")]
        public string DocsGroupName { get; set; }

        [IgnoreDataMember]
        public string LastModifyBy { get; set; }


        [IgnoreDataMember]
        [Column(TypeName = "smalldatetime")]
        public DateTime LastModifyDate { get; set; } = DateTime.Now;

        [JsonProperty(PropertyName = "อัพเดท")]
        [ReadOnly(true)]
        public string LastModifyDateFm => LastModifyDate.ToString("dd/MM/yyyy");

        [IgnoreDataMember]
        [NotMapped]
        public IFormFile File { get; set; }
    }

    public class AnnounceMathDocsFn
    {

        public async Task<List<AnnounceMathDocs>> GetAnnounceDocsAsync(EntityContextWEB context)
        {
            return await context.AnnounceDocs.ToListAsync();
        }

        public async Task<AnnounceMathDocs> UploadFileAsync(AnnounceMathDocs announce, string initialPath, EntityContextWEB context)
        {

            string path = Path.Combine(initialPath, announce.File.FileName);
            //<--- Create Directory if it is not exists.
            if (!Directory.Exists(initialPath)) Directory.CreateDirectory(initialPath);
            //<--- Delete current file if the new file have same name as current file.
            if (File.Exists(path)) File.Delete(path);

            //<--- Save file.
            using (FileStream stream = new FileStream(path, FileMode.Create))
            {
                await announce.File.CopyToAsync(stream);
            }
            //<--- Insert Data.
            await InsertAsync(announce, context);

            return announce;
        }

        public async Task InsertAsync(AnnounceMathDocs model, EntityContextWEB context)
        {
            var isexists = await model.IsExistsDocsNameAsync(model.File.FileName, context);
            if (isexists)
            {
                await context.AnnounceDocs
                     .Where(t => t.DocsName == model.DocsName)
                     .UpdateAsync(t => new AnnounceMathDocs { LastModifyDate = DateTime.Now, LastModifyBy = Current.UserID });
            }
            else
            {
                context.AnnounceDocs.Add(model);
                await context.SaveChangesAsync();
            }

        }

        public async Task DeleteAsync(int id, EntityContextWEB context)
        {
            context.AnnounceDocs.Remove(context.AnnounceDocs.Find(id));
            await context.SaveChangesAsync();
        }


        public async Task<bool> IsExistsDocsNameAsync(string docsName, EntityContextWEB context)
        {
            return await context.AnnounceDocs.AnyAsync(c => c.DocsName == docsName);
        }

        public FileStream DownLoadAnnounceMathDocsByDocsNameAsync(string DocsName, string initialPath)
        {
            var downloadpath = Path.Combine(initialPath, DocsName);

            if (File.Exists(downloadpath))
                return new FileStream(downloadpath, FileMode.Open);
            else
                return null;
        }

    }

}
