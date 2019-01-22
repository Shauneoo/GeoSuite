var map,
    userName,
    userLat,
    userLng,
    lastLat,
    lastLng,
    userLocMarker
    events = [];

var firstTime = true;
var socket = io('https://geocoin.site:8881');
var sessionID;

$(document).ready(function() {
  if ($("#map").length) {
    initMap();
  } else {
    return;
  }
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    styles: JSON.parse(mapStyle)

  });

  userLocMarker = new google.maps.Marker({
    position: {lat: 0, lng: 0},
    map: map,
    icon: {
      url: './img/perIcon.svg',
      scaledSize: new google.maps.Size(10,10)
    }
  });
}

// initial user pos and keeps updating it
function geo_success(position) {
  userLat = position.coords.latitude;
  userLng = position.coords.longitude;
  map.setCenter(new google.maps.LatLng(userLat, userLng));
  userLocMarker.setPosition(new google.maps.LatLng(userLat, userLng));

  if (lastLat == userLat && lastLng == userLng) {
    console.log("same pos", userLat, userLng);
  } else {
    console.log("user has moved", userLat, userLng);
    map.panTo({lat: userLat, lng: userLng});
    userLocMarker.setPosition({lat: userLat, lng: userLng});
  }
  lastLat = userLat;
  lastLng = userLng;
  checkIfUserIsWithinEvent();
}

function geo_error() { alert("Please refresh the page"); }
var geo_options = {enableHighAccuracy: true, maximumAge : 5000, timeout : 10000};
navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);

socket.on('setSessionID', function(data){
  console.log(sessionID);
  sessionID = data;
});

// check if user is not set
if(!localStorage.getItem('userName')) {
  $('.splashPopup').show();
} else {
  // check if socket connection is made
  if(typeof sessionID == "undefined") {
  window.setTimeout(function() {
    console.log(sessionID);
    sendUserData(localStorage.getItem('userName'));
  }, 1000);
  }
}

$(".userInput").on("keypress", function(e) {
  if (e.keyCode == 13) {
    sendUserData($('#userNameInput').val());
    return false;
  }
});

$(".signInContainer button").click(function() {
  sendUserData($('#userNameInput').val());
});

socket.on('newEventsData', function(eventsData) {
  console.log("fresh events data");
  console.log(eventsData);
  for (var i=events.length-1; i>=0; i--) {
    events[i].eventCircle.setMap(null); //remove events from dom
  }
  events = []; //clear events array for new data
  for (var item in eventsData) {
    switch(eventsData[item].type) {
      case "coinCache":
        events.push(new CoinCache(item, eventsData[item]._id, eventsData[item].type, eventsData[item].value, eventsData[item].lat,  eventsData[item].lng, eventsData[item].radius));
        break;
      case "toll":
        events.push(new Toll(item, eventsData[item]._id, eventsData[item].type, eventsData[item].value, eventsData[item].lat,  eventsData[item].lng, eventsData[item].radius));
        break;
      case "passiveEarn":
        events.push(new PassiveEarn(item, eventsData[item]._id, eventsData[item].type, eventsData[item].value, eventsData[item].lat,  eventsData[item].lng, eventsData[item].radius));
        break;
      case "passiveTax":
        events.push(new PassiveTax(item, eventsData[item]._id, eventsData[item].type, eventsData[item].value, eventsData[item].lat,  eventsData[item].lng, eventsData[item].radius));
        break;
    }
  }
  if (firstTime) {
    console.log(firstTime+" this is the first time");
    firstTime = false;
  } else if (!firstTime) {
    console.log(firstTime+ " this is the second time");
    displayEvents();
  }
});

// send user data to be added to db
function sendUserData(userName) {
  socket.emit('createUser', {sessionID: sessionID, userName: userName});
  $('.splashPopup').hide();
  $('nav').attr("style", "display: inline");
}

socket.on('returnUserInfo', function(msgPayload) {
  // display user details
  console.log("getting new user data!")
  $('.userDetails').attr("style", "display: inline");
  $('#userName').text(msgPayload.userName);
  $('#userBalance').text(msgPayload.userBalance);
  // save username to variable
  userName = msgPayload.userName;
  localStorage.setItem('userName', userName);
  displayEvents();
});

function displayEvents() {
  for (var i=events.length-1; i>=0; i--) {
    events[i].display(); // display events to dom
  }
}

function checkIfUserIsWithinEvent() {
  if (!firstTime) {
    for (var i=events.length-1; i>=0; i--) {
      events[i].userWithinEvent();
    }
  }
}

// update user account balance
socket.on('updateUserBalance', function(msgPayload) {
  $('#userBalance').text("Balance: " + msgPayload);
});

// socket.on("removeEventFromDom", function(eventID){
//   events[eventID].removeEvent();
// })

// // misc
function clearLocalData() {
  localStorage.clear();
  location.reload();
}
