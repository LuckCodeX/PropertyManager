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
    
    public partial class apartment_facility
    {
        public int apartment_facility_id { get; set; }
        public int apartment_id { get; set; }
        public int facility_id { get; set; }
    
        public virtual facility facility { get; set; }
        public virtual apartment apartment { get; set; }
    }
}
