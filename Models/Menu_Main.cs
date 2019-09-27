using System.ComponentModel.DataAnnotations;

namespace PlanBrochure.Models
{
    public class Menu_Main
    {
        [Key]
        public int ID { get; set; }
        public string Text { get; set; }
        public string PartailViewUrl { get; set; }
        public string JavascriptFn { get; set; }
    }
}
