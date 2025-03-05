using System;
using System.IO;

namespace ConsoleApp3
{
    class Program
    {
        enum Marks {Best,Good,Avg, Poor }
        static void Main(string[] args)
        {
            Console.WriteLine("Enter the marks");
            int marks = Convert.ToInt32(Console.ReadLine());

            if (marks > 100 || marks < 0)
            {
                throw new ArithmeticException("Marks should be between 0 to 100");
            }
            else
            {

                if (marks > 90)
                {
                    Console.WriteLine(Marks.Best);
                }
                else if (marks > 70)
                {
                    Console.WriteLine(Marks.Good);
                }
                else if (marks > 50)
                {
                    Console.WriteLine(Marks.Avg);
                }
                else
                {
                    Console.WriteLine(Marks.Poor);
                }
            }

            string name = "Jaydip";

            File.WriteAllText("test.txt", name);

            Console.WriteLine(File.ReadAllText("test.txt"));

            File.AppendAllText("test.txt", " Changani");
            Console.WriteLine(File.ReadAllText("test.txt"));

            int[] arr = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
            try
            {
                Console.WriteLine(arr[11]);
            }
            catch (IndexOutOfRangeException e)
            {
                Console.WriteLine(e.Message);
            }
            finally
            {
                Console.WriteLine("Finally block");    
            }


        }
    }
}
