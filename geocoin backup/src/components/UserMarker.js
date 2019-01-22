import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker} from 'react-google-maps';

function UserMarker(props) {
  return (
    <Marker
      position={props.center}
      icon= {{url: './img/perIcon.svg', scaledSize: new google.maps.Size(10,10)}}
    />
  )
}

export default UserMarker;
