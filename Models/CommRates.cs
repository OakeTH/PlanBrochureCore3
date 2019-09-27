using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using oak.Data;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace oak.Models
{
    [Table("PB_CommRates")]
    public class CommRates : CommRatesFn
    {
        [Key]
        [IgnoreDataMember]
        public int ID { get; set; }
        [JsonProperty(PropertyName = "รหัสแบบประกันภัย")]
        public string PlanCodeExcludeYear { get; set; }
        [JsonProperty(PropertyName = "ระยะชำระเบี้ย(ปี)")]
        public string TotalYear { get; set; }
        [JsonProperty(PropertyName = "ทุนประกันภัย(บาท)")]
        public string SumAssured { get; set; }
        [JsonProperty(PropertyName = "อายุผู้เอาประกัน")]
        public string EntryAge { get; set; }
        public string Year01 { get; set; }
        public string Year02 { get; set; }
        public string Year03 { get; set; }
        public string Year04 { get; set; }
        public string Year05 { get; set; }
        public string Year06 { get; set; }
        public string Year07 { get; set; }
        public string Year08 { get; set; }
        public string Year09 { get; set; }
        public string Year10 { get; set; }
        [JsonProperty(PropertyName = "Year11 + ")]
        public string Year11 { get; set; }
    }

    public class CommRatesFn
    {
        public async Task<List<CommRates>> GetByPlanCodeAsync(string Plancode, EntityContextWEB context)
        {
            if (Plancode.Length > 4)
                Plancode = Plancode.Substring((Plancode.Length - 4), 4);


           

            return await context.CommRates
                 .Where(c => c.PlanCodeExcludeYear.Contains(Plancode))
                 .ToListAsync();
        }
    }
}
