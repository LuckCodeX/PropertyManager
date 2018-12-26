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

        private GenericRepository<user_account> _userAccountRepository;
        public GenericRepository<user_account> UserAccountRepository
        {
            get
            {
                if (this._userAccountRepository == null)
                    this._userAccountRepository = new GenericRepository<user_account>(_context);
                return _userAccountRepository;
            }
        }

        private GenericRepository<user_profile_note> _userProfileNoteRepository;
        public GenericRepository<user_profile_note> UserProfileNoteRepository
        {
            get
            {
                if (this._userProfileNoteRepository == null)
                    this._userProfileNoteRepository = new GenericRepository<user_profile_note>(_context);
                return _userProfileNoteRepository;
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

        public user_profile GetUserProfileById(int userProfileId)
        {
            return UserProfileRepository.FindBy(p => p.user_profile_id == userProfileId).FirstOrDefault();
        }

        public user_profile GetUserProfileByEmail(string email)
        {
            return UserProfileRepository.FindBy(p => p.email == email).FirstOrDefault();
        }

        public void SaveUserAccount(user_account userAccount)
        {
            UserAccountRepository.Save(userAccount);
        }

        public List<user_profile> GetListUserProfile(string search)
        {
            return UserProfileRepository.FindBy(p => p.status == 1 && (Equals(search, null) || p.email.Equals(search) || p.full_name.Equals(search)))
                .ToList();
        }

        public void SaveUserProfileNote(user_profile_note note)
        {
            UserProfileNoteRepository.Save(note);
        }

        public List<user_profile_note> GetAllUserProfileNoteByUserProfileId(int userProfileId)
        {
            return UserProfileNoteRepository.FindBy(p => p.user_profile_id == userProfileId).ToList();
        }
    }
}