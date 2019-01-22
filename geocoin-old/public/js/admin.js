  if ( $( "#adminMap" ).length ) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(initAdminMap);
    }
  }

function initAdminMap(position) {
  map = new google.maps.Map(document.getElementById('adminMap'), {
    center: {lat: position.coords.latitude, lng: position.coords.longitude},
    zoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    styles: JSON.parse(mapStyle)
  });

  adminLocMarker = new google.maps.Marker({
    position: {lat: position.coords.latitude, lng: position.coords.longitude},
    map: map,
    icon: {
      url: './img/perIcon.svg',
      scaledSize: new google.maps.Size(10,10)
    }
  });

  map.addListener("click", function(click) {
    $('.newEventLat').val(click.latLng.lat());
    $('.newEventLng').val(click.latLng.lng());
  });

  displayEvents();
}

function dataRefresh() {
  console.log("data refresh request");
  socket.emit('refreshData', "refresh");
}
