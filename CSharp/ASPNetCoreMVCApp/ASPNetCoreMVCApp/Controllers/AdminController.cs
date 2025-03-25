using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using ASPNetCoreMVCApp.Models;
using Microsoft.AspNetCore.Http;

namespace ASPNetCoreMVCApp.Controllers
{
    public class AdminController : Controller
    {
        private readonly string connectionString = "Server=DESKTOP-LASVLUU\\SQLEXPRESS;Database=AspNetAuthDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";
        public IActionResult Index()
        {
            int? userId = HttpContext.Session.GetInt32("UserId");
            int? roleId = HttpContext.Session.GetInt32("UserRoleId");  // Fix session key

            // Check if the user is logged in
            if (userId == null)
            {
                return RedirectToAction("Login", "Account"); // Redirect to login
            }
            // Check if the user is NOT an Admin
            if (roleId != 1)
            {
                return RedirectToAction("AccessDenied", "Account"); // Redirect unauthorized users
            }

            return View(); // Show Admin Dashboard
        }

        public IActionResult Users()
        {
            int? roleId = HttpContext.Session.GetInt32("UserRoleId");

            if (roleId == null)
            {
                return RedirectToAction("Login", "Account"); // Ensure user is redirected if session expired
            }

            if (roleId != 1)
            {
                return Unauthorized(); // Prevent unauthorized access
            }

            // If session role is correct, load user data
            List<User> users = new();
            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();
            using SqlCommand cmd = new("SELECT Id, FirstName, LastName, Email, RoleId, IsActive FROM Users", conn);
            using SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                users.Add(new User
                {
                    Id = (int)reader["Id"],
                    FirstName = reader["FirstName"].ToString(),
                    LastName = reader["LastName"].ToString(),
                    Email = reader["Email"].ToString(),
                    RoleId = (int)reader["RoleId"],
                    IsActive = (bool)reader["IsActive"]
                });
            }

            return View(users);
        }

        public IActionResult Roles()
        {
            int? roleId = HttpContext.Session.GetInt32("UserRoleId");

            if (roleId == null)
            {
                return RedirectToAction("Login", "Account");
            }

            if (roleId != 1)
            {
                return Unauthorized();
            }

            // Fetch roles if session is valid
            List<Role> roles = new();
            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();
            using SqlCommand cmd = new("SELECT Id, RoleName FROM Roles", conn);
            using SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                roles.Add(new Role { Id = (int)reader["Id"], RoleName = reader["RoleName"].ToString() });
            }

