
import Task from "./Task";


function TaskList() {
  const tasks = [
    { id: 1, text: 'Doctors Appointment', day: 'Annual health check-up with Dr. Smith at City Hospital.', reminder: true },
    { id: 2, text: 'Meeting at School', day: 'Parent-teacher meeting at Green Valley High School to discuss student progress.', reminder: true },
    { id: 3, text: 'Food Shopping', day: 'Buy groceries including vegetables, fruits, and dairy from the local supermarket.', reminder: false },
    { id: 4, text: 'Doctors Appointment', day: 'Follow-up appointment with Dr. Brown for routine blood pressure check-up.', reminder: true },
    { id: 5, text: 'Meeting at School', day: 'Discussion with the school principal regarding upcoming school events and activities.', reminder: true },
    { id: 6, text: 'Food Shopping', day: 'Stock up on essential household items and snacks for the week.', reminder: false }
  ];

  return (
    <div className="mt-3">
      {tasks.map((task) => (
        <Task key={task.id} text={task.text} day={task.day} id={task.id} />
      ))}
    </div>
  );
}

export default TaskList;