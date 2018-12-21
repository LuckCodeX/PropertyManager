using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace PropertyManager.Helper
{
    public class Images
    {
        public static string SaveImage(string path, string imageName, string image)
        {
            image = image.Replace("data:image/png;base64,", "").Replace("data:image/jpg;base64,", "").Replace("data:image/jpeg;base64,", "");
            File.WriteAllBytes(HttpContext.Current.Server.MapPath(path + imageName), Convert.FromBase64String(image));
            return imageName;
        }
    }
}