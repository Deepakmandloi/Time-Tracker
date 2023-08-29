// Interval (in seconds) to update timer
var UPDATE_INTERVAL = 1;

setDefaults();
// Set default settings
function setDefaults() {
  // Set date
  if (!localStorage["date"]) {
    localStorage["date"] = new Date().toLocaleDateString();
  }
  // Set domains seen before
  if (!localStorage["domains"]) {
    localStorage["domains"] = JSON.stringify({});
  }
  // Set total time spent
  if (!localStorage["total"]) {
    localStorage["total"] = JSON.stringify({
      today: 0
    });
  }
  // The time limit user sets for a day
  if (!localStorage["daily_limit_hr"]) {
    localStorage["daily_limit_hr"] = 24;
  }
  if (!localStorage["daily_limit_min"]) {
    localStorage["daily_limit_min"] = 00;
  }
  if (!localStorage["daily_limit_sec"]) {
    localStorage["daily_limit_sec"] = 00;
  }
  //To keep track if a notification has been displayed today
  if (!localStorage["flag"]) {
    localStorage["flag"] = 0;
  }
  // Limit how many sites the chart shows
  if (!localStorage["chart_limit"]) {
    localStorage["chart_limit"] = 7;
  }
  // Set "other" category
  // NOTE: other.today is not currently used
  if (!localStorage["other"]) {
    localStorage["other"] = JSON.stringify({
      today: 0
    });
  }
}

// Add sites which are not in the top threshold sites to "other" category
function combineEntries(threshold) {
  var domains = JSON.parse(localStorage["domains"]);
  var other = JSON.parse(localStorage["other"]);
  // Don't do anything if there are less than threshold domains
  if (Object.keys(domains).length <= threshold) {
    return;
  }
  // Sort the domains by decreasing "all" time
  var data = [];
  for (var domain in domains) {
    var domain_data = JSON.parse(localStorage[domain]);
    data.push({
      domain: domain,
    });
  }
  data.sort(function (a, b) {
    return b.today - a.today;
  });
  // Delete data after top threshold and add it to other
  for (var i = threshold; i < data.length; i++) {
    var domain = data[i].domain;
    delete localStorage[domain];
    delete domains[domain];
  }
  localStorage["other"] = JSON.stringify(other);
  localStorage["domains"] = JSON.stringify(domains);
}

// Check to make sure data is kept for the same day
function checkDate() {
  var todayStr = new Date().toLocaleDateString();
  var saved_day = localStorage["date"];
  if (saved_day !== todayStr) {
    localStorage["flag"]=0;
    // Reset today's data
    var domains = JSON.parse(localStorage["domains"]);
    for (var domain in domains) {
      var domain_data = JSON.parse(localStorage[domain]);
      domain_data.today = 0;
      localStorage[domain] = JSON.stringify(domain_data);
    }
    // Reset total for today
    var total = JSON.parse(localStorage["total"]);
    total.today = 0;
    localStorage["total"] = JSON.stringify(total);
    // Combine entries that are not part of top 500 sites
    combineEntries(500);
    localStorage["date"] = todayStr;
  }
}

// Extract the domain from the url
// e.g. http://google.com/ -> google.com
function extractDomain(url) {
  var re = /:\/\/(www\.)?(.+?)\//;
  return url.match(re)[2];
}

function inBlacklist(url) {
  if (!url.match(/^http/)) {
    return true;
  }
  return false;
}

// Update the data
function updateData() {
  // Only count time if system has not been idle for 30 seconds
  chrome.idle.queryState(30, function (state) {
    if (state === "active") {
      // Select single active tab from focused window
      chrome.tabs.query({ lastFocusedWindow: true, active: true }, function (
        tabs
      ) {
        if (tabs.length === 0) {
          return;
        }
        var tab = tabs[0];
        // Make sure 'today' is up-to-date
        checkDate();
        if (!inBlacklist(tab.url)) {
          var domain = extractDomain(tab.url);
          // Add domain to domain list if not already present
          var domains = JSON.parse(localStorage["domains"]);
          if (!(domain in domains)) {
            domains[domain] = 1;
            localStorage["domains"] = JSON.stringify(domains);
          }
          var domain_data;
          if (localStorage[domain]) {
            domain_data = JSON.parse(localStorage[domain]);
          } else {
            domain_data = {
              today: 0
            };
          }
          domain_data.today += UPDATE_INTERVAL;
          localStorage[domain] = JSON.stringify(domain_data);
          // Update total time
          var total = JSON.parse(localStorage["total"]);
          total.today += UPDATE_INTERVAL;
          localStorage["total"] = JSON.stringify(total);
          // Update badge with number of minutes spent on
          // current site
          var num_min = Math.floor(domain_data.today / 60).toString();
          if (num_min.length < 4) {
            num_min += "m";
          }
          chrome.browserAction.setBadgeText({
            text: num_min,
          });
        } else {
          // Clear badge
          chrome.browserAction.setBadgeText({
            text: "",
          });
        }
      });
    }
  });
  var h = parseInt(localStorage["daily_limit_hr"], 10);
  var m = parseInt(localStorage["daily_limit_min"], 10);
  var s = parseInt(localStorage["daily_limit_sec"], 10);
  var total = JSON.parse(localStorage["total"]);
  var daily_limit = 3600*h + 60*m + s;
  //display notification if the total time is exceeds the set limit
  if(total.today >= daily_limit && localStorage["flag"]==0){
    var notifOptions = {
        type: 'basic',
        iconUrl: '..\Images\icon48.png',
        title: 'Limit Reached for Today',
        message: "Your Web Time has finished for the Day !!!"
    };
    chrome.notifications.create('limitNotif', notifOptions);
    localStorage["flag"]=1;
  }
}
// Update timer data every UPDATE_INTERVAL seconds
setInterval(updateData, UPDATE_INTERVAL * 1000);
