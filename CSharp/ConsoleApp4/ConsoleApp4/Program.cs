using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp4
{
    class Program
    {
        static int evenOdd(int n)
        {
            if ((n%2==0))
            {
                Console.WriteLine("Even");
                return 1;
            }
            else
            {
                Console.WriteLine("Odd");
                return 0;
            }
        }

        static void print(string name)
        {
            Console.WriteLine($"Hello, {name}");
        }

        static void forLoop(int a)
        {
            for (int i = 1; i < a; i++)
            {
                if(i%2==0)
                {
                    Console.WriteLine(i);
                }
            }
        }

        static void Main(string[] args)
        {
            evenOdd(5);

            print("John");

            forLoop(50);
        }
    }
}
