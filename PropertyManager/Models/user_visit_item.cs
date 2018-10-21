//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PropertyManager.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class user_visit_item
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public user_visit_item()
        {
            this.user_visit_history = new HashSet<user_visit_history>();
        }
    
        public int user_visit_item_id { get; set; }
        public int apartment_id { get; set; }
        public bool is_management_fee { get; set; }
        public bool is_internet_wifi { get; set; }
        public int tv_type { get; set; }
        public int cleaning { get; set; }
        public int water { get; set; }
        public bool is_detergent { get; set; }
        public decimal bill { get; set; }
        public bool is_include_tax { get; set; }
        public decimal total_price { get; set; }
        public decimal service_price { get; set; }
        public int status { get; set; }
        public int user_visit_id { get; set; }
    
        public virtual apartment apartment { get; set; }
        public virtual user_visit user_visit { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<user_visit_history> user_visit_history { get; set; }
    }
}