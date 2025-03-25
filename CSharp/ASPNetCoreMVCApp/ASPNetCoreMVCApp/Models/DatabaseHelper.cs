using Microsoft.Data.SqlClient;

namespace ASPNetCoreMVCApp.Models
{
    public static class DatabaseHelper
    {
        private static readonly string connectionString = "Server=DESKTOP-LASVLUU\\SQLEXPRESS;Database=AspNetAuthDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

        public static SqlConnection GetConnection()
        {
            return new SqlConnection(connectionString);
        }
    

     public static void ExecuteQuery(string query)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}