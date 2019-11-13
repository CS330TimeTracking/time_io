var activityData = {};

function startTimer() {
  var timers = document.getElementById("timer-container");
  var activity = document.getElementById("activity").value;
  var priotity = document.getElementById("priority").value;

  if (!activity) {
    alert("Please name your activity");
    return;
  }

  var currTime = new Date();
  activityData.activityName = activity;

  activityData.activity = {
    'priotity': priotity,
    'elapsedTime': 0,
    'startTime': {
      'hours': currTime.getHours,
      'minutes': currTime.getMinutes,
      'seconds': currTime.getSeconds
    },
  };

  timers.insertAdjacentHTML("afterend", `<div id="new-timer">${activityData.activityName}: ${activityData.activity.elapsedTime}</div>`);  
}