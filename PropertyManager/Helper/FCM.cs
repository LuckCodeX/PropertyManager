using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FCM.Net;

namespace PropertyManager.Helper
{
    public class FCM
    {
        public static async Task PushFCM(List<string> registrationIds, string title, string body)
        {
            using (var sender = new Sender("AAAAUcB2cus:APA91bEde4rLq-ndvGQEylKby-1ECyNfNAczENlV_3DSQYpahR7pkRkzgbGxE2C7OQ8v0wC04abaRS9mGH5sMjmmGBe9tZIycJJD-WhCjpmfTtxWI0YcssyTP5QFEQh0Y1Tf1fTDT9rU"))
            {
                var message = new Message
                {
                    RegistrationIds = registrationIds,
                    Notification = new Notification
                    {
                        Title = title,
                        Body = body
                    }
                };
                var result = await sender.SendAsync(message);
            }
        }
    }
}