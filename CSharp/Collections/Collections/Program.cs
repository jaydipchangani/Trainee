using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Collections
{
    class Program
    {
        static void Main(string[] args)
        {
            List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8 };
            numbers.Add(10);

            var add = numbers.Where(n => n > 5);

            foreach (var item in add)
            {
                Console.WriteLine(item);
            }

            Dictionary<int, string> students = new Dictionary<int, string>();
            students.Add(1, "John");
            students.Add(2, "Jane");
            students.Add(3, "Doe");

            foreach (var i in students)
            {
                Console.WriteLine(i.Key + " " + i.Value);
            }

            Queue<string> customers = new Queue<string>();
            customers.Enqueue("John");
            customers.Enqueue("Jane");

            Console.Write(customers.Dequeue());


            List<int> nums = new List<int>();

            Console.WriteLine("Enter the limit: ");
            int limit = Convert.ToInt32(Console.ReadLine());

            for (int i=1; i <=limit; i++)
            {
                Console.WriteLine($"Enter {i} Number: ");
                int n =Convert.ToInt32(Console.ReadLine());
                nums.Add(n);
            }

            foreach (var item in nums)
            {
                Console.WriteLine(item);
            }




        }
    }
}
