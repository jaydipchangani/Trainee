namespace WebAPIFirst.Model
{
    public class ApiResponse
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public dynamic Data { get; set; }

        public ApiResponse(int s, string m,dynamic d) 
        {
            Status = s;
            Message = m;
            Data = d;

        }
    }
}
