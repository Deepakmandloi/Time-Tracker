// Load the Visualization API and the piechart package.
google.charts.load("current", { packages: ["corechart", "table"] });

google.charts.setOnLoadCallback(function () {
  displayData();
});

// Converts duration to String
function timeString(numSeconds) {
  if (numSeconds === 0) {
    return "0 sec";
  }
  var remainder = numSeconds;
  var timeStr = "";
  var timeTerms = {
    hr: 3600,
    min: 60,
    sec: 1,
  };
  // Construct the time string
  for (var term in timeTerms) {
    var divisor = timeTerms[term];
    if (remainder >= divisor) {
      var numUnits = Math.floor(remainder / divisor);
      timeStr += numUnits + " " + term;
      remainder = remainder % divisor;
      if (remainder) {
        timeStr += " ";
      }
    }
  }
  return timeStr;
}

// Show the data for the time period indicated by addon
function displayData() {
  // Get the domain data
  var domains = JSON.parse(localStorage["domains"]);
  var chart_data = [];
  var table_data = [];
  // var colors = ['#5c91e6', '#a711f2', '#c353e6', '#ed39a8', '#e66ec8', '#eb3147', '#ffae00', '#0db81e', '#fff700'];
  for (var domain in domains) {
    var domain_data = JSON.parse(localStorage[domain]);
    var numSeconds = 0;
    numSeconds = domain_data.today;
    if (numSeconds > 0) {
      chart_data.push([
        domain,
        {
          v: numSeconds,
          f: timeString(numSeconds),
          p: {
            style: "text-align: left; white-space: normal;",
          },
        },
      ]);
      var rnd = Math.floor(Math.random() * 8);
      switch(rnd) {
        case 0:
          table_data.push([
            {
              v: domain,
              p:{
                style: "text-align: left; white-space: normal; background-color: #5c91e6;"
              }
            },
            {
              v: numSeconds,
              f: timeString(numSeconds),
              p: {
                style: "text-align: left; white-space: normal; background-color: #5c91e6;"
              }
            }
          ]);
          break;
        case 1:
          table_data.push([
            {
              v: domain,
              p:{
                style: "text-align: left; white-space: normal; background-color: #a711f2;"
              }
            },
            {
              v: numSeconds,
              f: timeString(numSeconds),
              p: {
                style: "text-align: left; white-space: normal; background-color: #a711f2;"
              }
            }
          ]);
          break;
        case 2:
          table_data.push([
            {
              v: domain,
              p:{
                style: "text-align: left; white-space: normal; background-color: #c353e6;"
              }
            },
            {
              v: numSeconds,
              f: timeString(numSeconds),
              p: {
                style: "text-align: left; white-space: normal; background-color: #c353e6;"
              }
            }
          ]);
          break;
        case 3:
          table_data.push([
            {
              v: domain,
              p:{
                style: "text-align: left; white-space: normal; background-color: #ed39a8;"
              }
            },
            {
              v: numSeconds,
              f: timeString(numSeconds),
              p: {
                style: "text-align: left; white-space: normal; background-color: #ed39a8;"
              }
            }
          ]);
          break;
        case 4:
          table_data.push([
            {
              v: domain,
              p:{
                style: "text-align: left; white-space: normal; background-color: #e66ec8;"
              }
            },
            {
              v: numSeconds,
              f: timeString(numSeconds),
              p: {
                style: "text-align: left; white-space: normal; background-color: #e66ec8;"
              }
            }
          ]);
          break;
        case 5:
          table_data.push([
            {
              v: domain,
              p:{
                style: "text-align: left; white-space: normal; background-color: #eb3147;"
              }
            },
            {
              v: numSeconds,
              f: timeString(numSeconds),
              p: {
                style: "text-align: left; white-space: normal; background-color: #eb3147;"
              }
            }
          ]);
          break;
        case 6:
          table_data.push([
            {
              v: domain,
              p:{
                style: "text-align: left; white-space: normal; background-color: #ffae00;"
              }
            },
            {
              v: numSeconds,
              f: timeString(numSeconds),
              p: {
                style: "text-align: left; white-space: normal; background-color: #ffae00;"
              }
            }
          ]);
          break;
        case 7:
          table_data.push([
            {
              v: domain,
              p:{
                style: "text-align: left; white-space: normal; background-color: #0db81e;"
              }
            },
            {
              v: numSeconds,
              f: timeString(numSeconds),
              p: {
                style: "text-align: left; white-space: normal; background-color: #0db81e;"
              }
            }
          ]);
          break;
        default:
          table_data.push([
            {
              v: domain,
              p:{
                style: "text-align: left; white-space: normal; background-color: #5c91e6;"
              }
            },
            {
              v: numSeconds,
              f: timeString(numSeconds),
              p: {
                style: "text-align: left; white-space: normal; background-color: #5c91e6;"
              }
            }
          ]);
      }
      // table_data.push([
      //   {
      //     v: domain,
      //     p:{
      //       style: "text-align: left; white-space: normal; background-color: cyan;"
      //     }
      //   },
      //   {
      //     v: numSeconds,
      //     f: timeString(numSeconds),
      //     p: {
      //       style: "text-align: left; white-space: normal; background-color: cyan;"
      //     }
      //   }
      // ]);
    }
  }

  // Display help message if no data
  if (chart_data.length === 0) {
    document.getElementById("nodata").style.display = "inline";
  } else {
    document.getElementById("nodata").style.display = "none";
  }

  // Sort data by descending duration
  chart_data.sort(function (a, b) {
    return b[1].v - a[1].v;
  });
  table_data.sort(function (a, b) {
    return b[1].v - a[1].v;
  });

  // Limit chart data
  var limited_data_chart = [];
  var limited_data_table = [];
  var chart_limit;
  // For screenshot: if in iframe, image should always have 9 items
  if (top == self) {
    chart_limit = parseInt(localStorage["chart_limit"], 10);
  } else {
    chart_limit = 9;
  }
  for (var i = 0; i < chart_limit && i < chart_data.length; i++) {
    limited_data_chart.push(chart_data[i]);
    limited_data_table.push(table_data[i]);
  }
  var sum = 0;
  for (var i = chart_limit; i < chart_data.length; i++) {
    sum += chart_data[i][1].v;
  }

  if (sum > 0) {
    limited_data_chart.push([
      "Others",
      {
        v: sum,
        f: timeString(sum),
        p: {
          style: "text-align: left; white-space: normal;",
        },
      },
    ]);
    var rnd = Math.floor(Math.random() * 8);
      switch(rnd) {
        case 0:
          limited_data_table.push([
            {
              v: "Others",
              p:{
                style: "text-align: left; white-space: normal; background-color: #5c91e6;"
              }
            },
            {
              v: sum,
              f: timeString(sum),
              p: {
                style: "text-align: left; white-space: normal; background-color: #5c91e6;"
              }
            }
          ]);
          break;
        case 1:
          limited_data_table.push([
            {
              v: "Others",
              p:{
                style: "text-align: left; white-space: normal; background-color: #a711f2;"
              }
            },
            {
              v: sum,
              f: timeString(sum),
              p: {
                style: "text-align: left; white-space: normal; background-color: #a711f2;"
              }
            }
          ]);
          break;
        case 2:
          limited_data_table.push([
            {
              v: "Others",
              p:{
                style: "text-align: left; white-space: normal; background-color: #c353e6;"
              }
            },
            {
              v: sum,
              f: timeString(sum),
              p: {
                style: "text-align: left; white-space: normal; background-color: #c353e6;"
              }
            }
          ]);
          break;
        case 3:
          limited_data_table.push([
            {
              v: "Others",
              p:{
                style: "text-align: left; white-space: normal; background-color: #ed39a8;"
              }
            },
            {
              v: sum,
              f: timeString(sum),
              p: {
                style: "text-align: left; white-space: normal; background-color: #ed39a8;"
              }
            }
          ]);
          break;
        case 4:
          limited_data_table.push([
            {
              v: "Others",
              p:{
                style: "text-align: left; white-space: normal; background-color: #e66ec8;"
              }
            },
            {
              v: sum,
              f: timeString(sum),
              p: {
                style: "text-align: left; white-space: normal; background-color: #e66ec8;"
              }
            }
          ]);
          break;
        case 5:
          limited_data_table.push([
            {
              v: "Others",
              p:{
                style: "text-align: left; white-space: normal; background-color: #eb3147;"
              }
            },
            {
              v: sum,
              f: timeString(sum),
              p: {
                style: "text-align: left; white-space: normal; background-color: #eb3147;"
              }
            }
          ]);
          break;
        case 6:
          limited_data_table.push([
            {
              v: "Others",
              p:{
                style: "text-align: left; white-space: normal; background-color: #ffae00;"
              }
            },
            {
              v: sum,
              f: timeString(sum),
              p: {
                style: "text-align: left; white-space: normal; background-color: #ffae00;"
              }
            }
          ]);
          break;
        case 7:
          limited_data_table.push([
            {
              v: "Others",
              p:{
                style: "text-align: left; white-space: normal; background-color: #0db81e;"
              }
            },
            {
              v: sum,
              f: timeString(sum),
              p: {
                style: "text-align: left; white-space: normal; background-color: #0db81e;"
              }
            }
          ]);
          break;
        default:
          limited_data_table.push([
            {
              v: "Others",
              p:{
                style: "text-align: left; white-space: normal; background-color: #5c91e6;"
              }
            },
            {
              v: sum,
              f: timeString(sum),
              p: {
                style: "text-align: left; white-space: normal; background-color: #5c91e6;"
              }
            }
          ]);
      }
    // limited_data_table.push([
    //   "Other",
    //   {
    //     v: sum,
    //     f: timeString(sum),
    //     p: {
    //       style: "text-align: left; white-space: normal; background-color: cyan;",
    //     },
    //   },
    // ]);
  }

  drawChart(limited_data_chart);

  // Add total time
  var total = JSON.parse(localStorage["total"]);
  var numSeconds = 0;
  numSeconds = total.today;
  limited_data_table.push([
    {
      v: "Total",
      p: {
        style: "text-align: left; font-weight: bold; background-color: cyan;",
      },
    },
    {
      v: numSeconds,
      f: timeString(numSeconds),
      p: {
        style: "text-align: left; white-space: normal; font-weight: bold; background-color: cyan;",
      },
    },
  ]);

  drawTable(limited_data_table);
}
function drawChart(chart_data) {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Domain");
  data.addColumn("number", "Time");
  data.addRows(chart_data);

  // Set chart options
  var options = {
    tooltip: {
      text: "percentage",
    },
    chartArea: {
      width: 400,
      height: 180,
    },
    is3D: true,
    pieHole : 0.4,
    colors: ['#5c91e6', '#a711f2', '#c353e6', '#ed39a8', '#e66ec8', '#eb3147', '#ffae00', '#0db81e']
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(
    document.getElementById("chart_div")
  );
  chart.draw(data, options);
}

function drawTable(table_data) {
  var data = new google.visualization.DataTable();
  // data.addColumn("string", "x");
  data.addColumn("string", "Domain");
  data.addColumn("number", "Time Spent Today");
  data.addRows(table_data);

  var options = {
    allowHtml: true,
    sort: "disable",
    width: "100%",
    height: "100%",
  };
  var table = new google.visualization.Table(
    document.getElementById("table_div")
  );
  table.draw(data, options);
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#options").addEventListener("click", function() {
    chrome.tabs.create({
      url: "html/options.html",
    });
  });
});
