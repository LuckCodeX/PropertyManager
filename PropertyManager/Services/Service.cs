﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public partial class Service : IService, IDisposable
    {
        private readonly PropertyManagerEntities _context = new PropertyManagerEntities();

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public string SaveImage(string path, string imageName, string image)
        {
            image = image.Replace("data:image/png;base64,", "").Replace("data:image/jpg;base64,", "").Replace("data:image/jpeg;base64,", "");
            File.WriteAllBytes(HttpContext.Current.Server.MapPath(path + imageName), Convert.FromBase64String(image));
            return imageName;
        }
    }
}