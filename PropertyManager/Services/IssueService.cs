using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public partial class Service
    {
        private GenericRepository<issue> _issueRepository;
        public GenericRepository<issue> IssueRepository
        {
            get
            {
                if (this._issueRepository == null)
                    this._issueRepository = new GenericRepository<issue>(_context);
                return _issueRepository;
            }
        }

        public List<issue> GetAllIssue()
        {
            return IssueRepository.FindBy(p => p.status == 1).ToList();
        }

        public issue GetIssueById(int id)
        {
            return IssueRepository.FindBy(p => p.issue_id == id && p.status == 1).FirstOrDefault();
        }

        public void SaveIssue(issue issue)
        {
            IssueRepository.Save(issue);
        }
    }
}