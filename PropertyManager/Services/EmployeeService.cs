using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PropertyManager.Helper;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public partial class Service
    {
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
            return EmployeeRepository.FindBy(p => (filter.Id == -1 || p.employee_id == filter.Id) && (p.role == (int)RoleEmployee.MaidManager || p.role == (int)RoleEmployee.Maid)).OrderBy(p => p.last_name).ThenBy(p => p.first_name).ToList();
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
                    p.apartment_id == apartmentId && p.employee_id == employeeId && Equals(p.check_out_time, null))
                .LastOrDefault();
        }

        public apartment_employee GetLastApartmentEmployeeNotCheckOutByEmployeeId(int employeeId)
        {
            return ApartmentEmployeeRepository.FindBy(p =>
                    p.employee_id == employeeId && Equals(p.check_out_time, null))
                .LastOrDefault();
        }

        public void SaveListApartmentEmployeeIssue(List<apartment_employee_issue> listIssue)
        {
            ApartmentEmployeeIssueRepository.SaveList(listIssue);
        }
    }
}