let calendar;
let eventModal;

document.addEventListener('DOMContentLoaded', function () {
  let calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    droppable: true,
    selectable: true,
    eventClassNames: function (arg) {

      if (arg.event.extendedProps.eventType) {
        return [`${arg.event.extendedProps.eventType}-event`];
      }
      return [];
    }
  });

  calendar.render();
  eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
});

function openAddEventModal() {
  document.getElementById('eventForm').reset();
  eventModal.show();
}

function handleEventTypeChange() {
  const eventType = document.getElementById('eventType').value;
  const dateContainer = document.getElementById('dateContainer');
  const weekDayContainer = document.getElementById('weekDayContainer');
  const monthDayContainer = document.getElementById('monthDayContainer');

  dateContainer.style.display = eventType === 'once' ? 'block' : 'none';
  weekDayContainer.style.display = eventType === 'weekly' ? 'block' : 'none';
  monthDayContainer.style.display = eventType === 'monthly' ? 'block' : 'none';

  const colorMap = {
    once: '#3498db',
    daily: '#ff6b6b',
    weekly: '#4ecdc4',
    monthly: '#9b59b6',
    hourly: '#f1c40f'
  };
  document.getElementById('eventColor').value = colorMap[eventType];
}

function addEvent() {
  const title = document.getElementById('eventTitle').value;
  const type = document.getElementById('eventType').value;
  const time = document.getElementById('eventTime').value;
  const duration = parseInt(document.getElementById('eventDuration').value);
  const color = document.getElementById('eventColor').value;

  let eventConfig = {
    title: title,
    color: color,
    editable: true,
    extendedProps: {
      eventType: type
    }
  };


  const [hours, minutes] = time.split(':').map(Number);


  const startDate = new Date();
  startDate.setHours(hours, minutes, 0);
  const endDate = new Date(startDate.getTime() + duration * 60000);

  if (type === 'once') {
    const date = document.getElementById('eventDate').value;
    eventConfig.start = `${date}T${time}`;
    eventConfig.end = new Date(new Date(eventConfig.start).getTime() + duration * 60000);
  } else if (type === 'daily') {
    eventConfig.startTime = `${time}:00`;
    eventConfig.endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`;
    eventConfig.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
  } else if (type === 'weekly') {
    const weekDay = document.getElementById('weekDay').value;
    eventConfig.startTime = `${time}:00`;
    eventConfig.endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`;
    eventConfig.daysOfWeek = [parseInt(weekDay)];
  } else if (type === 'monthly') {
    const monthDay = document.getElementById('monthDay').value;
    eventConfig.startRecur = new Date();
    eventConfig.startTime = `${time}:00`;
    eventConfig.endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`;
    eventConfig.daysOfMonth = [parseInt(monthDay)];
  } else if (type === 'hourly') {
    eventConfig.startTime = `${time}:00`;
    eventConfig.endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`;
    eventConfig.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
  }

  calendar.addEvent(eventConfig);
  eventModal.hide();
}
