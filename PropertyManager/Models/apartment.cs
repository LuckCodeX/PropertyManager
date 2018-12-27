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
    
    public partial class apartment
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public apartment()
        {
            this.aparment_image = new HashSet<aparment_image>();
            this.apartment_content = new HashSet<apartment_content>();
            this.apartment_facility = new HashSet<apartment_facility>();
            this.user_visit_item = new HashSet<user_visit_item>();
            this.contracts = new HashSet<contract>();
            this.problems = new HashSet<problem>();
        }
    
        public int apartment_id { get; set; }
        public int user_profile_owner_id { get; set; }
        public int created_date { get; set; }
        public int status { get; set; }
        public string code { get; set; }
        public Nullable<decimal> price { get; set; }
        public Nullable<decimal> area { get; set; }
        public Nullable<int> no_bedroom { get; set; }
        public Nullable<int> no_bathroom { get; set; }
        public string address { get; set; }
        public Nullable<double> latitude { get; set; }
        public Nullable<double> longitude { get; set; }
        public string city { get; set; }
        public Nullable<int> project_id { get; set; }
        public int type { get; set; }
        public Nullable<decimal> management_fee { get; set; }
        public string no_apartment { get; set; }
        public string building { get; set; }
        public string phone { get; set; }
        public bool is_import { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<aparment_image> aparment_image { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<apartment_content> apartment_content { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<apartment_facility> apartment_facility { get; set; }
        public virtual project project { get; set; }
        public virtual user_profile user_profile { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<user_visit_item> user_visit_item { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<contract> contracts { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<problem> problems { get; set; }
    }
}
