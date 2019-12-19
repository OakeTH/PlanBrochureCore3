using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlanBrochureCore3.Models
{
    [Table("idoc_user")]
    public class Idoc_user
    {
        [Key]
        [Column("user_employeecode")]
        public string User_employeecode { get; set; }
        
        [ForeignKey("user_departmentcode")]
        public virtual Idoc_department Idoc_Department { get; set; }

    }
}
