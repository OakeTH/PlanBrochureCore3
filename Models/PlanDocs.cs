//using AgentCompensation.Models;
//using AgetnCompensation.Models;
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
    [Table("PB_PlanDocs")]
    public class PlanDocs : PlanDocsFn
    {
        [Key]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "ชื่อแผนประกัน")]
        [Required(ErrorMessage = "ยังไม่ได้ระบุ PlanCode")]
        public string PlanCode { get; set; }

        [JsonProperty(PropertyName = "ชื่อไฟล์", Order = -99)]
        public string DocsName { get; set; }

        [IgnoreDataMember]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime LastModifyDate { get; set; }

        [IgnoreDataMember]
        public string AddBy { get; set; }

        [IgnoreDataMember]
        public string LastModifyBy { get; set; }

        [JsonProperty(PropertyName = "อัพเดท")]
        [ReadOnly(true)]
        public string LastModifyDateFm => LastModifyDate.ToString("dd/MM/yyyy");

        [ReadOnly(true)]
        public string Errors;
    }
    public class PlanDocsFn
    {
        public async Task<List<PlanDocs>> GetDocByIDAsync(PlanDocs model, EntityContextWEB context)
        {
            if (model.PlanCode == "All")
                return await context.PlanDocs.ToListAsync();
            else
                return await context.PlanDocs
                      .Where(c => c.PlanCode == model.PlanCode)
                      .Select(c => new PlanDocs { ID = c.ID })
                      .ToListAsync();
        }

        public async Task<string> GetDocsNameByIDAsync(int id, EntityContextWEB context)
        {
            return await context.PlanDocs
                  .Where(c => c.ID == id)
                  .Select(c => c.DocsName)
                  .FirstOrDefaultAsync();
        }

        //public async Task<bool> IsExistsPlanCodeAsync(string docsName, EntityContextWEB context)
        //{
        //    return await context.PlanDocs.AnyAsync(c => c.PlanCode.Contains(docsName));
        //}
        public async Task<bool> IsExistsDocsNameAsync(string docsName, EntityContextWEB context)
        {
            return await context.PlanDocs.AnyAsync(c => c.DocsName == docsName);
        }
        public async Task<PlanDocs> UploadFileAsync(FileUpload model, string initialPath, EntityContextWEB context)
        {
            PlanDocs planDocs = new PlanDocs
            {
                PlanCode = null, // model.File.FileName.Split("_")[0],
                //DocsName = model.File.FileName.Substring(model.File.FileName.IndexOf("_") + 1),
                DocsName = model.File.FileName,
                AddBy = null,// Current.UserID,
                LastModifyBy = null //Current.UserID
            };


            //<-- check plancode in filename is exists in table: PB_PlanDocs.
            //bool IsExistsPlanCode = await new PlanDocs().IsExistsPlanCodeAsync(docsName: planDocs.DocsName, context: context);
            //if (!IsExistsPlanCode)
            //{
            //    planDocs.Errors = "แผนประกัน " + planDocs.PlanCode + " ไม่มีในระบบ";
            //    return planDocs;
            //}

            string path = Path.Combine(initialPath, model.File.FileName);
            //<--- Create Directory if it is not exists.
            if (!Directory.Exists(initialPath)) Directory.CreateDirectory(initialPath);
            //<--- Delete current file if the new file have same name as current file.
            if (File.Exists(path)) File.Delete(path);

            //<--- Save file.
            using (FileStream stream = new FileStream(path, FileMode.Create))
            {
                await model.File.CopyToAsync(stream);
            }
            //<--- Insert Data.
            //await InsertAsync(planDocs, context);

            return planDocs;
        }

        //public async Task InsertAsync(PlanDocs model, EntityContextWEB context)
        //{
        //    var isexists = await model.IsExistsDocsNameAsync(model.DocsName, context);
        //    if (!isexists)
        //    {
        //        context.PlanDocs.Add(model);
        //        await context.SaveChangesAsync();
        //    }
        //    else
        //    {
        //        await context.PlanDocs
        //            .Where(t => t.DocsName == model.DocsName)
        //            .UpdateAsync(t => new PlanDocs { LastModifyDate = DateTime.Now, LastModifyBy = Current.UserID });
        //    }

        //}

        public async Task DeleteAsync(int id, EntityContextWEB context)
        {


            context.PlanDocs.Remove(context.PlanDocs.Find(id));
            await context.SaveChangesAsync();
        }
    }
}
