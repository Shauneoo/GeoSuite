var eventMarker;
var eventCircle;
var markerContent;

class Charity {
  constructor (eArrayID, _id, type, lat, lng, title, radius, cause, balance) {
    this.eArrayID = eArrayID,
    this._id = _id,
    this.type = type,
    this.lat = lat,
    this.lng = lng,
    this.title = title,
    this.radius = radius,
    this.cause = cause,
    this.balance = balance;
  }

  display() {
    eventCircle = new google.maps.Circle({
      strokeOpacity: 0,
      fillColor: '#A80F26',
      fillOpacity: 0.2,
      map: map,
      center: {lat:this.lat, lng:this.lng},
      radius: this.radius
    });

    eventMarker = new google.maps.Marker({
      map: map,
      position: {lat:this.lat, lng:this.lng},
      title: this.title,
      icon: {
        url: './img/geoaid-pin.svg',
        scaledSize: new google.maps.Size(28.6,38.4)
      }
    });

    markerContent =
    '<div class="row" id="markerContent">'+
      '<div class="col"></div>'+
      '<div class="col-8">'+
        '<h3>'+this.title+'</h3>'+
        '<div id="bodyContent">'+
        '<p id="eventBalance">Balance: '+this.balance+'</p>'+
        '<p>Cause: '+this.cause+'</p>'+
        '</div>'+
        '<button type="button" class="btn btn-success btn-sm" onclick="showDonatePopup('+this.eArrayID+')">Donate</button>'+
        '<button id=withdrawButton type="button" class="btn btn-danger btn-sm collapse" onclick="showWithdrawPopup('+this.eArrayID+')">Withdraw</button>'+
      '</div>'+
      '<div class="col"></div>'+
    '</div>';

    console.log(events[this.eArrayID]);
    events[this.eArrayID].eventCircle = eventCircle;
    events[this.eArrayID].eventMarker = eventMarker;

    this.attachInfoWindow(events[this.eArrayID].eventMarker);
  }

  attachInfoWindow(eventMarker) {
    eventMarker.markerInfoWindow = new google.maps.InfoWindow({
      content: markerContent
    });

    eventMarker.addListener('click', function() {
      eventMarker.markerInfoWindow.open(eventMarker.get('map'), eventMarker);
    });
  }

  donate(amount) {
    socket.emit('sendEventDonationToDB', {sessionID, userName: userName, _id: this._id, amount: amount});
    socket.emit('refreshData', "refresh");
  }

  withdraw(amount) {
    socket.emit('withdrawFromEvent', {sessionID, userName: userName, _id: this._id, amount: -Math.abs(amount)});
    socket.emit('refreshData', "refresh");
  }

  // is the user within the event
  userWithinEventRadius() {
    if (google.maps.geometry.spherical.computeDistanceBetween(userLocMarker.getPosition(), this.eventCircle.getCenter()) <= this.radius) {
      $('#withdrawButton').show();
    } else {
      $('#withdrawButton').hide();
    }
  }
}
