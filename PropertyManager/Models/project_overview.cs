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
    
    public partial class project_overview
    {
        public int project_overview_id { get; set; }
        public string content { get; set; }
        public int language { get; set; }
        public int project_id { get; set; }
    
        public virtual project project { get; set; }
    }
}
