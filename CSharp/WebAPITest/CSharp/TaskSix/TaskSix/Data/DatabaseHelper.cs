using System;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;

public class DatabaseHelper
{
    private readonly string _connectionString;

    public DatabaseHelper(string connectionString)
    {
        _connectionString = connectionString;
    }

    // Register a new user
    public bool RegisterUser(string firstName, string lastName, string email, string password)
    {
        string encryptedPassword = EncryptPassword(password);

        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            string query = "INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId) VALUES (@FirstName, @LastName, @Email, @PasswordHash, (SELECT Id FROM Roles WHERE RoleName='User'))";
            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@FirstName", firstName);
            cmd.Parameters.AddWithValue("@LastName", lastName);
            cmd.Parameters.AddWithValue("@Email", email);
            cmd.Parameters.AddWithValue("@PasswordHash", encryptedPassword);

            con.Open();
            int result = cmd.ExecuteNonQuery();
            return result > 0;
        }
    }

    // Login method
    public DataRow LoginUser(string email, string password)
    {
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            string query = "SELECT * FROM Users WHERE Email = @Email";
            SqlDataAdapter da = new SqlDataAdapter(query, con);
            da.SelectCommand.Parameters.AddWithValue("@Email", email);

            DataTable dt = new DataTable();
            da.Fill(dt);

            if (dt.Rows.Count > 0)
            {
                string storedPassword = dt.Rows[0]["PasswordHash"].ToString();
                if (DecryptPassword(storedPassword) == password)
                {
                    return dt.Rows[0];
                }
            }
        }
        return null;
    }

    // Encrypt Password (AES)
    private string EncryptPassword(string password)
    {
        byte[] key = Encoding.UTF8.GetBytes("ca6b4baef965c7c3"); // 16-byte key
        using (Aes aes = Aes.Create())
        {
            aes.Key = key;
            aes.GenerateIV();;
            using (var encryptor = aes.CreateEncryptor())
            {
                byte[] inputBytes = Encoding.UTF8.GetBytes(password);
                byte[] encryptedBytes = encryptor.TransformFinalBlock(inputBytes, 0, inputBytes.Length);
                return Convert.ToBase64String(aes.IV) + ":" + Convert.ToBase64String(encryptedBytes);
            }
        }
    }

    // Decrypt Password
    private string DecryptPassword(string encryptedPassword)
    {
        string[] parts = encryptedPassword.Split(':');
        byte[] iv = Convert.FromBase64String(parts[0]);
        byte[] encryptedBytes = Convert.FromBase64String(parts[1]);

        byte[] key = Encoding.UTF8.GetBytes("ca6b4baef965c7c3");

        using (Aes aes = Aes.Create())
        {
            aes.Key = key;
            aes.IV = iv;
            using (var decryptor = aes.CreateDecryptor())
            {
                byte[] decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
                return Encoding.UTF8.GetString(decryptedBytes);
            }
        }
    }

    public DataTable GetAllUsers()
    {
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            string query = "SELECT * FROM Users WHERE RoleId != (SELECT Id FROM Roles WHERE RoleName='Admin')";
            SqlDataAdapter da = new SqlDataAdapter(query, con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            return dt;
        }
    }

    public bool UpdateUser(int userId, string firstName, string lastName, int roleId)
    {
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            string query = "UPDATE Users SET FirstName=@FirstName, LastName=@LastName, RoleId=@RoleId WHERE Id=@UserId";
            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@FirstName", firstName);
            cmd.Parameters.AddWithValue("@LastName", lastName);
            cmd.Parameters.AddWithValue("@RoleId", roleId);
            cmd.Parameters.AddWithValue("@UserId", userId);
            con.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }

    public bool UpdatePassword(int userId, string newPassword)
    {
        string encryptedPassword = EncryptPassword(newPassword);
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            string query = "UPDATE Users SET PasswordHash=@Password WHERE Id=@UserId";
            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@Password", encryptedPassword);
            cmd.Parameters.AddWithValue("@UserId", userId);
            con.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }

    public void DeactivateUser(int userId)
    {
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            string query = "UPDATE Users SET IsActive=0 WHERE Id=@UserId";
            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@UserId", userId);
            con.Open();
            cmd.ExecuteNonQuery();
        }
    }

    public DataTable GetInactiveUsers()
    {
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            string query = "SELECT * FROM Users WHERE IsActive=0";
            SqlDataAdapter da = new SqlDataAdapter(query, con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            return dt;
        }
    }

    public bool AddRole(string roleName)
    {
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            string query = "INSERT INTO Roles (RoleName) VALUES (@RoleName)";
            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@RoleName", roleName);
            con.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }

    public bool UpdateRole(int roleId, string roleName)
    {
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            string query = "UPDATE Roles SET RoleName=@RoleName WHERE Id=@RoleId";
            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@RoleName", roleName);
            cmd.Parameters.AddWithValue("@RoleId", roleId);
            con.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }

    public bool DeleteRole(int roleId)
    {
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            string query = "DELETE FROM Roles WHERE Id=@RoleId AND Id NOT IN (SELECT DISTINCT RoleId FROM Users)";
            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@RoleId", roleId);
            con.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }

}
