using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Helper
{
    public class ConvertDatetime
    {
        public static int GetCurrentUnixTimeStamp()
        {
            return (int)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds;
        }

        public static int GetBeginDayUnixTimeStamp()
        {
            var now = DateTime.Now;
            return (int)(new DateTime(now.Year, now.Month, now.Day, 0, 0, 0).ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
        }

        public static int GetEndDayUnixTimeStamp()
        {
            var now = DateTime.Now;
            return (int)(new DateTime(now.Year, now.Month, now.Day, 23, 59, 59).ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
        }

        public static int GetBeginMonthUnixTimeStamp()
        {
            var now = DateTime.Now;
            return (int)(new DateTime(now.Year, now.Month, 1, 0, 0, 0).ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
        }

        public static int GetEndMonthUnixTimeStamp()
        {
            var now = DateTime.Now;
            return (int)(new DateTime(now.Year, now.Month, DateTime.DaysInMonth(now.Year, now.Month), 23, 59, 59).ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
        }

        public static int GetBeginWeekUnixTimeStamp()
        {
            var now = DateTime.Now;
            int diff = (7 + (now.DayOfWeek - DayOfWeek.Monday)) % 7;
            DateTime fdowDate = now.AddDays(-1 * diff).Date;
            return (int)(new DateTime(fdowDate.Year, fdowDate.Month, fdowDate.Day, 0, 0, 0).ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
        }

        public static int GetEndWeekUnixTimeStamp()
        {
            var now = DateTime.Now;
            int diff = (7 + (now.DayOfWeek - DayOfWeek.Monday)) % 7;
            DateTime fdowDate = now.AddDays(-1 * diff).Date.AddDays(6);
            return (int)(new DateTime(fdowDate.Year, fdowDate.Month, fdowDate.Day, 23, 59, 59).ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
        }

        public static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dtDateTime;
        }

        public static string ConvertUnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dtDateTime.ToString("dd.MM.yyyy");
        }

        public static string GetDiffDate(int currentTime, int time)
        {
            return (currentTime - time) > 86400
                ? ConvertUnixTimeStampToDateTime(time)
                : (Math.Floor((double)(currentTime - time) / 3600) == 0 ? (Math.Ceiling((double)(currentTime - time) / 60) == 0 ? "vài giây trước" : Math.Ceiling((double)(currentTime - time) / 60) + " phút trước") : (Math.Floor((double)(currentTime - time) / 3600) + " giờ trước"));
        }

        public static int GetBeginYearUnixTimeStamp()
        {
            var now = DateTime.Now;
            return (int)(new DateTime(now.Year, 1, 1, 0, 0, 0).ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
        }

        public static int GetEndYearUnixTimeStamp()
        {
            var now = DateTime.Now;
            return (int)(new DateTime(now.Year, 12, 31, 0, 0, 0).ToUniversalTime() - new DateTime(1970, 1, 1)).TotalSeconds;
        }
    }
}