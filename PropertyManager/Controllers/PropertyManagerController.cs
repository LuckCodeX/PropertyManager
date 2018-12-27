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

        #region Account

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
        [Route("GetAllSaleAccount")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.CustomerManager, (int) RoleAdmin.CustomerEmployee})]
        public List<AdminModel> GetAllSaleAccount()
        {
            var admins = _service.GetAllSaleAccount();
            return admins.Select(p => new AdminModel()
            {
                Id = p.admin_id,
                Username = p.username,
                FullName = p.full_name,
                Phone = p.phone,
                Email = p.email,
                BankAccount = p.bank_account,
                BankName = p.bank_name,
                BankNumber = p.bank_number,
                BankBranch = p.bank_branch
            }).ToList();
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
                    ParentId = admin.parent_id,
                    FullName = admin.full_name,
                    Phone = admin.phone,
                    Email = admin.email,
                    BankAccount = admin.bank_account,
                    BankName = admin.bank_name,
                    BankNumber = admin.bank_number,
                    BankBranch = admin.bank_branch
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
            acc.full_name = model.FullName;
            acc.phone = model.Phone;
            acc.email = model.Email;
            acc.bank_account = model.BankAccount;
            acc.bank_branch = model.BankBranch;
            acc.bank_name = model.BankName;
            acc.bank_number = model.BankNumber;
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

        [HttpPost]
        [Route("CreateUserProfile")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.CustomerManager, (int) RoleAdmin.CustomerEmployee})]
        public UserProfileModel CreateUserProfile(UserProfileModel model)
        {
            var userProfile = _service.GetUserProfileByEmail(model.Email);
            if (!Equals(userProfile, null))
            {
                ExceptionContent(HttpStatusCode.Unauthorized, "Email đã tồn tại");
            }
            userProfile = new user_profile()
            {
                user_profile_id = 0,
                status = 1,
                full_name = model.FullName,
                email = model.Email,
                created_date = ConvertDatetime.GetCurrentUnixTimeStamp(),
            };
            _service.SaveUserProfile(userProfile);

            var userAccount = new user_account()
            {
                user_profile_id = userProfile.user_profile_id,
                email = model.Email,
                password = Encrypt.EncodePassword(model.Password),
                user_account_id = 0
            };
            _service.SaveUserAccount(userAccount);

            return new UserProfileModel()
            {
                Id = userProfile.user_profile_id,
                Email = userProfile.email,
                FullName = userProfile.full_name
            };
        }

        [HttpGet]
        [Route("GetListUserProfile/{search?}")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.CustomerManager, (int) RoleAdmin.CustomerEmployee})]
        public List<UserProfileModel> GetListUserProfile(string search = null)
        {
            var userProfiles = _service.GetListUserProfile(search);
            return userProfiles.Take(10).Select(p => new UserProfileModel()
            {
                Id = p.user_profile_id,
                Email = p.email,
                FullName = p.full_name,
                Phone = p.phone,
                Identification = p.identification
            }).ToList();
        }

        #endregion

        #region Apartment

        [HttpGet]
        [Route("GetListApartment/{page}/{status}/{search?}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public PagingResult<ApartmentModel> GetListApartment(int page, int status, string search = null)
        {
            var apartments = _service.GetListApartment(status, search);
            var apartmentList = apartments.Skip((page - 1) * 10).Take(10).Select(p => new ApartmentModel()
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
                    FullName = p.user_profile.full_name,
                    Phone = p.user_profile.phone
                },
                ImgList = p.aparment_image.Where(q => q.type == 0).OrderBy(q => q.type).Select(q => new ApartmentImageModel()
                {
                    Id = q.apartment_image_id,
                    Type = q.type,
                    Img = q.img
                }).ToList()
            }).ToList();
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
                    FullName = apartment.user_profile.full_name,
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

        [HttpPost]
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

        [HttpPost]
        [Route("CreateApartment")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.CustomerEmployee, (int) RoleAdmin.CustomerManager})]
        public ApartmentModel CreateApartment(ApartmentModel model)
        {
            var userProfile = new user_profile()
            {
                user_profile_id = 0,
                email = model.UserProfileOwner.Email,
                full_name = model.UserProfileOwner.FullName,
                phone = model.UserProfileOwner.Phone,
                status = 1,
                created_date = ConvertDatetime.GetCurrentUnixTimeStamp()
            };
            _service.SaveUserProfile(userProfile);

            var userAccount = new user_account()
            {
                user_account_id = 0,
                email = model.UserProfileOwner.Email,
                password = model.UserProfileOwner.Password,
                user_profile_id = userProfile.user_profile_id
            };
            _service.SaveUserAccount(userAccount);

            var apartment = new apartment()
            {
                apartment_id = 0,
                project_id = model.ProjectId,
                address = model.Address,
                latitude = model.Latitude,
                longitude = model.Longitude,
                building = model.Building,
                no_apartment = model.NoApartment,
                area = model.Area,
                no_bedroom = model.NoBedRoom,
                user_profile_owner_id = userProfile.user_profile_id
            };
            _service.SaveApartment(apartment);

            model.Id = apartment.apartment_id;
            model.UserProfileOwner.Id = userProfile.user_profile_id;
            return model;
        }

        [HttpGet]
        [Route("GetListAllTypeApartment/{search?}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin, (int)RoleAdmin.CustomerEmployee, (int)RoleAdmin.CustomerManager })]
        public List<ApartmentModel> GetListAllTypeApartment(string search = null)
        {
            var apartments = _service.SearchAllApartmentByCode(search);
            return apartments.Take(10).Select(p => new ApartmentModel()
            {
                Id = p.apartment_id,
                Code = p.code,
                Address = p.address,
                Area = p.area,
                NoBedRoom = p.no_bedroom,
                ProjectId = p.project_id,
                Building = p.building,
                NoApartment = p.no_apartment,
                UserProfileOwner = new UserProfileModel()
                {
                    Id = p.user_profile.user_profile_id,
                    FullName = p.user_profile.full_name,
                    Phone = p.user_profile.phone,
                    Identification = p.user_profile.identification,
                    TaxCode = p.user_profile.tax_code,
                    BankAccount = p.user_profile.bank_account,
                    BankBranch = p.user_profile.bank_branch,
                    BankName = p.user_profile.bank_name,
                    BankNumber = p.user_profile.bank_number
                }
            }).ToList();
        }

        [HttpGet]
        [Route("GetAllProject")]
        public List<ProjectModel> GetAllProject()
        {
            return _service.GetAllProject().Select(p => new ProjectModel()
            {
                Id = p.project_id,
                Name = _service.ConvertProjectContentToModel(p.project_content.FirstOrDefault(q => q.language == 0)).Name,
                Type = p.type,
                Img = p.img,
                Logo = p.logo
            }).ToList();
        }

        #endregion

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
        [Route("PostApartmentFile")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public void PostApartmentFile()
        {
            //string sPath = "";
            //sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Upload/file");

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
                        using (var scope = new TransactionScope())
                        {
                            try
                            {
                                //var lst = new List<apartment>();
                                for (int j = 2; j < dataTable.Rows.Count; j++)
                                {
                                    if (dataTable.Rows[j][0].ToString().Length == 0)
                                        continue;
                                    var project = _service.GetProjectByName(dataTable.Rows[j][0].ToString());
                                    if (Equals(project, null))
                                    {
                                        project = new project()
                                        {
                                            status = 1,
                                            project_id = 0,
                                        };
                                        _service.SaveProject(project);

                                        var content = new project_content()
                                        {
                                            project_id = project.project_id,
                                            language = 0,
                                            name = dataTable.Rows[j][0].ToString(),
                                            project_content_id = 0
                                        };
                                        _service.SaveProjectContent(content);
                                    }

                                    var userProfile =
                                        _service.GetUserProfileByNameAndPhone(dataTable.Rows[j][5].ToString(), dataTable.Rows[j][6].ToString());
                                    if (Equals(userProfile, null))
                                    {
                                        userProfile = new user_profile()
                                        {
                                            user_profile_id = 0,
                                            status = 4,
                                            full_name = dataTable.Rows[j][5].ToString(),
                                            phone = dataTable.Rows[j][6].ToString(),
                                            created_date = ConvertDatetime.GetCurrentUnixTimeStamp()
                                        };
                                        _service.SaveUserProfile(userProfile);
                                    }

                                    var apartment = new apartment()
                                    {
                                        project_id = project.project_id,
                                        status = 4,
                                        building = dataTable.Rows[j][1].ToString(),
                                        no_apartment = dataTable.Rows[j][2].ToString(),
                                        area = Convert.ToDecimal(dataTable.Rows[j][3]),
                                        no_bedroom = Convert.ToInt32(dataTable.Rows[j][4]),
                                        user_profile_owner_id = userProfile.user_profile_id,
                                        type = 1,
                                        code = "AID_" + userProfile.user_profile_id.ToString().PadLeft(5, '0') + "_001",
                                    };
                                    _service.SaveApartment(apartment);
                                    //lst.Add(apartment);
                                }
                                scope.Complete();
                                //_service.SaveListApartment(lst);
                            }
                            catch (Exception e)
                            {
                                ExceptionContent(HttpStatusCode.InternalServerError, e.Message);
                            }
                        }
                    }
                }
            }
        }

        #region Visit List

        [HttpGet]
        [Route("GetListUserVisit/{page}/{status}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin, (int)RoleAdmin.CustomerManager })]
        public PagingResult<UserVisitModel> GetListUserVisit(int page, int status)
        {
            var visits = _service.SearchListUserVisit(status);
            var visitList = visits.Select(p => new UserVisitModel()
            {
                UserProfile = new UserProfileModel()
                {
                    Id = p.user_profile_id,
                    FullName = p.user_profile.full_name,
                    Phone = p.user_profile.phone,
                    Email = p.user_profile.email
                },
                CreatedAt = p.created_at,
                Id = p.user_visit_id,
                TotalItems = p.user_visit_item.Count,
                Status = p.status
            }).Skip((page - 1) * 10).Take(10).ToList();
            return new PagingResult<UserVisitModel>()
            {
                total = visits.Count,
                data = visitList
            };
        }

        [HttpDelete]
        [Route("DeleteUserVisit/{id}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin, (int)RoleAdmin.CustomerManager })]
        public void DeleteUserVisit(int id)
        {
            var userVisit = _service.GetUserVisitById(id);
            if (!Equals(userVisit, null))
                _service.DeleteUserVisit(userVisit);
        }

        [HttpGet]
        [Route("GetUserVisitDetail/{id}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin, (int)RoleAdmin.CustomerManager })]
        public UserVisitModel GetUserVisitDetail(int id)
        {
            var visit = _service.GetUserVisitById(id);
            if (!Equals(visit, null))
            {
                return new UserVisitModel()
                {
                    Id = visit.user_visit_id,
                    CreatedAt = visit.created_at,
                    Status = visit.status,
                    UserProfile = new UserProfileModel()
                    {
                        Id = visit.user_profile_id,
                        FullName = visit.user_profile.full_name,
                        Phone = visit.user_profile.phone,
                        Email = visit.user_profile.email
                    },
                    Items = visit.user_visit_item.Select(p => new UserVisitItemModel()
                    {
                        Id = p.user_visit_item_id,
                        Status = p.status,
                        Apartment = new ApartmentModel()
                        {
                            Id = p.apartment_id,
                            Code = p.apartment.code,
                            Address = p.apartment.address,
                            ImgList = p.apartment.aparment_image.Where(q => q.type == 0).Select(q => new ApartmentImageModel()
                            {
                                Id = q.apartment_image_id,
                                Type = q.type,
                                Img = q.img
                            }).ToList(),
                        },
                        Histories = p.user_visit_history.Select(q => new UserVisitHistoryModel()
                        {
                            Id = q.user_visit_history_id,
                            ActualDate = q.actual_date,
                            ExpectedDate = q.expected_date
                        }).ToList()
                    }).ToList()
                };
            }
            return new UserVisitModel();
        }

        [HttpPost]
        [Route("SaveUserVisit")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin, (int)RoleAdmin.CustomerManager })]
        public void SaveUserVisit(UserVisitModel model)
        {
            var visit = _service.GetUserVisitById(model.Id);
            if (!Equals(visit, null))
            {
                var userProfile = _service.GetUserProfileById(model.UserProfile.Id);
                if (!Equals(userProfile, null))
                {
                    userProfile.phone = model.UserProfile.Phone;
                    _service.SaveUserProfile(userProfile);
                }
                visit.status = model.Status;
                _service.SaveUserVisit(visit);

                foreach (var item in model.Items)
                {
                    var visitItem = _service.GetUserVisitItemById(item.Id);
                    visitItem.status = item.Status;
                    _service.SaveUserVisitItem(visitItem);

                    foreach (var history in item.Histories)
                    {
                        var his = _service.GetUserVisitHistoryById(history.Id);
                        if (Equals(his, null))
                        {
                            his = new user_visit_history()
                            {
                                user_visit_history_id = 0,
                                user_visit_item_id = visitItem.user_visit_item_id
                            };
                        }

                        his.actual_date = history.ActualDate;
                        his.expected_date = history.ExpectedDate;
                        _service.SaveUserVisitHistory(his);
                    }
                }
            }
        }

        #endregion

        #region Maid

        [HttpPost]
        [Route("SaveMaid")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin, (int)RoleAdmin.MaidManager })]
        public void SaveMaid(EmployeeModel model)
        {
            var maid = _service.GetMaidById(model.Id);
            if (Equals(maid, null))
            {
                maid = new employee()
                {
                    employee_id = 0,
                    status = 1,
                    username = model.Username,
                    created_date = ConvertDatetime.GetCurrentUnixTimeStamp()
                };
            }

            maid.birthday = model.Birthday;
            maid.code = model.Code;
            maid.first_name = model.FirstName;
            maid.last_name = model.LastName;
            maid.phone = model.Phone;
            maid.role = model.Role;
            maid.type = model.Type;
            if (!Equals(model.Password))
                maid.password = Encrypt.EncodePassword(model.Password);
            _service.SaveEmployee(maid);
        }

        [HttpPost]
        [Route("GetListMaid")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin, (int)RoleAdmin.MaidManager })]
        public PagingResult<EmployeeModel> GetListMaid(FilterModel filter)
        {
            var maids = _service.SearchListActiveMaid(filter);
            var maidList = maids.Skip((filter.Page - 1) * filter.Limit).Take(filter.Limit)
                .Select(p => new EmployeeModel()
                {
                    Id = p.employee_id,
                    Username = p.username,
                    Phone = p.phone,
                    Birthday = p.birthday,
                    Type = p.type,
                    Role = p.role,
                    Code = p.code,
                    FirstName = p.first_name,
                    LastName = p.last_name,
                    RoleName = _service.GetEmployeeRoleName(p.role),
                    Statistic = new StatisticModel()
                    {
                        Room1 = p.contract_employee.Count(q => Equals(q.to_date, null) && q.contract.no_bedroom == 1 && ((filter.FromDate <= q.from_date && q.from_date <= filter.ToDate) || q.from_date <= filter.FromDate)),
                        Room2 = p.contract_employee.Count(q => Equals(q.to_date, null) && q.contract.no_bedroom == 2 && ((filter.FromDate <= q.from_date && q.from_date <= filter.ToDate) || q.from_date <= filter.FromDate)),
                        Room3 = p.contract_employee.Count(q => Equals(q.to_date, null) && q.contract.no_bedroom >= 3 && ((filter.FromDate <= q.from_date && q.from_date <= filter.ToDate) || q.from_date <= filter.FromDate)),
                    }
                }).ToList();
            return new PagingResult<EmployeeModel>()
            {
                total = maids.Count,
                data = maidList
            };
        }

        [HttpDelete]
        [Route("DeleteMaid/{id}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin, (int)RoleAdmin.MaidManager })]
        public void DeleteMaid(int id)
        {
            var maid = _service.GetActiveMaidById(id);
            if (!Equals(maid, null))
            {
                maid.status = 2;
                _service.SaveEmployee(maid);
            }
        }

        [HttpGet]
        [Route("GetAllMaid")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin, (int)RoleAdmin.MaidManager })]
        public List<EmployeeModel> GetAllMaid()
        {
            var maids = _service.GetAllActiveMaid();
            return maids.Select(p => new EmployeeModel()
            {
                Id = p.employee_id,
                FirstName = p.first_name,
                LastName = p.last_name,
                Code = p.code
            }).ToList();
        }

        [HttpPost]
        [Route("GetListMaidApartment")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.MaidManager})]
        public PagingResult<ContractModel> GetListMaidApartment(FilterModel filter)
        {
            var contracts = _service.SearchListContract(filter);
            var contractList = contracts.Skip((filter.Page - 1) * filter.Limit).Take(filter.Limit).Select(p => new ContractModel()
            {
                Id = p.contract_id,
                Code = p.code,
                Apartment = new ApartmentModel()
                {
                    Code = p.apartment.code,
                    Project = p.apartment.project_id != null ? new ProjectModel()
                    {
                        Name = p.apartment.project.project_content.FirstOrDefault(q => q.language == 0).name
                    } : new ProjectModel(),
                    Resident = new UserProfileModel()
                    {
                        FullName = p.resident_name,
                        Phone = p.resident_phone,
                        Id = p.user_profile1.user_profile_id,
                        NoteList = p.user_profile1.user_profile_note.Select(q => new UserProfileNoteModel()
                        {
                            Id = q.user_profile_note_id,
                            CreatedDate = q.created_date,
                            Note = q.note
                        }).ToList(),
                    },
                },
                Building = p.building,
                NoApartment = p.no_apartment,
                Address = p.address,
                OwnerName = p.owner_name,
                OwnerPhone = p.owner_phone,
                ResidentName = p.resident_name,
                ResidentPhone = p.resident_phone,
                NoBedRoom = p.no_bedroom,
                StartDate = p.start_date,
                EndDate = p.end_date,
                Area = p.area,
                PassWifi = p.pass_wifi,
                PassDoor = p.pass_door,
                Maid = _service.GetMaidModelByContractId(p.contract_id)
            })
                .ToList();
            return new PagingResult<ContractModel>()
            {
                data = contractList,
                total = contracts.Count
            };
        }

        [HttpPost]
        [Route("SaveMaidApartment")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.MaidManager})]
        public void SaveMaidApartment(ContractModel model)
        {
            using (var scope = new TransactionScope())
            {
                try
                {
                    var contractEmployee = _service.GetLastContractEmployeeByContractId(model.Id);
                    if (Equals(contractEmployee, null))
                    {
                        contractEmployee = new contract_employee()
                        {
                            contract_employee_id = 0,
                            status = 1,
                            from_date = ConvertDatetime.GetCurrentUnixTimeStamp(),
                            employee_id = model.Maid.Id
                        };
                    }
                    else if (contractEmployee.employee_id != model.Maid.Id)
                    {
                        contractEmployee.to_date = ConvertDatetime.GetCurrentUnixTimeStamp();
                        contractEmployee.status = 0;
                        _service.SaveContractEmployee(contractEmployee);

                        contractEmployee = new contract_employee()
                        {
                            contract_employee_id = 0,
                            status = 1,
                            from_date = ConvertDatetime.GetCurrentUnixTimeStamp(),
                            employee_id = model.Maid.Id,
                            contract_id = model.Id
                        };
                    }

                    contractEmployee.work_date = string.Join(",", model.Maid.WorkDate);
                    contractEmployee.work_hour = model.Maid.WorkHour;
                    _service.SaveContractEmployee(contractEmployee);

                    scope.Complete();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        [HttpPost]
        [Route("CreateEmployeeNote")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.MaidManager})]
        public void CreateEmployeeNote(EmployeeNoteModel model)
        {
            var note = new employee_note()
            {
                employee_note_id = 0,
                created_date = ConvertDatetime.GetCurrentUnixTimeStamp(),
                employee_id = model.EmployeeId,
                note = model.Note
            };
            _service.SaveEmployeeNote(note);
        }

        [HttpDelete]
        [Route("DeleteEmployeeNote/{id}")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.MaidManager})]
        public void DeleteEmployeeNote(int id)
        {
            _service.DeleteEmployeeNote(id);
        }

        #endregion

        #region Issue

        [HttpGet]
        [Route("GetAllIssue")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public List<IssueModel> GetAllIssue()
        {
            var issues = _service.GetAllIssue();
            return issues.Select(p => new IssueModel()
            {
                Id = p.issue_id,
                Name = p.name,
                Description = p.description
            }).ToList();
        }

        [HttpGet]
        [Route("GetIssueDetail/{id}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public IssueModel GetIssueDetail(int id)
        {
            var issue = _service.GetIssueById(id);
            if (Equals(issue, null))
                ExceptionContent(HttpStatusCode.MethodNotAllowed, "Dữ liệu không tồn tại");
            return new IssueModel()
            {
                Id = issue.issue_id,
                Name = issue.name,
                Description = issue.description
            };
        }

        [HttpPost]
        [Route("SaveIssue")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public void SaveIssue(IssueModel model)
        {
            var issue = _service.GetIssueById(model.Id);
            if (Equals(issue, null))
                issue = new issue()
                {
                    issue_id = 0,
                    status = 1
                };
            issue.name = model.Name;
            issue.description = model.Description;
            _service.SaveIssue(issue);
        }

        [HttpDelete]
        [Route("DeleteIssue/{id}")]
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin })]
        public void DeleteIssue(int id)
        {
            var issue = _service.GetIssueById(id);
            if (!Equals(issue, null))
            {
                issue.status = 2;
                _service.SaveIssue(issue);
            }
        }

        #endregion

        #region Contract

        [HttpPost]
        [Route("CreateContract")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.CustomerManager, (int) RoleAdmin.CustomerEmployee})]
        public void CreateContract(ContractModel model)
        {
            try
            {
                using (var scope = new TransactionScope())
                {
                    //if (!Equals(model.UserProfile.Id, null))
                    //{
                    var userProfile = _service.GetUserProfileById(model.UserProfile.Id);
                    userProfile.full_name = model.UserProfile.FullName;
                    userProfile.phone = model.UserProfile.Phone;
                    userProfile.identification = model.UserProfile.Identification;
                    _service.SaveUserProfile(userProfile);
                    //}

                    //if (!Equals(model.OwnerUserProfileId, null))
                    //{
                    var ownerUserProfile = _service.GetUserProfileById(model.OwnerUserProfile.Id);
                    ownerUserProfile.full_name = model.OwnerUserProfile.FullName;
                    ownerUserProfile.identification = model.OwnerUserProfile.Identification;
                    ownerUserProfile.tax_code = model.OwnerUserProfile.TaxCode;
                    ownerUserProfile.bank_name = model.OwnerUserProfile.BankName;
                    ownerUserProfile.bank_account = model.OwnerUserProfile.BankAccount;
                    ownerUserProfile.bank_branch = model.OwnerUserProfile.BankBranch;
                    ownerUserProfile.bank_number = model.OwnerUserProfile.BankNumber;
                    ownerUserProfile.phone = model.OwnerUserProfile.Phone;
                    _service.SaveUserProfile(ownerUserProfile);
                    //}

                    //if (!Equals(model.AdminId, null))
                    //{
                    var admin = _service.GetAdminById(model.Admin.Id);
                    admin.full_name = model.Admin.FullName;
                    admin.phone = model.Admin.Phone;
                    admin.bank_name = model.Admin.BankName;
                    admin.bank_account = model.Admin.BankAccount;
                    admin.bank_number = model.Admin.BankNumber;
                    admin.bank_branch = model.Admin.BankBranch;
                    _service.SaveAdmin(admin);
                    //}

                    //if (!Equals(model.CompanyId, null))
                    //{
                    var company = _service.GetCompanyById(model.Company.Id);
                    company.name = model.Company.Name;
                    company.address = model.Company.Address;
                    company.tax_code = model.Company.TaxCode;
                    company.bank_name = model.Company.BankName;
                    company.bank_account = model.Company.BankAccount;
                    company.bank_branch = model.Company.BankBranch;
                    company.bank_number = model.Company.BankNumber;
                    _service.SaveCompany(company);
                    //}

                    //if (!Equals(model.ApartmentId, null))
                    //{
                    var apartment = _service.GetApartmentById(model.Apartment.Id);
                    apartment.address = model.Apartment.Address;
                    apartment.latitude = model.Apartment.Latitude;
                    apartment.longitude = model.Apartment.Longitude;
                    apartment.no_apartment = model.Apartment.NoApartment;
                    apartment.building = model.Apartment.Building;
                    apartment.area = model.Apartment.Area;
                    apartment.no_bedroom = model.Apartment.NoBedRoom;
                    //}

                    var contract = _service.GetContractById(model.Id);
                    if (Equals(contract, null))
                        contract = new contract()
                        {
                            contract_id = 0,
                            created_date = ConvertDatetime.GetCurrentUnixTimeStamp(),
                            code = DateTime.Now.Year + "_" + _service.GetCountContractThisYear().Count.ToString().PadLeft(5, '0')
                        };
                    contract.type = model.Type;
                    contract.company_id = model.Company.Id;
                    contract.user_profile_id = model.UserProfile.Id;
                    contract.owner_user_profile_id = model.OwnerUserProfile.Id;
                    contract.apartment_id = model.Apartment.Id;
                    contract.building = model.Apartment.Building;
                    contract.no_apartment = model.Apartment.NoApartment;
                    contract.address = model.Apartment.Address;
                    contract.area = model.Apartment.Area;
                    contract.no_bedroom = model.Apartment.NoBedRoom;
                    contract.pass_wifi = model.Apartment.PassWifi;
                    contract.wifi_name = model.Apartment.WifiName;
                    contract.pass_door = model.Apartment.PassDoor;
                    contract.owner_name = model.OwnerUserProfile.FullName;
                    contract.owner_identification = model.OwnerUserProfile.Identification;
                    contract.owner_phone = model.OwnerUserProfile.Phone;
                    contract.owner_tax_code = model.OwnerUserProfile.TaxCode;
                    contract.owner_address = model.OwnerUserProfile.Address;
                    contract.owner_bank_account = model.OwnerUserProfile.BankAccount;
                    contract.owner_bank_name = model.OwnerUserProfile.BankName;
                    contract.owner_bank_number = model.OwnerUserProfile.BankNumber;
                    contract.owner_bank_branch = model.OwnerUserProfile.BankBranch;
                    contract.tenant_name = model.Company.Name;
                    contract.tenant_address = model.Company.Address;
                    contract.tenant_tax_code = model.Company.TaxCode;
                    contract.tenant_bank_name = model.Company.BankName;
                    contract.tenant_bank_number = model.Company.BankNumber;
                    contract.tenant_bank_account = model.Company.BankAccount;
                    contract.tenant_bank_branch = model.Company.BankBranch;
                    contract.resident_name = model.UserProfile.FullName;
                    contract.resident_phone = model.UserProfile.Phone;
                    contract.resident_identification = model.UserProfile.Identification;
                    contract.admin_id = model.AdminId;
                    contract.start_date = model.StartDate;
                    contract.end_date = model.EndDate;
                    contract.parent_id = model.ParentId;
                    _service.SaveContract(contract);

                    scope.Complete();
                }
            }
            catch (Exception e)
            {
                ExceptionContent(HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpGet]
        [Route("SearchAllParentContract/{search?}")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.CustomerManager, (int) RoleAdmin.CustomerEmployee})]
        public List<ContractModel> SearchAllParentContract(string search = null)
        {
            var contracts = _service.SearchAllParentContract(search);
            return contracts.Take(10).Select(p => new ContractModel()
            {
                Id = p.contract_id,
                Code = p.code,
                Type = p.type
            }).ToList();
        }

        [HttpPost]
        [Route("GetListContract")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.CustomerManager, (int) RoleAdmin.CustomerEmployee})]
        public PagingResult<ContractModel> GetListContract(FilterModel filter)
        {
            var contracts = _service.SearchListContract(filter);
            var contractList = contracts.Skip((filter.Page - 1) * filter.Limit).Take(filter.Limit).Select(p => new ContractModel()
            {
                Id = p.contract_id,
                Code = p.code,
                Apartment = new ApartmentModel()
                {
                    Code = p.apartment.code,
                    Project = new ProjectModel()
                    {
                        Name = p.apartment.project.project_content.FirstOrDefault(q => q.language == 0).name
                    }
                },
                Building = p.building,
                NoApartment = p.no_apartment,
                Address = p.address,
                OwnerName = p.owner_name,
                OwnerPhone = p.owner_phone,
                ResidentName = p.resident_name,
                ResidentPhone = p.resident_phone,
                NoBedRoom = p.no_bedroom,
                StartDate = p.start_date,
                EndDate = p.end_date,
                Area = p.area,
                PassWifi = p.pass_wifi,
                PassDoor = p.pass_door
            }).ToList();
            return new PagingResult<ContractModel>()
            {
                data = contractList,
                total = contracts.Count
            };
        }

        #endregion


        #region Company

        [HttpGet]
        [Route("SearchAllCompany/{search?}")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.CustomerEmployee, (int) RoleAdmin.CustomerManager})]
        public List<CompanyModel> SearchAllCompany(string search = null)
        {
            var companies = _service.SearchAllCompany(search);
            return companies.Take(10).Select(p => new CompanyModel()
            {
                Id = p.company_id,
                Name = p.name,
                Phone = p.phone,
                Address = p.address,
                TaxCode = p.tax_code,
                BankName = p.bank_name,
                BankNumber = p.bank_number,
                BankAccount = p.bank_account,
                BankBranch = p.bank_branch
            }).ToList();
        }

        [HttpPost]
        [Route("CreateCompany")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.CustomerManager, (int) RoleAdmin.CustomerEmployee})]
        public CompanyModel CreateCompany(CompanyModel model)
        {
            var company = new company()
            {
                name = model.Name,
                address = model.Address,
                company_id = 0
            };
            _service.SaveCompany(company);

            model.Id = company.company_id;
            return model;
        }

        #endregion

        #region Problem

        [HttpPost]
        [Route("SaveProblem")]
        [ACLFilter(AccessRoles = new int[]
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.MaidManager})]
        public void SaveProblem(ProblemModel model)
        {
            using (var scope = new TransactionScope())
            {
                try
                {
                    var problem = _service.GetProblemById(model.Id);
                    if (Equals(problem, null))
                        problem = new problem()
                        {
                            problem_id = 0,
                            created_date = ConvertDatetime.GetCurrentUnixTimeStamp(),
                            apartment_id = model.ApartmentId,
                        };
                    problem.description = model.Description;
                    problem.issue_id = model.IssueId;
                    problem.priority = model.Priority;
                    problem.summary = model.Summary;
                    problem.type = model.Type;
                    problem.status = model.Status;
                    _service.SaveProblem(problem);

                    var imageList = _service.GetAllProblemImageByProblemId(problem.problem_id);
                    var images = new List<problem_image>();
                    int idx = 0;
                    foreach (var item in model.ListImage)
                    {
                        if (item.Id == 0 && !Equals(item.Img_Base64, null))
                        {
                            var img = new problem_image()
                            {
                                problem_id = problem.problem_id,
                                img = _service.SaveImage("~/Upload/problem/",
                                    "problem_" + ConvertDatetime.GetCurrentUnixTimeStamp() + "_" + idx + ".png",
                                    item.Img_Base64)
                            };
                            images.Add(img);
                            idx++;
                        }
                    }
                    _service.SaveListProblemImage(images);

                    foreach (var item in imageList)
                    {
                        var flag = false;
                        foreach (var img in model.ListImage)
                        {
                            if (item.problem_image_id == img.Id)
                            {
                                flag = true;
                                break;
                            }
                        }

                        if (!flag)
                            _service.DeleteProblemImage(item.problem_image_id);
                    }

                    scope.Complete();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        [HttpPost]
        [Route("CreateUserProfileNote")]
        public void CreateUserProfileNote(UserProfileNoteModel model)
        {
            IEnumerable<string> values;
            if (this.Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var admin = _service.GetAdminById(tokenModel.Id);
                var note = new user_profile_note()
                {
                    user_profile_note_id = 0,
                    user_profile_id = model.UserProfileId,
                    created_date = ConvertDatetime.GetCurrentUnixTimeStamp(),
                    note = model.Note,
                    admin_id = admin.admin_id
                };
                _service.SaveUserProfileNote(note);
            }
        }

        [HttpDelete]
        [Route("DeleteUserProfileNote/{id}")]
        public void DeleteUserProfileNote(int id)
        {
            _service.DeleteUserProfileNote(id);
        }

        [HttpPost]
        [Route("CreateProblemTracking")]
        public void CreateProblemTracking(ProblemTrackingModel model)
        {

        }




        #endregion

        protected override void Dispose(bool disposing)
        {
            _service.Dispose();
            base.Dispose(disposing);
        }
    }
}
