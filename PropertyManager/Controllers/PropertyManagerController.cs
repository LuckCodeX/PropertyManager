﻿using System;
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
        [ACLFilter(AccessRoles = new int[] { (int)RoleAdmin.SuperAdmin, (int)RoleAdmin.ApartmentManager, (int)RoleAdmin.CustomerManager })]
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
            {(int) RoleAdmin.SuperAdmin, (int) RoleAdmin.ApartmentManager, (int) RoleAdmin.CustomerManager})]
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
    }
}
