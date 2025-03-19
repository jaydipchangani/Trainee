using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Serialization;
using CSharpTaskThree;

public class Program
{
    static string filePath = "employees.xml";
    static List<Employee> employees = XmlHelper<List<Employee>>.LoadData(filePath) ?? new List<Employee>();

    public static void Main(string[] args)
    {
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

    static void Insertdata()
    {
        Console.Write("Enter First Name:");
        string firstName = Console.ReadLine();

        Console.Write("Enter Last Name:");
        string lastName = Console.ReadLine();

        Console.Write("Enter Email Address:");
        string email = Console.ReadLine();

        Console.Write("Enter Phone Number:");
        string phone = Console.ReadLine();

        Console.Write("Enter Salary:");
        int salary = int.Parse(Console.ReadLine());

        Console.Write("Enter Password:");
        string password = Console.ReadLine();

        password = AesFunction.Encrypt(password);

        employees.Add(new Employee(Guid.NewGuid(), firstName, lastName, email, phone, salary, password));

        Console.Write("Employee added successfully!");
        XmlHelper<List<Employee>>.SaveData(filePath, employees);
    }

    static void ViewEmployees()
    {
        if (employees.Count == 0)
        {
            Console.WriteLine("No employees found!");
            return;
        }

        Console.WriteLine("\nEmployee List:");
        Console.WriteLine("-----------------------------------------------------------------------------------------------------------------------------------------");
        Console.WriteLine($"| {"ID",-36} | {"Name",-20} | {"Email",-30} | {"Phone",-15} | {"Salary",-10} | {"Password",-20} |");
        Console.WriteLine("-----------------------------------------------------------------------------------------------------------------------------------------");

        foreach (var emp in employees)
        {
            string decryptedPassword = string.Empty;
            try
            {
                decryptedPassword = AesFunction.Decrypt(emp.Password);
            }
            catch (Exception ex)
            {
                decryptedPassword = "Error decrypting password";
                Console.WriteLine($"Decryption error for Employee ID {emp.Id}: {ex.Message}");
            }

            Console.WriteLine($"| {emp.Id,-36} | {emp.FirstName + " " + emp.LastName,-20} | {emp.Email,-30} | {emp.PhoneNumber,-15} | {emp.Salary,-10} | {decryptedPassword,-20} |");
        }

        Console.WriteLine("-----------------------------------------------------------------------------------------------------------------------------------------");
    }

    static void UpdateEmployee()
    {
        Console.Write("Enter Employee ID to update details: ");
        string inputId = Console.ReadLine();

        if (Guid.TryParse(inputId, out Guid empId))
        {
            var emp = employees.FirstOrDefault(e => e.Id == empId);
            if (emp != null)
            {
                Console.WriteLine($"Updating details for {emp.FirstName} {emp.LastName}");

                Console.Write($"Enter new First Name (Leave blank to keep '{emp.FirstName}'): ");
                string newFirstName = Console.ReadLine();
                if (!string.IsNullOrWhiteSpace(newFirstName)) emp.FirstName = newFirstName;

                Console.Write($"Enter new Last Name (Leave blank to keep '{emp.LastName}'): ");
                string newLastName = Console.ReadLine();
                if (!string.IsNullOrWhiteSpace(newLastName)) emp.LastName = newLastName;

                Console.Write($"Enter new Phone Number (Leave blank to keep '{emp.PhoneNumber}'): ");
                string newPhone = Console.ReadLine();
                if (!string.IsNullOrWhiteSpace(newPhone)) emp.PhoneNumber = newPhone;

                Console.Write($"Enter new Email (Leave blank to keep '{emp.Email}'): ");
                string newEmail = Console.ReadLine();
                if (!string.IsNullOrWhiteSpace(newEmail)) emp.Email = newEmail;

                Console.Write($"Enter new Password (Leave blank to keep current password): ");
                string newPassword = Console.ReadLine();
                if (!string.IsNullOrWhiteSpace(newPassword)) emp.Password = newPassword;

                Console.Write($"Enter new Salary (Leave blank to keep '{emp.Salary}'): ");
                string newSalaryInput = Console.ReadLine();
                if (!string.IsNullOrWhiteSpace(newSalaryInput) && int.TryParse(newSalaryInput, out int newSalary) && newSalary >= 20000 && newSalary <= 100000)
                {
                    emp.Salary = newSalary;
                }
                else if (!string.IsNullOrWhiteSpace(newSalaryInput))
                {
                    Console.WriteLine("Invalid salary input. Salary must be between 20,000 and 100,000.");
                }

                XmlHelper<List<Employee>>.SaveData(filePath, employees);
                Console.WriteLine("Employee details updated successfully!");
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

    static void DeleteEmployee()
    {
        Console.Write("Enter Employee ID to delete: ");
        string inputId = Console.ReadLine();
        if (Guid.TryParse(inputId, out Guid empId))
        {
            var emp = employees.Find(e => e.Id == empId);
            if (emp != null)
            {
                employees.Remove(emp);
                Console.WriteLine("Employee deleted successfully!");
                XmlHelper<List<Employee>>.SaveData(filePath, employees);
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
}

// Employee Class
public class Employee
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public int Salary { get; set; }
    public string Password { get; set; } // Encrypted Password

    public Employee() { }
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

// Generic XML Serializer
public static class XmlHelper<T> where T : class
{
    public static void SaveData(string filePath, T data)
    {
        try
        {
            XmlSerializer serializer = new XmlSerializer(typeof(T));
            using (TextWriter writer = new StreamWriter(filePath))
            {
                serializer.Serialize(writer, data);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving data: {ex.Message}");
        }
    }

    public static T LoadData(string filePath)
    {
        if (!File.Exists(filePath))
            return null;

        try
        {
            XmlSerializer serializer = new XmlSerializer(typeof(T));
            using (TextReader reader = new StreamReader(filePath))
            {
                return (T)serializer.Deserialize(reader);
            }
        }
        catch (Exception)
        {
            Console.WriteLine("Error loading data, creating new list.");
            return null;
        }
    }
}
