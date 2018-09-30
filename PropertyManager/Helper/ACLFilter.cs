using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Newtonsoft.Json;
using PropertyManager.Models;

namespace PropertyManager.Helper
{
    public class ACLFilter : ActionFilterAttribute
    {
        public int[] AccessRoles { get; set; }
        public override void OnActionExecuting(HttpActionContext filterContext)
        {
            IEnumerable<string> values;
            if (filterContext.Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                if (AccessRoles.All(p => p != tokenModel.Role))
                {
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.MethodNotAllowed)
                    {
                        ReasonPhrase = "Tài khoản của bạn không có quyền với chức năng này"
                    };
                    response.Headers.Add("status", "Tài khoản của bạn không có quyền với chức năng này");
                    throw new HttpResponseException(response);
                }
            }
            else
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.MethodNotAllowed)
                {
                    ReasonPhrase = "Tài khoản của bạn không có quyền với chức năng này"
                };
                response.Headers.Add("status", "Tài khoản của bạn không có quyền với chức năng này");
                throw new HttpResponseException(response);
            }
            base.OnActionExecuting(filterContext);
        }
    }
}