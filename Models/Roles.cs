using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace oak.Models
{
    [Table("PB_Roles")]
    public class Roles
    {
        [Key]
        [Column("ID")]
        public int RoleID { get; set; }
        public string RoleName { get; set; }
    

    }
}
