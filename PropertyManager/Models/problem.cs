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
    
    public partial class problem
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public problem()
        {
            this.problem_image = new HashSet<problem_image>();
            this.problem_tracking = new HashSet<problem_tracking>();
        }
    
        public int problem_id { get; set; }
        public Nullable<int> issue_id { get; set; }
        public Nullable<int> type { get; set; }
        public string summary { get; set; }
        public string description { get; set; }
        public Nullable<bool> is_calendar { get; set; }
        public Nullable<int> priority { get; set; }
        public int status { get; set; }
        public int created_date { get; set; }
        public int apartment_id { get; set; }
        public Nullable<int> employee_id { get; set; }
    
        public virtual issue issue { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<problem_image> problem_image { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<problem_tracking> problem_tracking { get; set; }
        public virtual apartment apartment { get; set; }
    }
}
