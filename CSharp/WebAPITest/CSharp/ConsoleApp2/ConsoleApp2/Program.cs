using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp2
{
    class Program
    {
        public static int Calculator()
        {
            Console.WriteLine("Enter the First Number");
            int num1 = Convert.ToInt32(Console.ReadLine());


            Console.WriteLine("Enter the Second Number");
            int num2 = Convert.ToInt32(Console.ReadLine());

            Console.WriteLine("Enter operator to do operation + - * / % @");
            string op = Console.ReadLine();

            switch (op)
            {
                case "+":
                    Console.WriteLine($"Sum is {num1 + num2}");
                    break;

                case "-":
                    Console.WriteLine($"Subtration is {num1 - num2}");
                    break;

                case "*":
                    Console.WriteLine($"Multiplication is {num1 * num2}");
                    break;

                case "/":
                    Console.WriteLine($"Division is {num1 / num2}");
                    break;

                case "%":
                    Console.WriteLine($"Reminder is {num1 % num2}");
                    break;

                default:
                    Console.WriteLine("Enter Proper value");
                    break;

            }

            Console.WriteLine("Enter 1 to get out");
            int again = Convert.ToInt32(Console.ReadLine());

            if (again == 1)
            {
                Console.WriteLine("thanks Bye !!");

            }
            else
            {
                    Calculator();
            }

            return 0;
        }
        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to C# Calculator \nEnter 1 to enter into calculator and any other key to get lost !!");
            int enter = Convert.ToInt32(Console.ReadLine());

            if (enter == 1)
            {
                Calculator();

            }
            else
            {
                Console.WriteLine("get Lost Bye !!");
            }
            

        }
    }
}
