using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using PropertyManager.Helper;
using PropertyManager.Models;
using PropertyManager.Services;

namespace PropertyManager.Controllers
{
    [RoutePrefix("api/propertymanager")]
    public class PropertyManagerController : ApiController
    {
        private readonly IService _service = new Service();

        [HttpPost]
        [Route("Login")]
        public AdminModel Login(AdminModel model)
        {
            var admin = _service.LoginAdmin(model);
            if (Equals(admin, null))
            {
                var response = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    ReasonPhrase = "Email or Password is invalid"
                };
                throw new HttpResponseException(response);
            }

            var token = new TokenModel()
            {
                Id = admin.admin_id,
                Username = admin.username,
                Role = admin.role
            };
            return new AdminModel()
            {
                Username = admin.username,
                Token = Encrypt.Base64Encode(JsonConvert.SerializeObject(token)),
                Role = admin.role
            };
        }

        [HttpGet]
        [Route("GetListAccount/{page}/{search?}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public PagingResult<AdminModel> GetListAccount(int page, string search = null)
        {
            if (this.Request.Headers.TryGetValues("Token", out var values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var accounts = new List<admin>();
                if (tokenModel.Role == (int)RoleAdmin.SuperAdmin)
                {
                    accounts = _service.SuperAdminGetListAdmin(search);
                }
                else
                {
                    accounts = _service.GetListAdminByParentId(search, tokenModel.Id);
                }

                var accountList = accounts.Select(p => new AdminModel()
                {
                    Id = p.admin_id,
                    RoleName = _service.GetRoleName(p.role),
                    Username = p.username,
                    Parent = Equals(p.parent_id, null) ? new AdminModel() : new AdminModel()
                    {
                        Id = p.admin2.admin_id,
                        Username = p.admin2.username
                    }
                }).Skip((page - 1) * 10).Take(10).ToList();
                return new PagingResult<AdminModel>()
                {
                    total = accounts.Count,
                    data = accountList
                };
            }
            return new PagingResult<AdminModel>();
        }

        [HttpGet]
        [Route("GetAccountDetail/{id}")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin})]
        public AdminModel GetAccountDetail(int id)
        {
            if (this.Request.Headers.TryGetValues("Token", out var values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var admin = _service.GetAdminById(id);
                if (tokenModel.Role != (int)RoleAdmin.SuperAdmin)
                {
                    if (admin.parent_id != tokenModel.Id)
                    {
                        HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.MethodNotAllowed)
                        {
                            ReasonPhrase = "Tài khoản của bạn không có quyền với chức năng này"
                        };
                        throw new HttpResponseException(response);
                    }
                }
                return new AdminModel()
                {
                    Id = admin.admin_id,
                    Username = admin.username,
                    Role = admin.role,
                    ParentId = admin.parent_id
                };
            }
            return new AdminModel();
        }

        [HttpGet]
        [Route("GetListLeader")]
        [ACLFilter(AccessRoles = new int[] {(int) RoleAdmin.SuperAdmin})]
        public List<AdminModel> GetListLeader()
        {
            var admins = _service.GetListLeader();
            return admins.Select(p => new AdminModel()
            {
                Id = p.admin_id,
                Username = p.username,
                Role = p.role
            }).ToList();
        }

        [HttpPost]
        [Route("SaveAccount")]
        [ACLFilter(AccessRoles = new int[] {(int) RoleAdmin.SuperAdmin})]
        public void SaveAccount(AdminModel model)
        {
            var acc = _service.GetAdminById(model.Id);
            if (Equals(acc, null))
            {
                acc = new admin()
                {
                    admin_id = 0,
                    status = 1
                };
            }

            acc.role = model.Role;
            acc.parent_id = model.ParentId;
            acc.username = model.Username;
            if (!Equals(model.Password, null))
                acc.password = Encrypt.EncodePassword(model.Password);
            _service.SaveAdmin(acc);
        }

        [HttpDelete]
        [Route("DeleteAccount/{id}")]
        [ACLFilter(AccessRoles = new int[] {(int) RoleAdmin.SuperAdmin})]
        public void DeleteAccount(int id)
        {
            var acc = _service.GetAdminById(id);
            if (!Equals(acc, null))
            {
                acc.status = 2;
                _service.SaveAdmin(acc);
            }
        }

        [HttpGet]
        [Route("GetListApartment/{page}/{status}/{search?}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public PagingResult<ApartmentModel> GetListApartment(int page, int status, string search = null)
        {
            var apartments = _service.GetListApartment(status, search);
            var apartmentList = apartments.Select(p => new ApartmentModel()
            {
                Id = p.apartment_id,
                Address = p.address,
                City = p.city,
                Code = p.code,
                ManagementFee = p.management_fee,
                Price = p.price,
                NoBathRoom = p.no_bathroom,
                NoBedRoom = p.no_bedroom,
                ProjectId = p.project_id,
                Status = p.status,
                Type = p.type,
                UserProfileOwnerId = p.user_profile_owner_id,
                UserProfileOwner = new UserProfileModel()
                {
                    Id = p.user_profile.user_profile_id,
                    Avatar = p.user_profile.avatar,
                    Email = p.user_profile.email,
                    FirstName = p.user_profile.first_name,
                    LastName = p.user_profile.last_name
                }
            }).Skip((page - 1) * 10).Take(10).ToList();
            return new PagingResult<ApartmentModel>()
            {
                total = apartments.Count,
                data = apartmentList
            };
        }

        [HttpGet]
        [Route("GetApartmentDetail/{id}")]
        [ACLFilter(AccessRoles = new int[] {(int) RoleAdmin.SuperAdmin})]
        public ApartmentModel GetApartmentDetail(int id)
        {
            var apartment = _service.GetApartmentById(id);
            return new ApartmentModel()
            {
                Id = apartment.apartment_id,
                Address = apartment.address,
                City = apartment.city,
                Area = apartment.area,
                NoBedRoom = apartment.no_bedroom,
                Code = apartment.code,
                Latitude = apartment.latitude,
                Longitude = apartment.longitude,
                ManagementFee = apartment.management_fee,
                NoBathRoom = apartment.no_bathroom,
                Price = apartment.price,
                ProjectId = apartment.project_id,
                Status = apartment.status,
                Type = apartment.type,
                UserProfileOwnerId = apartment.user_profile_owner_id,
                UserProfileOwner = new UserProfileModel()
                {
                    Id = apartment.user_profile.user_profile_id,
                    FirstName = apartment.user_profile.first_name,
                    LastName = apartment.user_profile.last_name,
                    Avatar = apartment.user_profile.avatar
                },
                FacilityList = apartment.apartment_facility.Select(q => new FacilityModel()
                {
                    Id = q.facility.facility_id,
                    Img = q.facility.img,
                    Content = _service.ConvertFacilityContentToModel(q.facility.facility_content.FirstOrDefault(p => p.language == 0))
                }).ToList()
            };
        }
    }
}
