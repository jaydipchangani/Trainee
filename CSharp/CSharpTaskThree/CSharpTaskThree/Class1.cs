using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DotNetTask2
{
    static class Class1
    {

        public static bool isNull(this string s)
        {
            if (string.IsNullOrEmpty(s))
            {
                return true;
            }
            return false;
        }

        public static bool isValidEmail(this string e)
        {
            Regex validateEmailRegex = new Regex("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");

            if (validateEmailRegex.IsMatch(e))
            {
                return false;
            }
            return true;
        }

        public static bool isValidPhone(this string m)
        {
            if (m.Length == 10 && Regex.IsMatch(m, @"^\d{10}$"))
            {
                return false;
            }
            return true;
        }

        public static bool IsValidSalary(this int salary)
        {
            return salary >= 20000 && salary <= 100000; // Salary should be within valid range
        }


    }
}
