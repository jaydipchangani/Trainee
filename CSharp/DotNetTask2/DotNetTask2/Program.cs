
//Console.WriteLine("Task 1");
//File.WriteAllText("test.txt", "Hello Welcome to task 2");
//Console.WriteLine("File  created a file and add some text");

//Console.WriteLine("\nTask 2");
//File.WriteAllText("test.txt", "Hello Welcome to task 2 subtask 2-2");
//string fileData = File.ReadAllText("test.txt");
//Console.WriteLine(fileData);

//Console.WriteLine("\nTask 3");
//string[] arr = { "a", "b", "c", "d", "e", "f" };
//File.WriteAllLines("test.txt", arr);
//string arrayFile = File.ReadAllText("test.txt");
//Console.WriteLine(arrayFile);

//Console.WriteLine("\nTask 4");
//File.AppendAllText("test.txt", "Hello How are you ?");
//Console.WriteLine(File.ReadAllText("test.txt"));

//Console.WriteLine("\nTask 5");
//Console.WriteLine(File.ReadAllLines("test.txt").First());

//Console.WriteLine("\nTask 6");
//var len=File.ReadAllLines("test.txt").Length;
//Console.WriteLine(len);

// User Data

using System.ComponentModel;
using DotNetTask2;

Console.WriteLine("Enter First Name:");
string firstName=Console.ReadLine();

while(firstName.isNull())
{
    Console.WriteLine("Enter First Name Again");
    firstName = Console.ReadLine();
}

Console.WriteLine("Enter Last Name:");
string lasttName = Console.ReadLine();

 while(lasttName.isNull())
{
    Console.WriteLine("Enter Last Name Again");
    lasttName = Console.ReadLine();
}


Console.WriteLine("Enter Gender:");
string gender = Console.ReadLine();

while (gender.isNull())
{
    Console.WriteLine("Enter Gender Again");
    gender = Console.ReadLine();
}


Console.WriteLine("Enter Email Address:");
string email = Console.ReadLine();

while (email.isValidEmail())
{
    Console.WriteLine("Email is not Valid, Enter Email Again");
    email = Console.ReadLine();
}

Console.WriteLine("Enter Phone Number:");
string phone = Console.ReadLine();

while (phone.isValidPhone())
{
    Console.WriteLine("Enter Phone Again");
    phone = Console.ReadLine();
}

Console.WriteLine("Enter Designation :");
string designation = Console.ReadLine().ToLower();

while (designation.isValidDesignantion())
{
    Console.WriteLine("Enter Designation again, not valid designantion");
    designation = Console.ReadLine();
}

Console.WriteLine("Enter Salary :");
Int32 salary = Convert.ToInt32(Console.ReadLine());
while (salary.isValidSalary())
{
    Console.WriteLine("Not Valid Salary, Enter Again"); 
    salary = Convert.ToInt32(Console.ReadLine());
}





