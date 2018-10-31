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
        private GenericRepository<user_visit> _userVisitRepository;
        public GenericRepository<user_visit> UserVisitRepository
        {
            get
            {
                if (this._userVisitRepository == null)
                    this._userVisitRepository = new GenericRepository<user_visit>(_context);
                return _userVisitRepository;
            }
        }

        private GenericRepository<user_visit_item> _userVisitItemRepository;
        public GenericRepository<user_visit_item> UserVisitItemRepository
        {
            get
            {
                if (this._userVisitItemRepository == null)
                    this._userVisitItemRepository = new GenericRepository<user_visit_item>(_context);
                return _userVisitItemRepository;
            }
        }

        private GenericRepository<user_visit_history> _userVisitHistoryRepository;
        public GenericRepository<user_visit_history> UserVisitHistoryRepository
        {
            get
            {
                if (this._userVisitHistoryRepository == null)
                    this._userVisitHistoryRepository = new GenericRepository<user_visit_history>(_context);
                return _userVisitHistoryRepository;
            }
        }

        public List<user_visit> SearchListUserVisit(int status)
        {
            return UserVisitRepository.FindBy(p => status == -1 || p.status == status).Include(p => p.user_visit_item).Include(p => p.user_profile).OrderByDescending(p => p.user_visit_id).ToList();
        }

        public user_visit GetUserVisitById(int id)
        {
            return UserVisitRepository.FindBy(p => p.user_visit_id == id).Include(p => p.user_visit_item.Select(q => q.apartment.aparment_image)).Include(p => p.user_profile).Include(p => p.user_visit_item.Select(q => q.user_visit_history)).FirstOrDefault();
        }

        public void DeleteUserVisit(user_visit userVisit)
        {
            UserVisitRepository.Delete(userVisit);
        }

        public user_visit_item GetUserVisitItemById(int id)
        {
            return UserVisitItemRepository.FindBy(p => p.user_visit_item_id == id).FirstOrDefault();
        }

        public void SaveUserVisit(user_visit visit)
        {
            UserVisitRepository.Save(visit);
        }

        public void SaveUserVisitItem(user_visit_item visitItem)
        {
            UserVisitItemRepository.Save(visitItem);
        }

        public user_visit_history GetUserVisitHistoryById(int id)
        {
            return UserVisitHistoryRepository.FindBy(p => p.user_visit_history_id == id).FirstOrDefault();
        }

        public void SaveUserVisitHistory(user_visit_history his)
        {
            UserVisitHistoryRepository.Save(his);
        }
    }
}