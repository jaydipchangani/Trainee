using Microsoft.AspNetCore.Mvc;

namespace Task10.Models
{
    public class UploadMultipleFiles
    {

        public string title { get; set; }
        public string description { get; set; }

        public IFormFileCollection files { get; set; }
    }
}
