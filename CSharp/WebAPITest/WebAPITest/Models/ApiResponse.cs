namespace WebAPITest.Models
{

    public class ApiResponse
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public dynamic Data { get; set; }

        public ApiResponse(int status, string message, dynamic data)
        {
            Status = status;
            Message = message;
            Data = data;
        }
    }
}
