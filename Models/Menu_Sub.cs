using System.ComponentModel.DataAnnotations;

namespace PlanBrochure.Models
{
    public class Menu_Sub
    {
        [Key]
        public int ID { get; set; }
        public virtual Menu_Main Menu_Main { get; set; }
        public string Text { get; set; }
        public string Color { get; set; }
        public string Mycontainer { get; set; }
    }
}
