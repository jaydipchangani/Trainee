using System.ComponentModel;
using System.Numerics;
using System.Text.Json;
using CSharpTaskThree;
using DotNetTask2;

public class Program
{
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
                //DeleteData();
                break;

            case 3:
                Console.WriteLine("Edit Data");
                //UpdateData();
                break;

            case 4:
                Console.WriteLine("Show data");
                //DisplayData();
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