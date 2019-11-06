using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlanBrochureCore3.Models
{
    [Table("idoc_department")]
    public class Idoc_department
    {
        [Key]
        [Column("dept_departmentcode")]
        public string Dept_departmentcode { get; set; }

        [Column("dept_department")]
        public string Dept_department { get; set; }

    }
}
