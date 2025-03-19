using System.ComponentModel;
using System.Numerics;
using System.Text.Json;
using CSharpTaskThree;
using DotNetTask2;

public class Program
{
    static List<Employee> employees = new List<Employee>();
    public static void Main(string[] args)
    {

        static void Insertdata()
        {
            Console.WriteLine("Enter First Name:");
            string firstName = Console.ReadLine();

            while (firstName.isNull())
            {
                Console.WriteLine("Enter First Name Again");
                firstName = Console.ReadLine();
            }

            Console.WriteLine("Enter Last Name:");
            string lastName = Console.ReadLine();

            while (lastName.isNull())
            {
                Console.WriteLine("Enter Last Name Again");
                lastName = Console.ReadLine();
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

            string salaryInput;
            int salaryInt=0;

            do
            {
                Console.Write("Enter Salary: ");
                salaryInput = Console.ReadLine();

                // Check if salary is empty
                if (string.IsNullOrWhiteSpace(salaryInput))
                {
                    Console.WriteLine("Salary cannot be empty!");
                    continue; // Prompt again
                }

                // Try parsing the input
                if (!int.TryParse(salaryInput, out salaryInt))
                {
                    Console.WriteLine("Invalid salary! Salary must be a numeric value between 20,000 and 1,00,000.");
                    continue; // Prompt again
                }

                // Validate the salary range
                if (!salaryInt.IsValidSalary())
                {
                    Console.WriteLine("Invalid salary! Salary must be between 20,000 and 1,00,000.");
                }

            } while (!salaryInt.IsValidSalary()); // Keep asking until a valid salary is entered

            Console.WriteLine("Enter Password:");
            string password = Console.ReadLine();
            
            string encPassword= AesFunction.Encrypt(password);
            Console.WriteLine(encPassword);

            while (phone.isNull())
            {
                Console.WriteLine("Enter Password Againg, it should not null");
                password = Console.ReadLine();
            }

            employees.Add(new Employee(Guid.NewGuid(), firstName, lastName, email, phone, salaryInt, encPassword));

            Console.WriteLine("Employee added successfully!");

        }



        static void ViewEmployees()
        {
            if (employees.Count == 0)
            {
                Console.WriteLine("No employees found!");
                return;
            }

            Console.WriteLine("\nEmployee List:");
            foreach (var emp in employees)
            {
                Console.WriteLine($"ID: {emp.Id}, Name: {emp.FirstName} {emp.LastName}, Email: {emp.Email}, Phone: {emp.PhoneNumber}, Salary: {emp.Salary}");
            }
        }

        static void UpdateEmployee()
        {
            Console.Write("Enter Employee ID to update: ");
            //string inputId = Console.ReadLine();
            //if (Guid.TryParse(inputId, out Guid empId))
            //{
            //    var emp = employees.FirstOrDefault(e => e.Id == empId);
            //    if (emp != null)
            //    {
            //        Console.Write("Enter New Salary: ");
            //        string salaryInput = Console.ReadLine();
            //        while (!salaryInput.IsValidSalary(out int newSalary))
            //        {
            //            Console.Write("Invalid salary! Enter again: ");
            //            salaryInput = Console.ReadLine();
            //        }

            //        emp.Salary = newSalary;
            //        Console.WriteLine("Employee updated successfully!");
            //    }
            //    else
            //    {
            //        Console.WriteLine("Employee not found!");
            //    }
            //}
            //else
            //{
            //    Console.WriteLine("Invalid ID format!");
            //}
        }

        static void DeleteEmployee()
        {
            Console.Write("Enter Employee ID to delete: ");
            string inputId = Console.ReadLine();
            if (Guid.TryParse(inputId, out Guid empId))
            {
                var emp = employees.FirstOrDefault(e => e.Id == empId);
                if (emp != null)
                {
                    employees.Remove(emp);
                    Console.WriteLine("Employee deleted successfully!");
                }
                else
                {
                    Console.WriteLine("Employee not found!");
                }
            }
            else
            {
                Console.WriteLine("Invalid ID format!");
            }
        }

        //static bool IsEmailExist(List<Emp> employees, string email)
        //{
        //    return employees.Any(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        //}


        while (true)
        {
            Console.WriteLine("\nEmployee Management System");
            Console.WriteLine("1. Add Employee");
            Console.WriteLine("2. View Employees");
            Console.WriteLine("3. Update Employee");
            Console.WriteLine("4. Delete Employee");
            Console.WriteLine("5. Exit");
            Console.Write("Enter choice: ");
            string choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    Insertdata();
                    break;
                case "2":
                    ViewEmployees();
                    break;
                case "3":
                    UpdateEmployee();
                    break;
                case "4":
                    DeleteEmployee();
                    break;
                case "5":
                    return;
                default:
                    Console.WriteLine("Invalid choice! Try again.");
                    break;
            }
        }

    }
}


class Employee
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public int Salary { get; set; }
    public string Password { get; set; } // Encrypted Password

    public Employee(Guid id, string firstName, string lastName, string email, string phoneNumber, int salary, string password)
    {
        Id = id;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PhoneNumber = phoneNumber;
        Salary = salary;
        Password = password;
    }
}
