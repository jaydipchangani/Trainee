using TaskTwoFour.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using TaskTwoFour.Models;
using Microsoft.Extensions.Configuration;

namespace TaskTwoFour.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly string _connectionString;

        public TaskRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public List<TaskModel> GetAllTasks()
        {
            var tasks = new List<TaskModel>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Tasks";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    tasks.Add(new TaskModel
                    {
                        Id = (int)reader["Id"],
                        Title = reader["Title"].ToString(),
                        Description = reader["Description"].ToString(),
                        DueDate = (DateTime)reader["DueDate"],
                        Status = reader["Status"].ToString()
                    });
                }
            }
            return tasks;
        }

        public TaskModel GetTaskById(int id)
        {
            TaskModel task = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Tasks WHERE Id = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    task = new TaskModel
                    {
                        Id = (int)reader["Id"],
                        Title = reader["Title"].ToString(),
                        Description = reader["Description"].ToString(),
                        DueDate = (DateTime)reader["DueDate"],
                        Status = reader["Status"].ToString()
                    };
                }
            }
            return task;
        }

        public void AddTask(TaskModel task)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO Tasks (Title, Description, DueDate, Status) VALUES (@Title, @Description, @DueDate, @Status)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Title", task.Title);
                cmd.Parameters.AddWithValue("@Description", task.Description);
                cmd.Parameters.AddWithValue("@DueDate", task.DueDate);
                cmd.Parameters.AddWithValue("@Status", task.Status);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateTask(TaskModel task)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Tasks SET Title=@Title, Description=@Description, DueDate=@DueDate, Status=@Status WHERE Id=@Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", task.Id);
                cmd.Parameters.AddWithValue("@Title", task.Title);
                cmd.Parameters.AddWithValue("@Description", task.Description);
                cmd.Parameters.AddWithValue("@DueDate", task.DueDate);
                cmd.Parameters.AddWithValue("@Status", task.Status);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteTask(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Tasks WHERE Id=@Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}