using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using ASPNetCoreMVCApp.Models;
using Microsoft.AspNetCore.Http;

namespace ASPNetCoreMVCApp.Controllers
{
    public class AdminController : Controller
    {
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


        [HttpPost]
        public IActionResult AddRole(string roleName)
        {
            if (HttpContext.Session.GetInt32("UserRoleId") != 1)  // Fix session key
                return Unauthorized();

            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();
            using SqlCommand cmd = new("INSERT INTO Roles (RoleName) VALUES (@RoleName)", conn);
            cmd.Parameters.AddWithValue("@RoleName", roleName);
            cmd.ExecuteNonQuery();

            return RedirectToAction("Roles");
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





    }
}
