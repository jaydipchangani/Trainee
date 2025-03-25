using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using TaskSix.Models;
using Microsoft.Data.SqlClient;


public class AccountController : Controller
{
    private readonly DatabaseHelper _db;

    public AccountController()
    {
        _db = new DatabaseHelper("Server=DESKTOP-LASVLUU\\SQLEXPRESS;Database=TaskDB;TrustServerCertificate=True");
    }

    // Register User
    [HttpPost]
    public IActionResult Register(string firstName, string lastName, string email, string password)
    {
        if (_db.RegisterUser(firstName, lastName, email, password))
        {
            TempData["Success"] = "Registration successful!";
            return RedirectToAction("Login");
        }
        else
        {
            TempData["Error"] = "Email already exists!";
            return RedirectToAction("Register");
        }
    }
    // GET: Login Page
    public IActionResult Login()
    {
        return View();
    }

    // POST: Handle Login
    [HttpPost]
    public IActionResult Login(LoginViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        string query = "SELECT Id, FirstName, LastName, Email, PasswordHash, RoleId, IsActive FROM Users WHERE Email = @Email";

        using (SqlConnection con = new SqlConnection("Server=DESKTOP-LASVLUU\\SQLEXPRESS;Database=TaskDB;TrustServerCertificate=True"))
        {
            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@Email", model.Email);

            con.Open();
            SqlDataReader reader = cmd.ExecuteReader();                                                                                                                 

            if (reader.Read())
            {
                int userId = Convert.ToInt32(reader["Id"]);
                string storedPassword = reader["PasswordHash"].ToString();
                bool isActive = Convert.ToBoolean(reader["IsActive"]);
                int roleId = Convert.ToInt32(reader["RoleId"]);

                // If user is inactive, prevent login
                if (!isActive)
                {
                    TempData["ErrorMessage"] = "Your account is inactive. Please contact the administrator.";
                    return View();
                }

                // Compare entered password with stored password
                if (EncryptPassword(model.Password) == storedPassword)
                {
                    TempData["UserId"] = userId;
                    TempData["UserEmail"] = model.Email;
                    TempData["UserRole"] = roleId;

                    if (roleId == 1)  // Admin Role ID
                        return RedirectToAction("Index", "Admin");
                    else
                        return RedirectToAction("Index", "User");
                }
            }
            reader.Close();
        }

        TempData["ErrorMessage"] = "Invalid email or password.";
        return View();
    }

    // AES Encryption (for matching entered password with stored password)
    private string EncryptPassword(string plainText)
    {
        string key = "ca6b4baef965c7c3"; // Must match encryption key used during registration
        byte[] keyBytes = Encoding.UTF8.GetBytes(key);
        byte[] iv = new byte[16];

        using (Aes aes = Aes.Create())
        {
            aes.Key = keyBytes;
            aes.IV = iv;

            ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            using (MemoryStream ms = new MemoryStream())
            using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
            using (StreamWriter sw = new StreamWriter(cs))
            {
                sw.Write(plainText);
                return Convert.ToBase64String(ms.ToArray());
            }
        }
    }


    // Logout
    public IActionResult Logout()
    {
        TempData.Clear();
        return RedirectToAction("Login");
    }

}
