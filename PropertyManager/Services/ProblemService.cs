using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public partial class Service
    {
        private GenericRepository<problem> _problemRepository;
        public GenericRepository<problem> ProblemRepository
        {
            get
            {
                if (this._problemRepository == null)
                    this._problemRepository = new GenericRepository<problem>(_context);
                return _problemRepository;
            }
        }

        private GenericRepository<problem_image> _problemImageRepository;
        public GenericRepository<problem_image> ProblemImageRepository
        {
            get
            {
                if (this._problemImageRepository == null)
                    this._problemImageRepository = new GenericRepository<problem_image>(_context);
                return _problemImageRepository;
            }
        }

        private GenericRepository<problem_tracking> _problemTrackingRepository;
        public GenericRepository<problem_tracking> ProblemTrackingRepository
        {
            get
            {
                if (this._problemTrackingRepository == null)
                    this._problemTrackingRepository = new GenericRepository<problem_tracking>(_context);
                return _problemTrackingRepository;
            }
        }

        public void SaveProblem(problem problem)
        {
            ProblemRepository.Save(problem);
        }

        public void SaveListProblemImage(List<problem_image> listImage)
        {
            ProblemImageRepository.SaveList(listImage);
        }

        public problem GetProblemById(int id)
        {
            return ProblemRepository.FindBy(p => p.problem_id == id).FirstOrDefault();
        }

        public List<problem_image> GetAllProblemImageByProblemId(int problemId)
        {
            return ProblemImageRepository.FindBy(p => p.problem_id == problemId).ToList();
        }

        public void DeleteProblemImage(int id)
        {
            ProblemImageRepository.Delete(id);
        }

        public void SaveProblemTracking(problem_tracking tracking)
        {
            ProblemTrackingRepository.Save(tracking);
        }

        public List<problem> SearchListProblem(FilterModel filter)
        {
            return ProblemRepository.FindBy(p => p.status != 2
                                                 && (filter.FromDate <= p.created_date && p.created_date <= filter.ToDate)
                                                 && (Equals(filter.Address, null) || p.apartment.address.Contains(filter.Address))
                                                 && (Equals(filter.Building, null) || p.apartment.building.Contains(filter.Building))
                                                 && (Equals(filter.NoApartment, null) || p.apartment.no_apartment.Contains(filter.NoApartment))
                                                 && (filter.ProjectId == -1 || p.apartment.project_id == filter.ProjectId)
                                                 && (filter.Type == -1 || p.issue_id == filter.Type)).Include(p => p.apartment.project.project_content).Include(p => p.contract.user_profile1.user_profile_note).Include(p => p.problem_image).Include(p => p.problem_tracking).OrderByDescending(p => p.problem_id).ToList();
        }

        public void DeleteProblemTracking(int id)
        {
            ProblemTrackingRepository.Delete(id);
        }
    }
}