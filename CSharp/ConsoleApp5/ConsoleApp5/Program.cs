using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp5
{
    class Program
    {
        static void Print <T>(T values)
            {
                Console.WriteLine(values);
            }

        static void Main()
        {
            Print<string>("JD");
            Print<int>(12);
            Print<double>(2.65956);
        }
    }
}
