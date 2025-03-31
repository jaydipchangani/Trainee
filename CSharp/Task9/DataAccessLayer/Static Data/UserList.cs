using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Static_Data
{
    public static class UserList
    {
        public static List<User> Users = new List<User>
        {
            new User { Id = 1, Name = "Admin User", Email = "admin@example.com", Role = "Admin" },
            new User { Id = 2, Name = "Manager User", Email = "manager@example.com", Role = "Manager" },
            new User { Id = 3, Name = "Regular User", Email = "user@example.com", Role = "User" }
        };
    }

    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
