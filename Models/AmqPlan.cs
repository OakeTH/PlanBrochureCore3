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
    public class AmqPlan : AmqPlanFn
    {
        [Key]
        [IgnoreDataMember]
        [Column(TypeName = "bigint")]
        public int PlanId { get; set; }
        [IgnoreDataMember]
        [Column(TypeName = "bigint")]
        public int ProdId { get; set; }
        [Column(TypeName = "bigint")]
        [IgnoreDataMember]
        public int ProdGrpId { get; set; }
        public string PlanCode { get; set; }
        public string PlanShortNameTh { get; set; }
        [IgnoreDataMember]
        public string IsActive { get; set; }
        [IgnoreDataMember]
        public string ProdcIsActive { get; set; }
        public string ProdGrpDescTh { get; set; }
    }
    public class AmqPlanFn
    {
        private const string MsgNotSale = " <label class='error_msg'>(ไม่ขายแล้ว)</label>";

        public async Task<List<AmqPlan>> GetAsync(EntityContextFASTTRACK context)
        {
            return await context.AmqPlan
                .Join(context.AmqProduct, plan => plan.ProdId, product => product.ProdId, (plan, product) => new { plan, product })
                .Join(context.AmqProductGroup, B => B.product.ProdGrpId, planGr => planGr.ProdGrpId,
                (B, planGr) => new AmqPlan
                {
                    PlanCode = B.plan.PlanCode,
                    PlanShortNameTh = (B.plan.IsActive == "I" ? MsgNotSale : "") + B.plan.PlanCode + " : " + B.plan.PlanShortNameTh,
                    ProdGrpDescTh = planGr.ProdGrpDescTh,
                    IsActive = B.plan.IsActive
                })
                .ToListAsync();
        }

        public async Task<bool> IsActivePlan(string PlanCode, EntityContextFASTTRACK context) =>
            await context.AmqPlan.Where(c => c.PlanCode == PlanCode && c.IsActive == "A").AnyAsync();

    }

}
