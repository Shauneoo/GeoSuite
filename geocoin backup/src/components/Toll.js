import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker} from 'react-google-maps';

function Toll(props) {
  return (
    <Marker
      key={props.key}
      position={{lat: props.lat, lng: props.lng}}
      icon= {{url: './img/toll.svg', scaledSize: new google.maps.Size(40,50)}}
    />
  )
}

export default Toll;
