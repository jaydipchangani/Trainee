using System.Xml.Serialization;

class Program
{
    static Dictionary<int, BankAccount> accounts = new Dictionary<int, BankAccount>();

    public static void Main()
    {
        LoadAccounts(); // Load accounts from XML if exists

        while (true)
        {
            Console.WriteLine("\nBANK MANAGEMENT SYSTEM");
            Console.WriteLine("1. Create Account");
            Console.WriteLine("2. Deposit Money");
            Console.WriteLine("3. Withdraw Money");
            Console.WriteLine("4. Display Account Details & Transaction History");
            Console.WriteLine("5. Exit");
            Console.Write("Enter your choice: ");

            string choice = Console.ReadLine();
            switch (choice)
            {
                case "1":
                    CreateAccount();
                    break;
                case "2":
                    DepositMoney();
                    break;
                case "3":
                    WithdrawMoney();
                    break;
                case "4":
                    DisplayAccountDetails();
                    break;
                case "5":
                    SaveAccounts(); // Save before exiting
                    Console.WriteLine("Exiting the application. Thank you for banking with us!");
                    return;
                default:
                    Console.WriteLine("Invalid choice! Please select a valid option.");
                    break;
            }
        }
    }

    static void CreateAccount()
    {
        Console.Write("Enter your Name: ");
        string name = Console.ReadLine();
        Console.Write("Enter Initial Deposit Amount (Min: 1000): ");

        if (!decimal.TryParse(Console.ReadLine(), out decimal initialDeposit) || initialDeposit < 1000)
        {
            Console.WriteLine("Invalid deposit amount! Minimum deposit is 1000.");
            return;
        }

        int accountNumber = accounts.Count + 1; // Generate unique account number
        BankAccount account = new BankAccount(accountNumber, name, initialDeposit);
        accounts[account.AccountNumber] = account;

        Console.WriteLine($"Account created successfully! Your Account Number is: {account.AccountNumber}");
        SaveAccounts(); // Save changes to file
    }

    static void DepositMoney()
    {
        Console.Write("Enter Account Number: ");
        if (!int.TryParse(Console.ReadLine(), out int accNumber) || !accounts.ContainsKey(accNumber))
        {
            Console.WriteLine("Invalid Account Number!");
            return;
        }

        Console.Write("Enter Deposit Amount: ");
        if (!decimal.TryParse(Console.ReadLine(), out decimal amount) || amount <= 0)
        {
            Console.WriteLine("Invalid deposit amount!");
            return;
        }

        accounts[accNumber].Deposit(amount);
        SaveAccounts(); // Save changes after deposit
    }

    static void WithdrawMoney()
    {
        Console.Write("Enter Account Number: ");
        if (!int.TryParse(Console.ReadLine(), out int accNumber) || !accounts.ContainsKey(accNumber))
        {
            Console.WriteLine("Invalid Account Number!");
            return;
        }

        Console.Write("Enter Withdrawal Amount: ");
        if (!decimal.TryParse(Console.ReadLine(), out decimal amount) || amount <= 0)
        {
            Console.WriteLine("Invalid withdrawal amount!");
            return;
        }

        if (accounts[accNumber].Withdraw(amount))
            SaveAccounts(); // Save changes after withdrawal
    }

    static void DisplayAccountDetails()
    {
        Console.Write("Enter Account Number: ");
        if (!int.TryParse(Console.ReadLine(), out int accNumber) || !accounts.ContainsKey(accNumber))
        {
            Console.WriteLine("Invalid Account Number!");
            return;
        }

        accounts[accNumber].DisplayDetails();
    }

    static void SaveAccounts()
    {
        try
        {
            XmlSerializer serializer = new XmlSerializer(typeof(List<BankAccount>));
            using (StreamWriter writer = new StreamWriter("accounts.xml"))
            {
                serializer.Serialize(writer, new List<BankAccount>(accounts.Values));
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving accounts: {ex.Message}");
        }
    }

    static void LoadAccounts()
    {
        try
        {
            if (File.Exists("accounts.xml"))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<BankAccount>));
                using (StreamReader reader = new StreamReader("accounts.xml"))
                {
                    List<BankAccount> accountList = (List<BankAccount>)serializer.Deserialize(reader);
                    accounts = new Dictionary<int, BankAccount>();
                    foreach (var acc in accountList)
                    {
                        accounts[acc.AccountNumber] = acc;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading accounts: {ex.Message}");
        }
    }
}

public class BankAccount
{
    public int AccountNumber { get; set; }
    public string AccountHolder { get; set; }

    [XmlElement("Balance")]
    public decimal Balance { get; set; } // Balance now has a public setter for serialization

    [XmlArray("TransactionHistory")]
    [XmlArrayItem("Transaction")]
    public List<string> TransactionHistory { get; set; } = new List<string>(); // Serialize transaction history

    // Required for XML serialization
    public BankAccount() { }

    public BankAccount(int accNumber, string name, decimal initialBalance)
    {
        AccountNumber = accNumber;
        AccountHolder = name;
        Balance = initialBalance;
        TransactionHistory.Add($"Account Created - Initial Deposit: {initialBalance:C}");
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Deposit amount must be greater than zero.");
            return;
        }
        Balance += amount;
        TransactionHistory.Add($"Deposited: {amount:C}, New Balance: {Balance:C}");
        Console.WriteLine($"Deposit successful! New Balance: {Balance:C}");
    }

    public bool Withdraw(decimal amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Withdrawal amount must be greater than zero.");
            return false;
        }
        if (amount > Balance)
        {
            Console.WriteLine("Insufficient funds!");
            return false;
        }

        Balance -= amount;
        TransactionHistory.Add($"Withdrawn: {amount:C}, New Balance: {Balance:C}");
        Console.WriteLine($"Withdrawal successful! New Balance: {Balance:C}");
        return true;
    }

    public void DisplayDetails()
    {
        Console.WriteLine("\nACCOUNT DETAILS");
        Console.WriteLine($"Account Number: {AccountNumber}");
        Console.WriteLine($"Account Holder: {AccountHolder}");
        Console.WriteLine($"Balance: {Balance:C}");
        Console.WriteLine("\nTRANSACTION HISTORY:");
        foreach (var transaction in TransactionHistory)
        {
            Console.WriteLine(transaction);
        }
    }
}