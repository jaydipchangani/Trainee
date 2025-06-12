using System;

namespace TaskSix.Models
{
    public class User
    {
        public int Id { get; set; }  // Primary Key
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public int RoleId { get; set; }  // Foreign Key (Role)
        public bool IsActive { get; set; } = true;
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

        // Computed property for full name (instead of `Username`)
        public string FullName => $"{FirstName} {LastName}";

        // RoleName should be populated using JOIN with Roles table
        public string RoleName { get; set; }  // This must be populated via SQL JOIN
    }
}
