import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker} from 'react-google-maps';

function CoinCache(props) {
  return (
    <Marker
      key={props.key}
      position={{lat: props.lat, lng: props.lng}}
      icon= {{url: './img/cache.svg', scaledSize: new google.maps.Size(40,50)}}
    />
  )
}

export default CoinCache;
