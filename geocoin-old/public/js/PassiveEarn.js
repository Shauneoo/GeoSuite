var eventCircle;
var timer = 0;

class PassiveEarn {
  constructor (eArrayID, _id, type, value, lat, lng, radius) {
    this.eArrayID = eArrayID,
    this._id = _id,
    this.type = type,
    this.value = value,
    this.lat = lat,
    this.lng = lng,
    this.radius = radius
  }

  display() {
    eventCircle = new google.maps.Circle({
      strokeOpacity: 0,
      fillColor: '#90C02F',
      fillOpacity: 0.35,
      map: map,
      center: {lat:this.lat, lng:this.lng},
      radius: this.radius
    });
    console.log(events[this.eArrayID]);
    events[this.eArrayID].eventCircle = eventCircle; //may not be needed
  }

  // is the user within the event
  userWithinEvent() {
    if (google.maps.geometry.spherical.computeDistanceBetween(userLocMarker.getPosition(), this.eventCircle.getCenter()) <= this.radius) {
      console.log("User within this event:");
      console.log(events[this.eArrayID]);
      console.log("user within event");
      function counter(userName, type, eventID)  {
        timer++;
        socket.emit('processEventAction', {userName: userName, type: type, value: 1, eventID: eventID});
        console.log("Completed incrementation, " + timer);

        counter = function() {};
      }
      counter(userName, this.type, this._id);
    } else {
      console.log("user not in event");
      if (timer > 0) {
        timer = 0;
        console.log("resetting counter to "+ timer);
      }
    }
  }
}
