using System.ComponentModel;
using System.Numerics;
using System.Text.Json;
using DotNetTask2;

public class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Task 1");
        File.WriteAllText("test.txt", "Hello Welcome to task 2");
        Console.WriteLine("File  created a file and add some text");

        Console.WriteLine("\nTask 2");
        File.WriteAllText("test.txt", "Hello Welcome to task 2 subtask 2-2");
        string fileData = File.ReadAllText("test.txt");
        Console.WriteLine(fileData);

        Console.WriteLine("\nTask 3");
        string[] arr = { "a", "b", "c", "d", "e", "f" };
        File.WriteAllLines("test.txt", arr);
        string arrayFile = File.ReadAllText("test.txt");
        Console.WriteLine(arrayFile);

        Console.WriteLine("\nTask 4");
        File.AppendAllText("test.txt", "Hello How are you ?");
        Console.WriteLine(File.ReadAllText("test.txt"));

        Console.WriteLine("\nTask 5");
        Console.WriteLine(File.ReadAllLines("test.txt").First());

        Console.WriteLine("\nTask 6");
        var len = File.ReadAllLines("test.txt").Length;
        Console.WriteLine(len);

        // User Data 


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
                designation = Console.ReadLine().ToLower(); ;
            }

            Console.WriteLine("Enter Salary :");
            Int32 salary = Convert.ToInt32(Console.ReadLine());
            while (salary.isValidSalary())
            {
                Console.WriteLine("Not Valid Salary, Enter Again");
                salary = Convert.ToInt32(Console.ReadLine());
            }

            string file = "emp.json";

            List<Emp> employees = new List<Emp>();

            if (File.Exists(file))
            {
                try
                {
                    string existingJson = File.ReadAllText(file);
                    if (!string.IsNullOrEmpty(existingJson))
                    {
                        employees = JsonSerializer.Deserialize<List<Emp>>(existingJson) ?? new List<Emp>();
                    }
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error reading or deserializing JSON: {ex.Message}");
                }
                catch (IOException ex)
                {
                    Console.WriteLine($"Error accessing the file: {ex.Message}");
                }
            }

            int newId = employees.Any() ? employees.Max(e => e.Id) + 1 : 1;

            var newEmp = new Emp {Id=newId, FirstName = firstName, LastName = lastName, Email = email, Phone = phone, Designation = designation, Salary = salary };
            employees.Add(newEmp);

            try
            {
                string updatedJson = JsonSerializer.Serialize(employees, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(file, updatedJson);
                Console.WriteLine("Data inserted successfully with Id: " + newId);
            }
            catch (IOException ex)
            {
                Console.WriteLine($"Error saving data: {ex.Message}");
            }

        }

        static void DeleteData()
        {
            Console.WriteLine("Enter Employee ID to delete:");
            int id = Convert.ToInt32(Console.ReadLine()); 

            List<Emp> employees = GetEmployees();

            Emp employeeToDelete = employees.FirstOrDefault(e => e.Id == id);

            if (employeeToDelete != null)
            {
                employees.Remove(employeeToDelete); 
                SaveEmployees(employees);  
                Console.WriteLine($"Employee with ID {id} has been deleted.");
            }
            else
            {
                Console.WriteLine("Employee not found.");
            }
        }

        static void UpdateData()
        {
            Console.WriteLine("Enter Employee ID to update:");
            int id = Convert.ToInt32(Console.ReadLine()); 

            List<Emp> employees = GetEmployees(); 

            Emp employeeToUpdate = employees.FirstOrDefault(e => e.Id == id);

            if (employeeToUpdate != null)
            {
                Console.WriteLine("Enter new First Name:");
                employeeToUpdate.FirstName = Console.ReadLine();
                while (employeeToUpdate.FirstName.isNull())
                {
                    Console.WriteLine("Enter First Name Again");
                    employeeToUpdate.FirstName = Console.ReadLine();
                }

                Console.WriteLine("Enter new Last Name:");
                employeeToUpdate.LastName = Console.ReadLine();
                while (employeeToUpdate.LastName.isNull())
                {
                    Console.WriteLine("Enter Last Name Again");
                    employeeToUpdate.LastName = Console.ReadLine();
                }


                string newEmail;
                do
                {
                    Console.WriteLine("Enter new Email:");
                    newEmail = Console.ReadLine();
                } while (IsEmailExist(employees, newEmail));

                employeeToUpdate.Email = newEmail;



                Console.WriteLine("Enter new Phone:");
                employeeToUpdate.Phone = Console.ReadLine();
                while (employeeToUpdate.Phone.isValidPhone())
                {
                    Console.WriteLine("Enter Phone Again");
                    employeeToUpdate.Phone = Console.ReadLine();
                }

                Console.WriteLine("Enter new Designation:");
                employeeToUpdate.Designation = Console.ReadLine();
                while (employeeToUpdate.Designation.isValidDesignantion())
                {
                    Console.WriteLine("Enter Designation again, not valid designantion");
                    employeeToUpdate.Designation = Console.ReadLine();
                }

                Console.WriteLine("Enter new Salary:");
                employeeToUpdate.Salary = Convert.ToInt32(Console.ReadLine());
                while (employeeToUpdate.Salary.isValidSalary())
                {
                    Console.WriteLine("Not Valid Salary, Enter Again");
                    employeeToUpdate.Salary = Convert.ToInt32(Console.ReadLine());
                }

                SaveEmployees(employees); 
                Console.WriteLine($"Employee with ID {id} has been updated.");
            }
            else
            {
                Console.WriteLine("Employee not found.");
            }
        }

        static void DisplayData()
        {
            List<Emp> employees = GetEmployees(); 

            if (employees.Count > 0)
            {
                Console.WriteLine("Employees List:");
                foreach (var emp in employees)
                {
                    Console.WriteLine($"ID: {emp.Id}, Name: {emp.FirstName} {emp.LastName}, Email: {emp.Email}, Phone: {emp.Phone}, Designation: {emp.Designation}, Salary: {emp.Salary}");
                }
            }
            else
            {
                Console.WriteLine("No employees found.");
            }
        }

        static List<Emp> GetEmployees()
        {
            string file = "emp.json";
            List<Emp> employees = new List<Emp>();

            if (File.Exists(file))
            {
                string json = File.ReadAllText(file);
                if (!string.IsNullOrEmpty(json))
                {
                    employees = JsonSerializer.Deserialize<List<Emp>>(json); 
                }
            }
            return employees;
        }

        static void SaveEmployees(List<Emp> employees)
        {
            string file = "emp.json";
            string json = JsonSerializer.Serialize(employees, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(file, json);  
        }

        static bool IsEmailExist(List<Emp> employees, string email)
        {
            return employees.Any(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }


        Console.WriteLine("Choose an operation:");
        Console.WriteLine("1. Add Data");
        Console.WriteLine("2. Remove Data");
        Console.WriteLine("3. Update Data");
        Console.WriteLine("4. Show Data");

        int choice = Convert.ToInt32(Console.ReadLine());

        switch (choice)
        {
            case 1:
                Console.WriteLine("add Data");
                Insertdata();

                break;

            case 2:
                Console.WriteLine("Remove Data");
                DeleteData();
                break;

            case 3:
                Console.WriteLine("Edit Data");
                UpdateData();
                break;

            case 4:
                Console.WriteLine("Show data");
                DisplayData();
                break;

            default:
                Console.WriteLine("Enter proper");
                break;
        }

    }
}


public class Emp
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Designation { get; set; }
    public Int32 Salary { get; set; }
}


