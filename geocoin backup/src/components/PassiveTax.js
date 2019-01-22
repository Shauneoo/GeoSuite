import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Circle} from 'react-google-maps';

function PassiveTax(props) {
  return (
    <Circle
      key={props.key}
      center={{lat: props.lat, lng: props.lng}}
      radius={props.radius}
      options={{
        fillColor:'#1B9AB7',
        fillOpacity: 0.35,
        strokeWeight: 0,
      }}
    />
  )
}

export default PassiveTax;
