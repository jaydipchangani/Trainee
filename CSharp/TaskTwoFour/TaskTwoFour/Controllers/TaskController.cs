    using Microsoft.AspNetCore.Mvc;
    using TaskTwoFour.Models;
    using TaskTwoFour.Repositories;

    namespace TaskTwoFour.Controllers
    {
        public class TaskController : Controller
        {
            private readonly ITaskRepository _taskRepository;

            public TaskController(ITaskRepository taskRepository)
            {
            if (taskRepository == null)
            {
                throw new ArgumentNullException(nameof(taskRepository), "TaskRepository is NULL! Dependency injection might be missing.");
            }

            _taskRepository = taskRepository;
            }

            public IActionResult Index()
            {
            var tasks = _taskRepository.GetAllTasks(); 
            return View(tasks);
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
            var task = _taskRepository.GetTaskById(id);
            if (task == null)
            {
                return NotFound();  
            }
            return View(task);
        }

            [HttpPost]
            public IActionResult Edit(TaskModel task)
            {
                if (ModelState.IsValid)
                {
                    _taskRepository.UpdateTask(task);
                    return RedirectToAction("Index");
                }
                return View(task);
            }

            public IActionResult Delete(int id)
            {
                _taskRepository.DeleteTask(id);
                return RedirectToAction("Index");
            }
        }
    }
