using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public partial class Service
    {
        private GenericRepository<company> _companyRepository;
        public GenericRepository<company> CompanyRepository
        {
            get
            {
                if (this._companyRepository == null)
                    this._companyRepository = new GenericRepository<company>(_context);
                return _companyRepository;
            }
        }

        public List<company> SearchAllCompany(string search)
        {
            return CompanyRepository.FindBy(p => Equals(search, null) || p.name.Contains(search)).ToList();
        }
    }
}