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
                .FindBy(p => ((filter.FromDate <= p.start_date && p.start_date <= filter.ToDate) || (filter.FromDate <= p.end_date && p.end_date <= filter.ToDate) || (p.start_date <= filter.FromDate && filter.ToDate <= p.end_date)) 
                             && Equals(p.parent_id, null)
                             && (filter.Id == -1 || p.contract_employee.Any(q => q.employee_id == filter.Id))
                             && (Equals(filter.Address, null) ||p.address.Contains(filter.Address))
                             && (Equals(filter.NoApartment, null) || p.no_apartment.Contains(filter.NoApartment))
                             && (Equals(filter.Building, null) || p.building.Contains(filter.Building))
                             && (Equals(filter.ProjectId, null) || p.apartment.project_id == filter.ProjectId)
                             ).Include(p => p.apartment.project.project_content).Include(p => p.contract_employee).Include(p => p.user_profile1.user_profile_note).ToList();
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
                .FindBy(p => p.apartment_id == apartmentId && p.status == 1 && p.start_date.Value <= currentTime && currentTime <= p.end_date.Value && Equals(p.parent_id, null))
                .Include(p => p.user_profile1.user_profile_note)
                .Include(p => p.apartment.problems)
                .FirstOrDefault();
        }

        public List<contract> GetAllCurrentContractByEmployeeId(int employeeId)
        {
            return ContractRepository.FindBy(p =>
                    p.contract_employee.Any(
                        q => q.employee_id == employeeId && q.status == 1 && Equals(q.to_date, null)))
                .Include(p => p.apartment.project.project_content)
                .Include(p => p.contract_employee)
                .ToList();
        }

        public contract GetCurrentContractByApartmentAndEmployeeId(int apartmentId, int employeeId)
        {
            return ContractRepository.FindBy(p => p.contract_employee.Any(
                                                      q => q.employee_id == employeeId && q.status == 1 &&
                                                           Equals(q.to_date, null)) && p.apartment_id == apartmentId)
                .Include(p => p.apartment.project.project_content)
                .Include(p => p.user_profile1.user_profile_note)
                .Include(p => p.apartment.problems.Select(q => q.problem_image))
                .FirstOrDefault();
        }
    }
}