using System;
using System.Collections.Generic;
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
    }
}