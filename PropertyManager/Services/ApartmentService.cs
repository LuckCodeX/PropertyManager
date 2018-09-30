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
        private GenericRepository<apartment> _apartmentRepository;
        public GenericRepository<apartment> ApartmentRepository
        {
            get
            {
                if (this._apartmentRepository == null)
                    this._apartmentRepository = new GenericRepository<apartment>(_context);
                return _apartmentRepository;
            }
        }

        private GenericRepository<apartment_content> _apartmentContentRepository;
        public GenericRepository<apartment_content> ApartmentContentRepository
        {
            get
            {
                if (this._apartmentContentRepository == null)
                    this._apartmentContentRepository = new GenericRepository<apartment_content>(_context);
                return _apartmentContentRepository;
            }
        }

        private GenericRepository<aparment_image> _apartmentImageRepository;
        public GenericRepository<aparment_image> ApartmentImageRepository
        {
            get
            {
                if (this._apartmentImageRepository == null)
                    this._apartmentImageRepository = new GenericRepository<aparment_image>(_context);
                return _apartmentImageRepository;
            }
        }

        private GenericRepository<apartment_facility> _apartmentFacilityRepository;
        public GenericRepository<apartment_facility> ApartmentFacilityRepository
        {
            get
            {
                if (this._apartmentFacilityRepository == null)
                    this._apartmentFacilityRepository = new GenericRepository<apartment_facility>(_context);
                return _apartmentFacilityRepository;
            }
        }

        public List<apartment> GetListApartment(int status, string search)
        {
            return ApartmentRepository.FindBy(p =>
                    ((status == -1 && p.status != 2) || p.status == status) && (Equals(search, null) || p.city.Contains(search) ||
                                                             p.address.Contains(search) ||
                                                             p.code.Contains(search))).Include(p => p.apartment_content).Include(p => p.user_profile).Include(p => p.aparment_image).Include(p => p.apartment_facility).ToList();
        }

        public apartment GetApartmentById(int id)
        {
            return ApartmentRepository.FindBy(p => p.apartment_id == id).Include(p => p.user_profile).Include(p => p.apartment_content)
                .Include(p => p.aparment_image).Include(p => p.apartment_facility.Select(q => q.facility)).FirstOrDefault();
        }
    }
}