using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace oak.Models
{
    public class AmqProductGroup
    {
        [Key]
        [Column(TypeName = "bigint")]
        public int ProdGrpId { get; set; }
        public string ProdGrpNameTh { get; set; }
        public string ProdGrpType { get; set; }
        public int IsActive { get; set; }

    }
}
