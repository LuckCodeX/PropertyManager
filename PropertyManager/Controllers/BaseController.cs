using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PropertyManager.Controllers
{
    public class BaseController : ApiController
    {
        public void ExceptionContent(HttpStatusCode code, string message)
        {
            var response = new HttpResponseMessage(code)
            {
                ReasonPhrase = message
            };
            response.Headers.Add("status", message);
            throw new HttpResponseException(response);
        }
    }
}
