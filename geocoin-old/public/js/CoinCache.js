var eventCircle;

class CoinCache {
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
    eventCircle = new google.maps.Marker({
      position: new google.maps.LatLng(this.lat, this.lng),
      map: map,
      icon: {
        url: './img/cache.svg',
        scaledSize: new google.maps.Size(28.6,38.4),
      }
    });
    console.log(events[this.eArrayID]);
    events[this.eArrayID].eventCircle = eventCircle;
  }

  // is the user within the event
  userWithinEvent() {
    if (google.maps.geometry.spherical.computeDistanceBetween(userLocMarker.getPosition(), this.eventCircle.getPosition()) <= this.radius) {
      socket.emit("sendEventID", this.eArrayID);
      socket.emit('processEventAction', {userName: userName, type: this.type, value: this.value, eventID: this._id});
    }
  }

  // removeEvent() {
  //   this.eventCircle.setMap(null);
  //   events.splice(this.eArrayID, 1);
  // }

}
