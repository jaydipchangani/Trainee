using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DotNetTask2
{
    static class Class1
    {
        enum designantion { trainee, developer, qa , manager, projectmanager}

        public static bool isNull(this string s)
        {
            if (string.IsNullOrEmpty(s))
            {
                return true ;
            }
            return false;
        }

        public static bool isValidEmail(this string e)
        {
            Regex validateEmailRegex = new Regex("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");

            if (validateEmailRegex.IsMatch(e))
            {
                return false ;
            }
            return true;
        }

        public static bool isValidPhone(this string m)
        {
            if (m.Length == 10)
            {
                return false;
            }
            return true;
        }

        public static bool isValidSalary(this Int32 s)
        {
            if (s >= 10000 && s <= 50000)
            {
                return false;
            }
            return true;
        }

        public static bool isValidDesignantion(this string d)
        {
            if(Enum.IsDefined(typeof(designantion), d))
            {
                return false;
            }
            return true;
        }
    }
}
