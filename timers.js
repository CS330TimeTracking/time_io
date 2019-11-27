var activityData = {};
var activities = [];
var currentUser = sessionStorage.getItem("currentUsername");

function init () {
  window.onbeforeunload = onClose;

  activities = JSON.parse(localStorage.getItem("activities"));
  activities = activities == null ? [] : activities;

  activities.forEach((el) => {
    actData = JSON.parse(localStorage.getItem(el));
    activityData[el] = {
      'priority': actData.priority,
      'elapsedTime': actData.elapsedTime,
      'date': actData.date,
      'startTime': actData.startTime,
      'intervalId': actData.intervalId,
      'user': actData.user,
      'name': actData.name,
      'paused': actData.paused
    }
  });

  renderTimers();
}

function hash(value) {
    var hash = 0;
    for (var i = 0; i < value.length; ++i) {
        hash = ((hash << 5) - hash) + value.charCodeAt(i) | 0;
    }
    return hash;
};

function startTimer() {
  var timers = document.getElementById("timer-container");
  var activity = document.getElementById("activity").value;
  var priority = document.getElementById("priority").value;

  var key = hash(activity + currentUser);

  if (!activity) {
    alert("Please name your activity");
    return;
  }

  if (activityData[key]) {
    alert("Activity already exists, pick another name or remove other activity.")
    return;
  }

  var currTime = new Date();
  activityData[key] = {
    'priority': priority,
    'elapsedTime': 0,
    'date': `${currTime.getFullYear()+'-'+(currTime.getMonth()+1)+'-'+currTime.getDate()}`,
    'startTime': `${currTime.getHours()}:${currTime.getMinutes() < 10 ? '0' + currTime.getMinutes() : currTime.getMinutes()}`,
    'intervalId': null,
    'user': currentUser,
    'name': activity,
    'paused': true
  };

  activities.push(key);

  var newTimer =
    `<div class="new-timer" id="${activity}">
      <button class="close-activity" onclick="deleteActivity('${activity}')">
        X
      </button>
      <br/>
      ${activity}: <span id="${activity}-timer">00:00:00</span><br/>
      <button id="${activity}-pp" onclick="togglePausePlay('${activity}')">
        Resume
      </button>
    </div>`;

  timers.insertAdjacentHTML("afterend", newTimer);
  togglePausePlay(activity);
}

function renderTimers() {
  var timers = document.getElementById("timer-container");
  activities.forEach((activityHash) => {
    var activity = activityData[activityHash];
    if (activity.user != null && activity.user != currentUser) {
        return;
    }
    var newTimer =
    `
    <div class="new-timer" id="${activity.name}">
      ${activity.name}: <span id="${activity.name}-timer">${timeFormat(activity.elapsedTime)}</span><br/>
      <button id="${activity.name}-pp" onclick="togglePausePlay('${activity.name}')">
        Resume
      </button>
      <button class="close-activity" onclick="deleteActivity('${activity.name}')">
        X
      </button>
    </div>`;

    timers.insertAdjacentHTML("afterend", newTimer);

    if (activity.paused) return;
    togglePausePlay(activity.name);
  });
}

function togglePausePlay(activity) {
  var key = hash(activity + currentUser);
  var pp = document.getElementById(`${activity}-pp`);

  if (!activityData[key].paused) {
    clearInterval(activityData[key].intervalId);
    pp.innerHTML = 'Resume';
    activityData[key].paused = true;
  } else {
    activityData[key].paused = false;
    pp.innerHTML = 'Pause';
    activityData[key].intervalId = setInterval(() => {
      activityData[key].elapsedTime++;
      document.getElementById(`${activity}-timer`).innerHTML = `${timeFormat(activityData[key].elapsedTime)}`
    }, 1000);
  }
}

function deleteActivity(activity) {
  var el = document.getElementById(activity);
  var key = hash(activity + currentUser);
  activities = activities.filter((el) => el != activity);
  clearInterval(activityData[key].intervalId);
  delete activityData[key];
  localStorage.removeItem(key);

  return el.parentNode.removeChild(el);
}

function timeFormat(s) {
  var seconds = s % 60;
  var minutes = (s - seconds) / 60;
  var hours = Math.floor(minutes / 60);
  minutes = minutes - (hours * 60);

  // this is gross but pressed for time
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return `${hours}:${minutes}:${seconds}`;
}

function onClose() {
  jsonActivities = JSON.stringify(activities);
  localStorage.setItem("activities", jsonActivities);

  activities.forEach((activity) => {
    localStorage.setItem(activity, JSON.stringify(activityData[activity]));
  });
}

init();
