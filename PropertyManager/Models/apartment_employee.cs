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
    
    public partial class apartment_employee
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public apartment_employee()
        {
            this.apartment_employee_issue = new HashSet<apartment_employee_issue>();
        }
    
        public int apartment_employee_id { get; set; }
        public Nullable<int> check_in_time { get; set; }
        public Nullable<int> check_out_time { get; set; }
        public string check_in_geo { get; set; }
        public string check_out_geo { get; set; }
        public int type { get; set; }
        public int contract_id { get; set; }
        public int employee_id { get; set; }
        public int status { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<apartment_employee_issue> apartment_employee_issue { get; set; }
        public virtual contract contract { get; set; }
        public virtual employee employee { get; set; }
    }
}
