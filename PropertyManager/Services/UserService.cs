using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PropertyManager.Models;
using PropertyManager.Services;

namespace PropertyManager.Services
{
    public partial class Service
    {
        private GenericRepository<user_profile> _userProfileRepository;
        public GenericRepository<user_profile> UserProfileRepository
        {
            get
            {
                if (this._userProfileRepository == null)
                    this._userProfileRepository = new GenericRepository<user_profile>(_context);
                return _userProfileRepository;
            }
        }

        public user_profile GetUserProfileByNameAndPhone(string name, string phone)
        {
            return UserProfileRepository.FindBy(p => p.full_name == name && p.phone == phone).FirstOrDefault();
        }

        public void SaveUserProfile(user_profile userProfile)
        {
            UserProfileRepository.Save(userProfile);
        }
    }
}