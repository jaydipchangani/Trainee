using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Static_Data
{
    public static class ProjectList
    {
        public static List<Project> Projects = new List<Project>
        {
            new Project { Id = 1, Name = "Project Alpha", Description = "A top-secret AI project", Manager = "John Doe" },
            new Project { Id = 2, Name = "Project Beta", Description = "A web-based application", Manager = "Jane Smith" }
        };
    }

    public class Project
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Manager { get; set; }
    }
}
