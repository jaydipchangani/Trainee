using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.BackgroundColor = ConsoleColor.Blue;
            Console.ForegroundColor = ConsoleColor.White;
            Console.Title = "Understanding Console Class";

            Console.Write("Enter your Name ");
            string name = Console.ReadLine();

            Console.Write("Enter your Birth Year ");
            decimal year = Convert.ToDecimal(Console.ReadLine());

            year = year - 100;
            Console.WriteLine($"Your name is {name} and your age is {year}");

            int var1 = Console.Read();
            Console.WriteLine($"ASCII Value of the Entered Key is: {var1}");
        }
    }
}
