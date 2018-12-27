using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public partial class Service
    {
        private GenericRepository<inbox> _inboxRepository;
        public GenericRepository<inbox> InboxRepository
        {
            get
            {
                if (this._inboxRepository == null)
                    this._inboxRepository = new GenericRepository<inbox>(_context);
                return _inboxRepository;
            }
        }

        public List<inbox> GetAllInboxByType(int type)
        {
            return InboxRepository.FindBy(p => p.type == type).ToList();
        }
    }
}