// Saves options to localStorage.
function save_options() {
    // Check daily limit data
    var daily_limit_hr = parseInt(document.getElementById("daily_limit_hr").value);
    if (!isNaN(daily_limit_hr)) {
      localStorage["daily_limit_hr"] = daily_limit_hr;
    } else {
      document.getElementById("daily_limit_hr").value = localStorage["daily_limit_hr"];
    }
  
    var daily_limit_min = parseInt(document.getElementById("daily_limit_min").value);
    if (!isNaN(daily_limit_min)) {
      localStorage["daily_limit_min"] = daily_limit_min;
    } else {
      document.getElementById("daily_limit_min").value = localStorage["daily_limit_min"];
    }
  
    var daily_limit_sec = parseInt(document.getElementById("daily_limit_sec").value);
    if (!isNaN(daily_limit_sec)) {
      localStorage["daily_limit_sec"] = daily_limit_sec;
    } else {
      document.getElementById("daily_limit_sec").value = localStorage["daily_limit_sec"];
    }
  
    // Check chart limit data
    var limit = parseInt(document.getElementById("chart_limit").value);
    if (limit) {
      localStorage["chart_limit"] = limit;
    } else {
      document.getElementById("chart_limit").value = localStorage["chart_limit"];
    }
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Options Saved.";
    status.className = "success";
    setTimeout(function () {
      status.innerHTML = "";
      status.className = "";
    }, 750);
  }
  
  // Restores select box state to saved value from localStorage.
  function restore_options() {
    document.getElementById("daily_limit_hr").value = localStorage["daily_limit_hr"];
    document.getElementById("daily_limit_min").value = localStorage["daily_limit_min"];
    document.getElementById("daily_limit_sec").value = localStorage["daily_limit_sec"];
  
    document.getElementById("chart_limit").value = localStorage["chart_limit"];
  }
  
  function clearData() {
    localStorage.clear();
    chrome.extension.getBackgroundPage().setDefaults();
    location.reload();
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    // Restore options
    restore_options();
  
    // Set handlers for option descriptions
    document.querySelector("#save-button").addEventListener("click", save_options);
    document.querySelector("#clear-data").addEventListener("click", clearData);
  });
  