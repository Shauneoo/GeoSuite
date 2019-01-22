/* global google */
import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, withScriptjs} from 'react-google-maps';
import mapStyles from '../mapStyle.json'; //https://mapstyle.withgoogle.com/

import UserMarker from './UserMarker';
import Events from './Events';


const GoogleMapsContainer = withScriptjs(withGoogleMap(props => (
  <GoogleMap
    ref={props.handleMapLoad}
    onIdle={props.onMapIdle}
    defaultZoom={16}
    center={props.center}
    defaultOptions={{ streetViewControl: false, mapTypeControl: false, zoomControl: false, styles: mapStyles}}
  >
    <UserMarker center={props.userPosition} getPosition={props.getUserPos}/>
    <Events events={props.events} userPosition={props.userPosition}/>
  </GoogleMap>
)));

export default GoogleMapsContainer;
