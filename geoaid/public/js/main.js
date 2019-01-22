var map,
    userName,
    userLocMarker,
    events = [],
    firstTime = true,
    sessionID,
    firstCentered = true;

var socket = io.connect();
// var socket = io.connect('https://178.62.40.252:8080');

$(document).ready(function() {
  if ($("#map").length) {
    initMap();
  } else {
    return;
  }
});

// add map to DOM
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    styles: JSON.parse(mapStyle)
  });
  //add user icon to map
  userLocMarker = new google.maps.Marker({
    position: {lat: 0, lng: 0},
    map: map,
    icon: {
      url: './img/perIcon.svg',
      scaledSize: new google.maps.Size(10,10)
    }
  });

  map.addListener("click", function(click) {
    clickLat = click.latLng.lat()
    clickLng = click.latLng.lng()
  });

  (function() {
    var pressTimer;
    $("#map").mouseup(function(){
      clearTimeout(pressTimer);
      return false;
    }).mousedown(function(){
      pressTimer = window.setTimeout(function() {
        createNewEventForm(clickLat, clickLng);
      },1000);
      return false;
    });
  }());
}

function geo_success(position) {
  userLat = position.coords.latitude;
  userLng = position.coords.longitude;
  alert("success");
  if (firstCentered) {
    map.setCenter(new google.maps.LatLng(userLat, userLng));
    userLocMarker.setPosition(new google.maps.LatLng(userLat, userLng));
    firstCentered = false;
  }
  checkIfUserIsWithinEvent();
}

function geo_error() { alert("Sorry, no position available."); }
var geo_options = {enableHighAccuracy: true, maximumAge : 5000, timeout : 10000};
//detect if user has moved
navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);

// set ID to enable multi-users
socket.on('setSessionID', function(data){
  sessionID = data;
});

// check if user data is stored in localStorage
if(!localStorage.getItem('userName')) {
  $('.splashPopup').show();
} else {
  // check if socket connection is made
  if(typeof sessionID == "undefined") {
    console.log("session not set, retrying");
    window.setTimeout(function() {
      console.log("session is: ",sessionID);
      //retrieve userName from localStorage and send it
      if(typeof sessionID !== "undefined") {
        sendUserData(localStorage.getItem('userName'));
        return;
      }
    }, 500);
  }
}

//redirect return key to function
$(".userInput").on("keypress", function(e) {
  if (e.keyCode == 13) {
    sendUserData($('#userNameInput').val());
    return false;
  }
});
//send userData to db
$(".signInContainer button").click(function() {
  sendUserData($('#userNameInput').val());
});

// on recieving new eventsData create events
socket.on('newEventsData', function(eventsData) {
  console.log("fresh events data");
  for (var i=events.length-1; i>=0; i--) {
    events[i].eventCircle.setMap(null);
    events[i].eventMarker.setMap(null); //remove events from dom

  }
  events = []; //clear events array for new data
  for (var item in eventsData) {
    events.push(new Charity(item, eventsData[item]._id,eventsData[item].type, eventsData[item].lat,  eventsData[item].lng, eventsData[item].title, eventsData[item].radius, eventsData[item].cause, eventsData[item].walletBalance));
  }
  if (firstTime) {
    firstTime = false;
  } else if (!firstTime) {
    displayEvents();
  }
});

// send user data to be added to db
function sendUserData(userName) {
  console.log("new username:", userName);
  socket.emit('createUser', {sessionID: sessionID, userName: userName});
  $('.splashPopup').hide();
  $('nav').attr("style", "display: inline");
}

// return retrieved user data to client
socket.on('returnUserInfo', function(msgPayload) {
  console.log("getting new user data!");
  $('.userDetails').attr("style", "display: inline");
  $('.userName').text(msgPayload.userName);
  $('.confirmedUserBalance').text(msgPayload.confirmedUserBalance);
  $('.pendingAccountBalance').text(msgPayload.pendingAccountBalance);
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
      events[i].userWithinEventRadius();
    }
  }
}

// update user account balance
socket.on('updateUserBalance', function(msgPayload) {
  $('.confirmedUserBalance').text(msgPayload.confirmedUserBalance);
  $('.pendingAccountBalance').text(msgPayload.pendingAccountBalance);
});

function createNewEventForm(lat, lng) {
  $('#eventInputLat').remove();
  $('#eventInputLng').remove();
  $('#eventName').val('');
  $('#eventCause').val('');
  $('#eventRadius').val('');
  $('#eventFormLat').append('<input class="form-control" id=eventInputLat type="text" placeholder="latitude" value="'+lat+'">');
  $('#eventFormLng').append('<input class="form-control" id=eventInputLng type="text" placeholder="longitude" value="'+lng+'">');
  $('#eventFormLat').hide();
  $('#eventFormLng').hide();
  // show form
  $('#newEventForm').toggle();
}

//process new chairty event
function processNewCharityEvent() {
  socket.emit('createEvent', {lat: $('#eventInputLat').val(), lng: $('#eventInputLng').val(), title: $('#eventName').val(), radius: $('#eventRadius').val(), cause: $('#eventCause').val()});
  $('#newEventForm').toggle();
}

function showDonatePopup(eventID) {
  console.log(eventID);
  $("#donate").toggle();
  $("#donate").attr('eventID', eventID);
}

function showWithdrawPopup(eventID) {
  $("#withdraw").toggle();
  $("#withdraw").attr('eventID', eventID);
}

function processDonation() {
  $("#donate").toggle();
  events[$('#donate').attr('eventID')].donate($('#donationValue').val());
  $('#donationValue').val('');
  $('#donationConditions').val('');
}

function processWithdraw() {
  $("#withdraw").toggle();
  events[$('#withdraw').attr('eventID')].withdraw($('#withdrawValue').val());
  $('#withdrawValue').val('');
  $('#withdrawUses').val('');
  $('#verificationConditions').val('');
}

// // misc
function clearLocalData() {
  localStorage.clear();
  location.reload();
}
