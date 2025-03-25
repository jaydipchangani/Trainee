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

            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                ModelState.AddModelError("Password", "Password is required.");
                return View(user);
            }

            // Encrypt password correctly
            string encryptedPassword = AESHelper.Encrypt(user.PasswordHash);

            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();

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
                ViewBag.ErrorMessage = "Registration failed. Please try again.";
                return View(user);
            }
        }

        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();

            using SqlCommand cmd = new("SELECT Id, PasswordHash, RoleId FROM Users WHERE Email = @Email AND IsActive = 1", conn);
            cmd.Parameters.AddWithValue("@Email", email);

            using SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read() && AESHelper.Decrypt(reader["PasswordHash"].ToString()) == password)
            {
                int userId = Convert.ToInt32(reader["Id"]);
                int roleId = Convert.ToInt32(reader["RoleId"]); // Fetch RoleId

                // Store UserId & RoleId in session
                HttpContext.Session.SetInt32("UserId", userId);
                HttpContext.Session.SetInt32("UserRoleId", roleId);  // Fix session key

                // Redirect based on role
                if (roleId == 1)
                {
                    return RedirectToAction("Index", "Admin"); // Admin Redirect
                }
                else
                {
                    return RedirectToAction("Index", "Home"); // Normal User Redirect
                }
            }

            ViewBag.Error = "Invalid credentials.";
            return View();
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
