using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ASPNetCoreMVCApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace ASPNetCoreMVCApp.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Login() => View();
        public IActionResult Register() => View();

        [HttpPost]
        public IActionResult Register(User user)
        {
            if (user == null)
            {
                Console.WriteLine("User object is null.");
                return View();
            }

            if (!ModelState.IsValid)
            {
                return View(user);
            }

            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();

            // Check if email already exists
            using SqlCommand checkEmailCmd = new("SELECT COUNT(*) FROM Users WHERE Email = @Email", conn);
            checkEmailCmd.Parameters.AddWithValue("@Email", user.Email);

            int emailExists = (int)checkEmailCmd.ExecuteScalar();
            if (emailExists > 0)
            {
                ModelState.AddModelError("Email", "This email is already registered.");
                return View(user);
            }

            // Encrypt password
            string encryptedPassword = AESHelper.Encrypt(user.PasswordHash);

            using SqlCommand cmd = new("INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId, IsActive) VALUES (@FirstName, @LastName, @Email, @PasswordHash, 2, 1)", conn);
            cmd.Parameters.AddWithValue("@FirstName", user.FirstName ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@LastName", user.LastName ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", user.Email ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@PasswordHash", encryptedPassword ?? (object)DBNull.Value);

            int rowsAffected = cmd.ExecuteNonQuery();

            if (rowsAffected > 0)
            {
                Console.WriteLine("User registered successfully.");
                return RedirectToAction("Login");
            }
            else
            {
                ModelState.AddModelError("", "Registration failed. Please try again.");
                return View(user);
            }
        }



        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();

            using SqlCommand cmd = new(@"SELECT Id, FirstName, PasswordHash, RoleId, IsActive FROM Users WHERE Email = @Email", conn);
            cmd.Parameters.AddWithValue("@Email", email);

            using SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                bool isActive = Convert.ToBoolean(reader["IsActive"]);

                if (!isActive)
                {
                    ViewBag.ErrorMessage = "Your account is inactive. Please contact support.";
                    return View();
                }

                if (AESHelper.Decrypt(reader["PasswordHash"].ToString()) == password)
                {
                    int userId = Convert.ToInt32(reader["Id"]);
                    int roleId = Convert.ToInt32(reader["RoleId"]);
                    string firstName = reader["FirstName"].ToString(); // Fetch FirstName

                    // Store UserId & RoleId in session
                    HttpContext.Session.SetInt32("UserId", userId);
                    HttpContext.Session.SetInt32("UserRoleId", roleId);

                    // Store FirstName in TempData
                    TempData["FirstName"] = firstName;

                    // Redirect based on role
                    return roleId == 1
                        ? RedirectToAction("Index", "Admin")  // Admin Redirect
                        : RedirectToAction("Index", "Home");  // Normal User Redirect
                }
                else
                {
                    ViewBag.ErrorMessage = "Invalid password. Please try again.";
                    return View();
                }
            }
            else
            {
                ViewBag.ErrorMessage = "No account found with this email.";
                return View();
            }
        }



        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); // Clear session on logout
            return RedirectToAction("Login");
        }


        public IActionResult AccessDenied()
        {
            return View();
        }

    }
}
