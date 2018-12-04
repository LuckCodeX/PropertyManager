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

        public employee GetEmployeeById(int id)
        {
            return EmployeeRepository.FindBy(p => p.employee_id == id).FirstOrDefault();
        }

        public void SaveEmployee(employee employee)
        {
            EmployeeRepository.Save(employee);
        }

        public List<employee> SearchListActiveMaid(FilterModel filter)
        {
            return EmployeeRepository.FindBy(p => (filter.Id == -1 || p.employee_id == filter.Id) && (p.role == (int)RoleEmployee.MaidManager || p.role == (int)RoleEmployee.Maid)).OrderBy(p => p.first_name).ThenBy(p => p.last_name).ToList();
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
    }
}