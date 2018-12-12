using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public partial class Service
    {
        private GenericRepository<contract> _contractRepository;
        public GenericRepository<contract> ContractRepository
        {
            get
            {
                if (this._contractRepository == null)
                    this._contractRepository = new GenericRepository<contract>(_context);
                return _contractRepository;
            }
        }

        public contract GetContractById(int id)
        {
            return ContractRepository.FindBy(p => p.contract_id == id).FirstOrDefault();
        }

        public void SaveContract(contract contract)
        {
            ContractRepository.Save(contract);
        }
    }
}