using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace oak.Models
{
    public class AmqProduct
    {
        [Key]
        [Column(TypeName = "bigint")]
        public int ProdId { get; set; }
        [Column(TypeName = "bigint")]
        public int ProdGrpId { get; set; }
        public string IsActive { get; set; }
    }
}
