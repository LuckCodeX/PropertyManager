﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public partial class Service
    {
        private GenericRepository<facility> _facilityRepository;
        public GenericRepository<facility> FacilityRepository
        {
            get
            {
                if (this._facilityRepository == null)
                    this._facilityRepository = new GenericRepository<facility>(_context);
                return _facilityRepository;
            }
        }

        public FacilityContentModel ConvertFacilityContentToModel(facility_content model)
        {
            return new FacilityContentModel()
            {
                Id = model.facility_content_id,
                Language = model.language,
                Name = model.name
            };
        }

        public List<facility> GetAllFacilities()
        {
            return FacilityRepository.FindBy(p => p.status == 1).Include(p => p.facility_content).ToList();
        }
    }
}