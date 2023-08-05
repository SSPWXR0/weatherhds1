// shows the time

function updateDateTime() {
    const now = new Date();
    const datetimeDiv = document.getElementById("datetime");
    datetimeDiv.textContent = now.toLocaleString();
  }

  updateDateTime();
  setInterval(updateDateTime, 1000); // update every second