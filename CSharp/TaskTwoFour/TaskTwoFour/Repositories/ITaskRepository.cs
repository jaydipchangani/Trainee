using TaskTwoFour.Models;

namespace TaskTwoFour.Repositories
{
    public interface ITaskRepository
    {
        List<TaskModel> GetAllTasks();
        TaskModel GetTaskById(int id);
        void AddTask(TaskModel task);
        void UpdateTask(TaskModel task);
        void DeleteTask(int id);
    }
}
