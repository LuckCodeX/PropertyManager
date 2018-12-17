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
                    ((status == -1 && (p.status == 0 || p.status == 1)) || p.status == status) && (Equals(search, null) || p.city.Contains(search) ||
                                                             p.address.Contains(search) ||
                                                             p.code.Contains(search) || (p.user_profile.full_name).Contains(search) || p.user_profile.phone.Contains(search)) && !p.is_import).Include(p => p.apartment_content).Include(p => p.user_profile).Include(p => p.aparment_image).Include(p => p.apartment_facility).OrderByDescending(p => p.apartment_id).ToList();
        }

        public apartment GetApartmentById(int id)
        {
            return ApartmentRepository.FindBy(p => p.apartment_id == id && p.status != 2 && !p.is_import).Include(p => p.user_profile).Include(p => p.apartment_content)
                .Include(p => p.aparment_image).Include(p => p.apartment_facility.Select(q => q.facility)).FirstOrDefault();
        }

        public List<ApartmentContentModel> GetApartmentContentList(ICollection<apartment_content> apartmentApartmentContent)
        {
            var result = new List<ApartmentContentModel>();
            for (int i = 0; i <= 2; i++)
            {
                var flag = false;
                foreach (var item in apartmentApartmentContent)
                {
                    if (item.language == i)
                    {
                        flag = true;
                        result.Add(new ApartmentContentModel()
                        {
                            Id = item.apartment_content_id,
                            Name = item.name,
                            Description = item.description,
                            Language = item.language
                        });
                        break;
                    }
                }

                if (!flag)
                {
                    result.Add(new ApartmentContentModel()
                    {
                        Id = 0,
                        Language = i
                    });
                }
            }

            return result;
        }

        public void SaveApartment(apartment apartment)
        {
            ApartmentRepository.Save(apartment);
        }

        public void SaveApartmentImage(aparment_image img)
        {
            ApartmentImageRepository.Save(img);
        }

        public void DeleteApartmentImage(aparment_image item)
        {
            ApartmentImageRepository.Delete(item);
        }

        public void SaveApartmentFacility(apartment_facility aptFac)
        {
            ApartmentFacilityRepository.Save(aptFac);
        }

        public void DeleteApartmentFacility(apartment_facility item)
        {
            ApartmentFacilityRepository.Delete(item);
        }

        public apartment_content GetApartmentContentById(int id)
        {
            return ApartmentContentRepository.FindBy(p => p.apartment_content_id == id).FirstOrDefault();
        }

        public void SaveApartmentContent(apartment_content content)
        {
            ApartmentContentRepository.Save(content);
        }

        public void SaveListApartment(List<apartment> lst)
        {
            ApartmentRepository.SaveList(lst);
        }

        public List<apartment> SearchAllApartmentByCode(string search)
        {
            return ApartmentRepository.FindBy(p =>p.status == 1 && (Equals(search, null) || p.code.Contains(search))).Include(p => p.user_profile).ToList();
        }
    }
}