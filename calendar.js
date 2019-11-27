var activities = [];
var calEvents = [];
function init () {
  activities = JSON.parse(localStorage.getItem("activities"));
  activities = activities == null ? [] : activities;

  // activities.forEach((el) => {
  //   actData = JSON.parse(localStorage.getItem(el));
  //   activityData[el] = {
  //     'priority': actData.priority,
  //     'elapsedTime': actData.elapsedTime,
  //     'startTime': actData.startTime,
  //     'intervalId': actData.intervalId,
  //   }
  // });

  buildEvents();
}

function buildEvents() {
  activities.forEach((el) => {
    actData = JSON.parse(localStorage.getItem(el));
    if (actData.paused) {
      var newEvent = {
        title: el,
        start: `${actData.date}T${actData.startTime}`,
        end: `${actData.date}T${parseEndTime(actData.startTime, actData.elapsedTime)}`,
        allDay: false,
      }
      calEvents.push(newEvent);
    }
  });
}

function parseEndTime(start, s) {
  var seconds = s % 60;
  var minutes = (s - seconds) / 60;
  var hours = Math.floor(minutes / 60);
  minutes = minutes - (hours * 60);
  hours += parseInt(start.substring(0, 2));
  minutes += parseInt(start.substring(3, 5));

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;

  return `${hours}:${minutes}`;
}

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ 'timeGrid' ],
    defaultView: 'timeGridWeek',
    nowIndicator: true,
    events: calEvents,
  });

  calendar.render();
});

init();