using Microsoft.AspNetCore.Mvc;
using System.Data;
using Microsoft.Data.SqlClient;
using TaskSix.Models;

namespace ASP.NET_Core_MVC_App.Controllers
{
    public class AdminController : Controller
    {
        private readonly string connectionString = "Server=DESKTOP-LASVLUU\\SQLEXPRESS;Database=TaskDB;Trusted_Connection=True;";

        public IActionResult Index()
        {
            ViewBag.UserName = TempData["UserName"];
            return View();
        }

        public IActionResult ManageUsers()
        {
            DataTable dtUsers = new DataTable();
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SELECT u.Id, u.FirstName, u.LastName, u.Email, r.RoleName FROM Users u INNER JOIN Roles r ON u.RoleId = r.Id WHERE u.RoleId <> 2", con))
                {
                    con.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    dtUsers.Load(rdr);
                }
            }
            return View(dtUsers);
        }

        [HttpPost]
        public IActionResult AddUser(User user)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId, IsActive) VALUES (@FirstName, @LastName, @Email, @PasswordHash, @RoleId, 1)", con))
                {
                    cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                    cmd.Parameters.AddWithValue("@LastName", user.LastName);
                    cmd.Parameters.AddWithValue("@Email", user.Email);
                    cmd.Parameters.AddWithValue("@PasswordHash", user.PasswordHash); // Encrypt password before storing
                    cmd.Parameters.AddWithValue("@RoleId", user.RoleId);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            TempData["Success"] = "User added successfully!";
            return RedirectToAction("ManageUsers");
        }

        [HttpPost]
        public IActionResult DeactivateUser(int userId)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("UPDATE Users SET IsActive = 0 WHERE Id = @UserId", con))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            TempData["Success"] = "User deactivated successfully!";
            return RedirectToAction("ManageUsers");
        }

        public IActionResult ManageRoles()
        {
            DataTable dtRoles = new DataTable();
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Roles", con))
                {
                    con.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    dtRoles.Load(rdr);
                }
            }
            return View(dtRoles);
        }

        [HttpPost]
        public IActionResult AddRole(string roleName)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("INSERT INTO Roles (RoleName) VALUES (@RoleName)", con))
                {
                    cmd.Parameters.AddWithValue("@RoleName", roleName);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            TempData["Success"] = "Role added successfully!";
            return RedirectToAction("ManageRoles");
        }

        [HttpPost]
        public IActionResult DeleteRole(int roleId)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("DELETE FROM Roles WHERE Id = @RoleId", con))
                {
                    cmd.Parameters.AddWithValue("@RoleId", roleId);
                    con.Open();
                    try
                    {
                        cmd.ExecuteNonQuery();
                        TempData["Success"] = "Role deleted successfully!";
                    }
                    catch
                    {
                        TempData["Error"] = "Cannot delete role as it is assigned to users!";
                    }
                }
            }
            return RedirectToAction("ManageRoles");
        }
    }
}
