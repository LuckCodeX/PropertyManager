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
        private GenericRepository<employee_note> _employeeNoteIssueRepository;
        public GenericRepository<employee_note> EmployeeNoteRepository
        {
            get
            {
                if (this._employeeNoteIssueRepository == null)
                    this._employeeNoteIssueRepository = new GenericRepository<employee_note>(_context);
                return _employeeNoteIssueRepository;
            }
        }

        private GenericRepository<apartment_employee_issue> _apartmentEmployeeIssueRepository;
        public GenericRepository<apartment_employee_issue> ApartmentEmployeeIssueRepository
        {
            get
            {
                if (this._apartmentEmployeeIssueRepository == null)
                    this._apartmentEmployeeIssueRepository = new GenericRepository<apartment_employee_issue>(_context);
                return _apartmentEmployeeIssueRepository;
            }
        }

        private GenericRepository<apartment_employee> _apartmentEmployeeRepository;
        public GenericRepository<apartment_employee> ApartmentEmployeeRepository
        {
            get
            {
                if (this._apartmentEmployeeRepository == null)
                    this._apartmentEmployeeRepository = new GenericRepository<apartment_employee>(_context);
                return _apartmentEmployeeRepository;
            }
        }

        private GenericRepository<employee> _employeeRepository;
        public GenericRepository<employee> EmployeeRepository
        {
            get
            {
                if (this._employeeRepository == null)
                    this._employeeRepository = new GenericRepository<employee>(_context);
                return _employeeRepository;
            }
        }

        private GenericRepository<contract_employee> _contractEmployeeRepository;
        public GenericRepository<contract_employee> ContractEmployeeRepository
        {
            get
            {
                if (this._contractEmployeeRepository == null)
                    this._contractEmployeeRepository = new GenericRepository<contract_employee>(_context);
                return _contractEmployeeRepository;
            }
        }

        public employee GetMaidById(int id)
        {
            return EmployeeRepository.FindBy(p => p.employee_id == id && (p.role == (int)RoleEmployee.Maid || p.role == (int)RoleEmployee.MaidManager)).FirstOrDefault();
        }

        public void SaveEmployee(employee employee)
        {
            EmployeeRepository.Save(employee);
        }

        public List<employee> SearchListActiveMaid(FilterModel filter)
        {
            return EmployeeRepository.FindBy(p => (filter.Id == -1 || p.employee_id == filter.Id) && (p.role == (int)RoleEmployee.MaidManager || p.role == (int)RoleEmployee.Maid)).OrderBy(p => p.last_name).ThenBy(p => p.first_name).Include(p => p.contract_employee.Select(q => q.contract)).Include(p => p.employee_note).ToList();
        }

        public string GetEmployeeRoleName(int role)
        {
            switch (role)
            {
                case (int)RoleEmployee.MaidManager:
                    return "Trưởng nhóm buồng phòng";
                case (int)RoleEmployee.Maid:
                    return "Nhân viên buồng phòng";
                default:
                    return "";
            }
        }

        public employee GetActiveMaidById(int id)
        {
            return EmployeeRepository.FindBy(p => p.employee_id == id && p.status == 1 && (p.role == (int)RoleEmployee.Maid || p.role == (int)RoleEmployee.MaidManager)).FirstOrDefault();
        }

        public List<employee> GetAllActiveMaid()
        {
            return EmployeeRepository.FindBy(p => p.status == 1 && (p.role == (int)RoleEmployee.Maid || p.role == (int)RoleEmployee.MaidManager)).OrderBy(p => p.last_name).ThenBy(p => p.first_name).ToList();
        }

        public employee MaidLogin(EmployeeModel model)
        {
            var pass = Encrypt.EncodePassword(model.Password);
            return EmployeeRepository.FindBy(p => p.username == model.Username && p.password == pass && p.status == 1 && (p.role == (int)RoleEmployee.Maid || p.role == (int)RoleEmployee.MaidManager)).FirstOrDefault();
        }

        public EmployeeModel GetMaidModelByContractId(int contractId)
        {
            var contractEmployee =
                ContractEmployeeRepository.FindBy(p => p.contract_id == contractId && Equals(p.to_date, null)).FirstOrDefault();
            if (Equals(contractEmployee, null))
                return new EmployeeModel();
            var employee =
                EmployeeRepository.FindBy(p => p.employee_id == contractEmployee.employee_id && p.status == 1 && (p.role == (int)RoleEmployee.Maid || p.role == (int)RoleEmployee.MaidManager)).FirstOrDefault();
            if (Equals(employee, null))
                return new EmployeeModel();
            return new EmployeeModel()
            {
                Id = employee.employee_id,
                Code = employee.code,
                FirstName = employee.first_name,
                LastName = employee.last_name,
                Phone = employee.phone,
                WorkDate = contractEmployee.work_date.Split(',').ToList(),
                WorkHour = contractEmployee.work_hour
            };
        }

        public contract_employee GetContractEmployeeByContractIdAndEmployeeId(int contractId, int maidId)
        {
            return ContractEmployeeRepository.FindBy(p => p.contract_id == contractId && p.employee_id == maidId && p.status == 1)
                .FirstOrDefault();
        }

        public contract_employee GetLastContractEmployeeByContractId(int contractId)
        {
            return ContractEmployeeRepository.FindBy(p => p.contract_id == contractId && p.status == 1 && Equals(p.to_date, null))
                .FirstOrDefault();
        }

        public void SaveContractEmployee(contract_employee model)
        {
            ContractEmployeeRepository.Save(model);
        }

        public void SaveApartmentEmployee(apartment_employee model)
        {
            ApartmentEmployeeRepository.Save(model);
        }

        public apartment_employee GetLastApartmentEmployeeByApartmentIdAndEmployeeId(int apartmentId, int employeeId)
        {
            return ApartmentEmployeeRepository.FindBy(p =>
                    p.contract.apartment_id == apartmentId && p.employee_id == employeeId && Equals(p.check_out_time, null))
                .FirstOrDefault();
        }

        public apartment_employee GetLastApartmentEmployeeNotCheckOutByEmployeeId(int employeeId)
        {
            return ApartmentEmployeeRepository.FindBy(p =>
                    p.employee_id == employeeId && Equals(p.check_out_time, null))
                .FirstOrDefault();
        }

        public void SaveListApartmentEmployeeIssue(List<apartment_employee_issue> listIssue)
        {
            ApartmentEmployeeIssueRepository.SaveList(listIssue);
        }

        public void SaveEmployeeNote(employee_note note)
        {
            EmployeeNoteRepository.Save(note);
        }

        public void DeleteEmployeeNote(int id)
        {
            EmployeeNoteRepository.Delete(id);
        }

        public List<contract_employee> GetAllCurrentContractEmployeeByEmployeeId(int employeeId)
        {
            return ContractEmployeeRepository
                .FindBy(p => p.contract.status == 1 && p.employee_id == employeeId && Equals(p.to_date, null))
                .Include(p => p.contract.apartment.project).ToList();
        }

        public List<apartment_employee> GetListApartmentEmployeeByEmployeeIdAndTimeStamp(int employeeId, int startTime, int endTime)
        {
            return ApartmentEmployeeRepository.FindBy(p =>
                p.employee_id == employeeId && startTime <= p.check_in_time && p.check_in_time <= endTime).Include(p => p.contract.apartment).ToList();
        }

        public List<apartment_employee> SearchListApartmentEmployee(FilterModel filter)
        {
            return ApartmentEmployeeRepository
                .FindBy(p => (filter.Id == -1 || p.employee_id == filter.Id)
                            && filter.FromDate <= p.check_in_time && p.check_in_time <= filter.ToDate
                           && (Equals(filter.Address, null) || p.contract.address.Contains(filter.Address))
                           && (Equals(filter.NoApartment, null) || p.contract.no_apartment.Contains(filter.NoApartment))
                           && (Equals(filter.Building, null) || p.contract.building.Contains(filter.Building))
                           && (filter.ProjectId == -1 || p.contract.apartment.project_id == filter.ProjectId)).OrderByDescending(p => p.apartment_employee_id).Include(p => p.contract.apartment.project).Include(p => p.employee).Include(p => p.apartment_employee_issue).ToList();
        }

        public ContractEmployeeModel ConvertContractEmployeeToModel(contract_employee model)
        {
            return new ContractEmployeeModel()
            {
                Id = model.contract_employee_id,
                WorkHour = model.work_hour ?? 0,
                WorkDate = model.work_date.Split(',').ToList(),
                FromDate = model.from_date,
                ToDate = model.to_date ?? 0
            };
        }

        public List<ApartmentEmployeeIssueModel> TrackingIssue(List<apartment_employee_issue> apartmentEmployeeIssue)
        {
            var issues = GetAllIssue();
            var result = new List<ApartmentEmployeeIssueModel>();
            foreach (var issue in issues)
            {
                var flag = false;
                foreach (var item in apartmentEmployeeIssue)
                {
                    if (item.issue_id == issue.issue_id)
                    {
                        flag = item.is_complete;
                        break;
                    }
                }
                var aei = new ApartmentEmployeeIssueModel()
                {
                    IssueId = issue.issue_id,
                    IsComplete = flag
                };
                result.Add(aei);
            }

            return result;
        }
    }
}