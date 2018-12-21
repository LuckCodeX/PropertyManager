using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using PropertyManager.Helper;
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

        public List<contract> SearchListContract(FilterModel filter)
        {
            return ContractRepository
                .FindBy(p => (Equals(filter.FromDate, null) || filter.FromDate.Value <= p.created_date) 
                             && (Equals(filter.ToDate, null) || p.created_date <= filter.ToDate) 
                             && Equals(p.parent_id, null)
                             && (filter.Id == -1 || p.contract_employee.Any(q => q.employee_id == filter.Id))
                             ).Include(p => p.apartment.project.project_content).Include(p => p.contract_employee).ToList();
        }

        public List<contract> GetCountContractThisYear()
        {
            var startYear = ConvertDatetime.GetBeginYearUnixTimeStamp();
            var endYear = ConvertDatetime.GetEndYearUnixTimeStamp();
            return ContractRepository.FindBy(p => startYear <= p.created_date && p.created_date <= endYear).ToList();
        }

        public List<contract> SearchAllParentContract(string search)
        {
            return ContractRepository
                .FindBy(p => Equals(p.parent_id, null) && (Equals(search, null) || p.code.Contains(search))).ToList();
        }

        public contract GetCurrentParentContractByApartmentId(int apartmentId)
        {
            var currentTime = ConvertDatetime.GetCurrentUnixTimeStamp();
            return ContractRepository
                .FindBy(p => p.status == 1 && p.start_date.Value <= currentTime && currentTime <= p.end_date.Value && Equals(p.parent_id, null))
                .FirstOrDefault();
        }

        public List<contract> SearchListCurrentContractByEmployeeId(string search, int employeeId)
        {
            return ContractRepository.FindBy(p =>
                    p.contract_employee.Any(
                        q => q.employee_id == employeeId && q.status == 1 && Equals(q.to_date, null)) && (Equals(search, null) || p.apartment.code.Contains(search)))
                .Include(p => p.apartment)
                .ToList();
        }
    }
}