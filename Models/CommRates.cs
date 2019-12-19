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
    [Table("PB_CommRates")]
    public class CommRates : CommRatesFn
    {
        [Key]
        public int ID { get; set; }
        public string PlanCodeExcludeYear { get; set; }

        public string TotalYear { get; set; }

        public string SumAssured { get; set; }

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

        public string Year11 { get; set; }

        [IgnoreDataMember]
        public string AddBy { get; set; }
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

        public async Task<List<CommRates>> GetAsync(EntityContextWEB context)
        {
            return await context.CommRates.ToListAsync();
        }

        public async Task UpdateAsync(CommRates commRate, EntityContextWEB context)
        {
            context.Entry(commRate).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(CommRates commRate, EntityContextWEB context)
        {
            context.CommRates.Remove(commRate);
            await context.SaveChangesAsync();
        }

    }
}