            return View(roles);
        }


        public IActionResult InactiveUsers()
        {
            if (HttpContext.Session.GetInt32("UserRoleId") != 1)  // Fix session key
                return Unauthorized();

            List<User> users = new();
            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();
            using SqlCommand cmd = new("SELECT Id, FirstName, LastName, Email, RoleId, IsActive FROM Users WHERE IsActive = 0", conn);
            using SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                users.Add(new User
                {
                    Id = (int)reader["Id"],
                    FirstName = reader["FirstName"].ToString(),
                    LastName = reader["LastName"].ToString(),
                    Email = reader["Email"].ToString(),
                    RoleId = (int)reader["RoleId"],
                    IsActive = (bool)reader["IsActive"]
                });
            }

            return View(users);
        }

        [HttpPost]
        public IActionResult ToggleUserStatus(int id, bool isActive)
        {
            if (HttpContext.Session.GetInt32("UserRoleId") != 1)  // Fix session key
                return Unauthorized();

            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();
            using SqlCommand cmd = new("UPDATE Users SET IsActive = @IsActive WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@IsActive", isActive);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();

            return RedirectToAction("Users");
        }

        [HttpPost]
        public IActionResult Delete(int id)
        {
            int? userId = HttpContext.Session.GetInt32("UserId");
            int? roleId = HttpContext.Session.GetInt32("UserRoleId");

            if (userId == null || roleId == null || roleId != 1)
            {
                return Unauthorized(); // Unauthorized access
            }

            // Check if the admin is trying to delete their own account
            if (userId == id)
            {
                TempData["ErrorMessage"] = "Admin account cannot be deleted."; // Show message if admin tries to delete their own account
                return RedirectToAction("Users");
            }

            // Proceed with deletion for non-admin users
            using (SqlConnection conn = DatabaseHelper.GetConnection())
            {
                conn.Open();
                using (SqlCommand cmd = new("DELETE FROM Users WHERE Id = @Id", conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.ExecuteNonQuery();
                }
            }

            return RedirectToAction("Users"); // Redirect back to the Users list
        }

        public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(User user)
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

            // Encrypt password
            string encryptedPassword = AESHelper.Encrypt(user.PasswordHash);

            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();

            // Update the SQL query to include RoleId and IsActive
            using SqlCommand cmd = new("INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId, IsActive) VALUES (@FirstName, @LastName, @Email, @PasswordHash, @RoleId, @IsActive)", conn);

            // Add parameters for FirstName, LastName, Email, PasswordHash
            cmd.Parameters.AddWithValue("@FirstName", user.FirstName ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@LastName", user.LastName ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", user.Email ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@PasswordHash", encryptedPassword ?? (object)DBNull.Value);

            // Add RoleId and IsActive with proper null handling
            cmd.Parameters.AddWithValue("@RoleId", user.RoleId.HasValue ? (object)user.RoleId.Value : DBNull.Value);  // If RoleId is null, use DBNull.Value
            cmd.Parameters.AddWithValue("@IsActive", user.IsActive);  // Assuming IsActive is a non-nullable boolean

            int rowsAffected = cmd.ExecuteNonQuery();

            if (rowsAffected > 0)
            {
                Console.WriteLine("User Added successfully.");
                return RedirectToAction("Create");
            }
            else
            {
                ViewBag.ErrorMessage = "Registration failed. Please try again.";
                return View(user);
            }
        }

        public IActionResult Edit(int id)
{
    // Fetch the user from the database
    using (SqlConnection conn = DatabaseHelper.GetConnection())
    {
        conn.Open();

        using (SqlCommand cmd = new SqlCommand("SELECT * FROM Users WHERE Id = @Id", conn))
        {
            cmd.Parameters.AddWithValue("@Id", id);
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                if (reader.Read())
                {
                    var user = new User
                    {
                        Id = Convert.ToInt32(reader["Id"]),
                        FirstName = reader["FirstName"].ToString(),
                        LastName = reader["LastName"].ToString(),
                        Email = reader["Email"].ToString(),
                        RoleId = Convert.ToInt32(reader["RoleId"]),
                        IsActive = Convert.ToBoolean(reader["IsActive"])
                    };

                    // Decrypt the PasswordHash to show in the form (masked or actual depending on your requirement)
                    string decryptedPassword = AESHelper.Decrypt(reader["PasswordHash"].ToString());
                    user.PasswordHash = decryptedPassword; // Store decrypted password for display

                    return View(user);
                }
                else
                {
                    // If user not found, show an error
                    return NotFound();
                }
            }
        }
    }
}


        [HttpPost]
        public IActionResult Update(User user)
        {
            // Check if the user object is null
            if (user == null)
            {
                ViewBag.ErrorMessage = "Invalid user data.";
                return View("Edit", user);
            }

            // If password is not null or empty, encrypt it
            string encryptedPassword = null;
            if (!string.IsNullOrEmpty(user.PasswordHash))  // This is the new password entered by the user
            {
                encryptedPassword = AESHelper.Encrypt(user.PasswordHash); // Encrypt password
            }
            else
            {
                // If password is empty, use the existing password (do not change)
                encryptedPassword = user.PasswordHash;
            }

            using (SqlConnection conn = DatabaseHelper.GetConnection())
            {
                conn.Open();

                // Update user details
                using (SqlCommand cmd = new SqlCommand("UPDATE Users SET FirstName = @FirstName, LastName = @LastName, Email = @Email, PasswordHash = @PasswordHash, RoleId = @RoleId, IsActive = @IsActive WHERE Id = @Id", conn))
                {
                    cmd.Parameters.AddWithValue("@Id", user.Id);
                    cmd.Parameters.AddWithValue("@FirstName", user.FirstName ?? (object)DBNull.Value); // Handle null values
                    cmd.Parameters.AddWithValue("@LastName", user.LastName ?? (object)DBNull.Value); // Handle null values
                    cmd.Parameters.AddWithValue("@Email", user.Email ?? (object)DBNull.Value); // Handle null values
                    cmd.Parameters.AddWithValue("@PasswordHash", encryptedPassword ?? (object)DBNull.Value); // If password is empty, it will not be updated
                    cmd.Parameters.AddWithValue("@RoleId", user.RoleId);
                    cmd.Parameters.AddWithValue("@IsActive", user.IsActive);

                    // Execute the query and get the number of affected rows
                    int rowsAffected = cmd.ExecuteNonQuery();

                    // If rowsAffected > 0, the update was successful
                    if (rowsAffected > 0)
                    {
                        return RedirectToAction("Users"); // Make sure this action exists
                    }
                    else
                    {
                        ViewBag.ErrorMessage = "User update failed.";
                        return View("Edit", user);
                    }
                }
            }
        }



    }
}
