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
    
    public partial class user_visit
    {
        public int user_visit_id { get; set; }
        public int user_profile_id { get; set; }
        public int apartment_id { get; set; }
    
        public virtual user_profile user_profile { get; set; }
        public virtual apartment apartment { get; set; }
    }
}
