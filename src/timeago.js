
var controller = {};

controller.asString = function (date) {
  if (Date.now() < date) {
    return "hasn't happened yet";
  }
  var seconds = Math.round((Date.now() - date.getTime())/1000);
  console.log(seconds);
  if (seconds < 60){
    return seconds + " seconds ago";
  }
  var minutes = Math.round(seconds/60);
  if (minutes <= 60){
    return minutes + " minutes ago";
  }
  var hours = Math.round(minutes/60);
  if (hours < 24){
    return hours + " hours ago";
  }
  var days = Math.round(hours/24);
  if (days < 24){
    return days + " days ago";
  }
  var months = Math.round(days/30);
  return months + " months ago";
};

module.exports = controller;