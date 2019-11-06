using Microsoft.EntityFrameworkCore;
using oak.Data;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace oak.Models
{

    public class AmqCvRate : AmqCvRateFn
    {
        [Key]
        [IgnoreDataMember]
        [Column("id")]
        public int? Id { get; set; }
        [IgnoreDataMember]
        [Required(ErrorMessage = "ยังไม่ได้ระบุ PlanCode")]
        [Column("prdplan")]
        public string Prdplan { get; set; }

        [Column("insuresex")]
        public string Insuresex { get; set; }
        [Required(ErrorMessage = "ยังไม่ได้ระบุ อายุ")]
        [IgnoreDataMember]
        [Column("insureage")]
        public int? Insureage { get; set; }
        [Column("endyear")]
        public int? Endyear { get; set; }
        [Column("cvrate")]
        public decimal Cvrate { get; set; }
        [Column("rpurate", TypeName = "bigint")]
        public int? Rpurate { get; set; }
        [Column("etirate")]
        public int? Etirate { get; set; }
        [Column("etiyear")]
        public int? Etiyear { get; set; }
        [Column("etiday")]
        public int? Etiday { get; set; }
        [Column("rpurefund")]
        public decimal Rpurefund { get; set; }
        [Column("etirefund")]
        public decimal Etirefund { get; set; }
    }
    public class AmqCvRateFn
    {
        public async Task<List<AmqCvRate>> GetAsync(AmqCvRate model, EntityContextFASTTRACK context)
        {
            return await context.AmqCvRate
                  .Where(c => c.Prdplan == model.Prdplan && c.Insureage == model.Insureage)
                  .OrderBy(c => c.Endyear)
                  .ToListAsync();

        }
    }
}
