using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Transactions;
using System.Web;
using System.Web.Http;
using ExcelDataReader;
using Newtonsoft.Json;
using PropertyManager.Helper;
using PropertyManager.Models;
using PropertyManager.Services;

namespace PropertyManager.Controllers
{
    [RoutePrefix("api/propertymanager")]
    public class PropertyManagerController : BaseController
    {
        private readonly IService _service = new Service();

        [HttpPost]
        [Route("Login")]
        public AdminModel Login(AdminModel model)
        {
            var admin = _service.LoginAdmin(model);
            if (Equals(admin, null))
            {
                ExceptionContent(HttpStatusCode.Unauthorized, "Tài khoản hoặc mật khẩu sai");
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
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
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
                        ExceptionContent(HttpStatusCode.MethodNotAllowed, "Tài khoản của bạn không có quyền với chức năng này");
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
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
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
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
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
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
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
                    LastName = p.user_profile.last_name,
                    Phone = p.user_profile.phone
                },
                ImgList = p.aparment_image.Where(q => q.type == 0).OrderBy(q => q.type).Select(q => new ApartmentImageModel()
                {
                    Id = q.apartment_image_id,
                    Type = q.type,
                    Img = q.img
                }).ToList()
            }).Skip((page - 1) * 10).Take(10).ToList();
            return new PagingResult<ApartmentModel>()
            {
                total = apartments.Count,
                data = apartmentList
            };
        }

        [HttpGet]
        [Route("GetApartmentDetail/{id}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public ApartmentModel GetApartmentDetail(int id)
        {
            var apartment = _service.GetApartmentById(id);
            if (Equals(apartment, null))
            {
                ExceptionContent(HttpStatusCode.MethodNotAllowed, "Dữ liệu không tồn tại");
            }
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
                    ApartmentFacilityId = q.apartment_facility_id,
                    Content = _service.ConvertFacilityContentToModel(q.facility.facility_content.FirstOrDefault(p => p.language == 0))
                }).ToList(),
                ImgList = apartment.aparment_image.Select(p => new ApartmentImageModel()
                {
                    Id = p.apartment_image_id,
                    Type = p.type,
                    Img = p.img
                }).ToList(),
                ContentList = _service.GetApartmentContentList(apartment.apartment_content).ToList()
            };
        }

        [HttpDelete]
        [Route("DeleteApartment/{id}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public void DeleteApartment(int id)
        {
            var apartment = _service.GetApartmentById(id);
            if (!Equals(apartment, null))
            {
                apartment.status = 2;
                _service.SaveApartment(apartment);
            }
        }

        [HttpPut]
        [Route("SaveApartment")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public void SaveApartment(ApartmentModel model)
        {
            try
            {
                using (var scope = new TransactionScope())
                {
                    var apartment = _service.GetApartmentById(model.Id);
                    if (Equals(apartment, null))
                        ExceptionContent(HttpStatusCode.NotFound, "err_apartment_not_found");
                    apartment.address = model.Address;
                    apartment.city = model.City;
                    apartment.latitude = model.Latitude;
                    apartment.longitude = model.Longitude;
                    apartment.status = model.Status;
                    apartment.area = model.Area;
                    apartment.management_fee = model.ManagementFee;
                    apartment.price = model.Price;
                    apartment.no_bathroom = model.NoBathRoom;
                    apartment.no_bedroom = model.NoBedRoom;
                    apartment.project_id = model.ProjectId;
                    apartment.type = model.Type;
                    apartment.status = model.Status;
                    _service.SaveApartment(apartment);

                    var imgIds = new List<int>();
                    var imgIdx = 0;
                    var imgList = apartment.aparment_image.ToList();
                    foreach (var item in model.ImgList)
                    {
                        imgIds.Add(item.Id);
                        var flag = false;
                        foreach (var img in imgList)
                        {
                            if (img.apartment_image_id == item.Id)
                            {
                                img.type = item.Type;
                                if (!Equals(item.Img_Base64, null))
                                {
                                    img.img = "http://manager.propertyplus.com.vn/Upload/apartment/" + _service.SaveImage("~/Upload/apartment/",
                                        "apt_" + ConvertDatetime.GetCurrentUnixTimeStamp() + "_" +
                                        img.apartment_image_id + ".png",
                                        item.Img_Base64);
                                }

                                _service.SaveApartmentImage(img);
                                flag = true;
                                break;
                            }
                        }

                        if (!flag)
                        {
                            var aptImg = new aparment_image()
                            {
                                apartment_image_id = 0,
                                apartment_id = apartment.apartment_id,
                                type = item.Type,
                            };
                            if (!Equals(item.Img_Base64, null))
                            {
                                aptImg.img = "http://manager.propertyplus.com.vn/Upload/apartment/" + _service.SaveImage("~/Upload/apartment/",
                                    "apt_" + ConvertDatetime.GetCurrentUnixTimeStamp() + "_" + imgIdx
                                     + ".png",
                                    item.Img_Base64);
                                _service.SaveApartmentImage(aptImg);
                            }
                        }

                        imgIdx++;
                    }

                    foreach (var item in imgList)
                    {
                        if (imgIds.IndexOf(item.apartment_image_id) == -1)
                        {
                            _service.DeleteApartmentImage(item);
                        }
                    }

                    var facIds = new List<int>();
                    var facList = apartment.apartment_facility.ToList();
                    foreach (var item in model.FacilityList)
                    {
                        facIds.Add(item.ApartmentFacilityId);
                        var flag = false;
                        foreach (var fac in facList)
                        {
                            if (item.ApartmentFacilityId == fac.apartment_facility_id)
                            {
                                flag = true;
                                break;
                            }
                        }

                        if (!flag)
                        {
                            var aptFac = new apartment_facility()
                            {
                                apartment_facility_id = 0,
                                apartment_id = apartment.apartment_id,
                                facility_id = item.Id
                            };
                            _service.SaveApartmentFacility(aptFac);
                        }
                    }

                    foreach (var item in facList)
                    {
                        if (facIds.IndexOf(item.apartment_facility_id) == -1)
                            _service.DeleteApartmentFacility(item);
                    }

                    foreach (var item in model.ContentList)
                    {
                        var content = _service.GetApartmentContentById(item.Id) ?? new apartment_content()
                        {
                            apartment_content_id = 0,
                            apartment_id = apartment.apartment_id
                        };

                        content.name = item.Name;
                        content.description = item.Description;
                        content.language = item.Language;
                        _service.SaveApartmentContent(content);
                    }

                    scope.Complete();
                }
            }
            catch (Exception e)
            {
                ExceptionContent(HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpGet]
        [Route("GetAllFacilities")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public List<FacilityModel> GetAllFacilities()
        {
            return _service.GetAllFacilities().Select(p => new FacilityModel()
            {
                Id = p.facility_id,
                Content = new FacilityContentModel()
                {
                    Name = p.facility_content.FirstOrDefault(q => q.language == 1).name
                }
            }).ToList();
        }

        [HttpPost]
        [Route("PostFile")]
        public void PostFile()
        {
            string sPath = "";
            sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Upload/file");

            System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;

            for (int i = 0; i <= hfc.Count - 1; i++)
            {
                System.Web.HttpPostedFile hpf = hfc[i];
                if (hpf.ContentLength > 0)
                {
                    using (var reader = ExcelReaderFactory.CreateReader(hpf.InputStream))
                    {
                        var result = reader.AsDataSet();
                        var dataTable = result.Tables[0];
                        var row1 = dataTable.Rows[0][0];
                        var row2 = dataTable.Rows[7][1];
                    }
                }
            }
        }

        protected override void Dispose(bool disposing)
        {
            _service.Dispose();
            base.Dispose(disposing);
        }
    }
}
