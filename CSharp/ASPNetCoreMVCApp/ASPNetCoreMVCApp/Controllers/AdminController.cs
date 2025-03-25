using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using ASPNetCoreMVCApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

namespace ASPNetCoreMVCApp.Controllers
{
    [Authorize(Roles = "1")]
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("RoleId") != 1)
                return Unauthorized();

            return View();
        }

        public IActionResult Users()
        {
            if (HttpContext.Session.GetInt32("RoleId") != 1)
                return Unauthorized();

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
            if (HttpContext.Session.GetInt32("RoleId") != 1)
                return Unauthorized();

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
            if (HttpContext.Session.GetInt32("RoleId") != 1)
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
            if (HttpContext.Session.GetInt32("RoleId") != 1)
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
            if (HttpContext.Session.GetInt32("RoleId") != 1)
                return Unauthorized();

            using SqlConnection conn = DatabaseHelper.GetConnection();
            conn.Open();
            using SqlCommand cmd = new("UPDATE Users SET IsActive = @IsActive WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@IsActive", isActive);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();

            return RedirectToAction("Users");
        }
    }
}
