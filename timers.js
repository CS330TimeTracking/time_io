var activityData = {};
var activities = [];

function init () {
  window.onbeforeunload = onClose;

  activities = JSON.parse(localStorage.getItem("activities"));
  activities = activities == null ? [] : activities;

  activities.forEach((el) => {
    actData = JSON.parse(localStorage.getItem(el));
    activityData[el] = {
      'priotity': actData.priority,
      'elapsedTime': actData.elapsedTime,
      'startTime': actData.startTime,
      'intervalId': actData.intervalId,
    }
  });

  renderTimers();
}

function startTimer() {
  var timers = document.getElementById("timer-container");
  var activity = document.getElementById("activity").value;
  var priotity = document.getElementById("priority").value;

  if (!activity) {
    alert("Please name your activity");
    return;
  }

  if (activityData[activity]) {
    alert("Activity already exists, pick another name or remove other activity.")
    return;
  }

  var currTime = new Date();
  activityData[activity] = {
    'priotity': priotity,
    'elapsedTime': 0,
    'startTime': {
      'hours': currTime.getHours,
      'minutes': currTime.getMinutes,
      'seconds': currTime.getSeconds
    },
    'intervalId': null,
  };

  activities.push(activity);

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
  activities.forEach((activity) => {
    var newTimer = 
    `<div class="new-timer" id="${activity}">
      <button class="close-activity" onclick="deleteActivity('${activity}')">
        X
      </button>
      <br/>
      ${activity}: <span id="${activity}-timer">${timeFormat(activityData[activity].elapsedTime)}</span><br/>
      <button id="${activity}-pp" onclick="togglePausePlay('${activity}')">
        Resume
      </button>
    </div>`;

    timers.insertAdjacentHTML("afterend", newTimer);
    togglePausePlay(activity);
  });
}

function togglePausePlay(activity) {
  var pp = document.getElementById(`${activity}-pp`);
  if (pp.innerHTML == 'Pause') {
    clearInterval(activityData[activity].intervalId);
    pp.innerHTML = 'Resume';
  } else {
    pp.innerHTML = 'Pause';
    activityData[activity].intervalId = setInterval(() => {
      activityData[activity].elapsedTime++;
      document.getElementById(`${activity}-timer`).innerHTML = `${timeFormat(activityData[activity].elapsedTime)}`
    }, 1000);
  } 
}

function deleteActivity(activity) {
  var el = document.getElementById(activity);
  clearInterval(activityData[activity]);
  delete activityData[activity];
  localStorage.removeItem(activity);

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