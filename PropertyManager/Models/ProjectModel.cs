using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class ProjectModel
    {
        public int Id { get; set; }
        public string Img { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
        public int Type { get; set; }
        public HttpPostedFileBase ImageFile { get; set; }
        public List<ProjectContentModel> ContentList { get; set; }
        public ProjectContentModel Content { get; set; }
    }

    public class ProjectContentModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Language { get; set; }
    }
}