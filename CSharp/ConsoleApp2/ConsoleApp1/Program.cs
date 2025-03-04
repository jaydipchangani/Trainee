using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Human
    {
        public string name;
        public Human(string n)
        {
            name = n;
            Console.WriteLine($"Human name is {name}");
        }
        public void bonk()
        {
            Console.WriteLine("Bonk !!");
        }

    }


    class Man : Human
    {
        public string a = "I am man";

        public Man(string n) : base(n)
        {
        }
    }

    class Personal
    {
        public string name = "JD";
        private int salary;

        public int Salary
        {
            get { return salary; }
            set { salary = value; }
        }
    }

    class Animal
    {
        public virtual void sound()
        {
            Console.WriteLine("Animal Sound ");
        }


    }

    class Dog: Animal
    {
        public override void sound()
        {
            Console.WriteLine("Dog SOund");
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            Personal personal1 = new Personal();
            personal1.Salary = 10000;
            Console.WriteLine($"Personal salary is {personal1.Salary}");

            Human human1 = new Human("Jaydip");
            Console.WriteLine($"Callaing name using objects {human1.name}");

            Man man1 = new Man("jajak");
            man1.bonk();

            Dog d1 = new Dog();
            d1.sound();


        }
    }
}
