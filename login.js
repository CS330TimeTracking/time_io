String.prototype.hash = function() {
    var hash = 0;
    for (var i = 0; i < this.length; ++i) {
        hash = ((hash << 5) - hash) + this.charCodeAt(i) | 0;
    }
    return hash;
};

function loginHandler() {
    console.log("loginHandler");
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    if (localStorage.getItem(username) == password.hash() && localStorage.getItem(username) !== null) {
        window.location.replace("https://cs330timetracking.github.io/time_io/timers.html");
    } else {
        document.getElementById("submitLoginResponse").innerHTML = "username/password combination not found";
    }
    return false;
}

function registerHandler() {
    console.log("registerHandler");
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    if (localStorage.getItem(username)) {
        document.getElementById("submitLoginResponse").innerHTML = "username already registered";
    } else {
        localStorage.setItem(username, password.hash());
        window.location.replace("https://cs330timetracking.github.io/time_io/timers.html");
    }
    return false;
}
