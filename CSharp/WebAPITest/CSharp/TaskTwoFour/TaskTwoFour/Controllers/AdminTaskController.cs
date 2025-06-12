using Microsoft.AspNetCore.Mvc;
using TaskTwoFour.Models;
using TaskTwoFour.Repositories;

namespace TaskTwoFour.Controllers
{
    public class AdminTaskController : Controller
    {
        private readonly ITaskRepository _taskRepository;

        public AdminTaskController(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public IActionResult Index()
        {
            List<TaskModel> tasks = _taskRepository.GetAllTasks();
            return View(tasks);
        }

        public IActionResult Details(int id)
        {
            TaskModel task = _taskRepository.GetTaskById(id);
            if (task == null) return NotFound();
            return View(task);
        }

        public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(TaskModel task)
        {
            if (ModelState.IsValid)
            {
                _taskRepository.AddTask(task);
                return RedirectToAction("Index");
            }
            return View(task);
        }

        public IActionResult Edit(int id)
        {
            TaskModel task = _taskRepository.GetTaskById(id);
            if (task == null) return NotFound();
            return View(task);
        }

        [HttpPost]
        public IActionResult Edit(TaskModel task)
        {
            _taskRepository.UpdateTask(task);
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            _taskRepository.DeleteTask(id);
            return RedirectToAction("Index");
        }
    }
}
