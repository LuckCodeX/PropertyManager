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
    
    public partial class blog_content
    {
        public int blog_content_id { get; set; }
        public string title { get; set; }
        public string content { get; set; }
        public int blog_id { get; set; }
        public string description { get; set; }
        public int language { get; set; }
    
        public virtual blog blog { get; set; }
    }
}
