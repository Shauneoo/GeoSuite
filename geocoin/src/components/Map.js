/* global google */
import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import GoogleMapsContainer from './GoogleMapsContainer';

export default class Map extends Component {
  constructor(props){
    super(props);
    this.state = {
      center: {lat: 55.1056957, lng: -3},
      userPosition: props.userPosition,
      events: props.events,
      userDetails: props.userDetails,
      currentID: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    //see if state is set, prevent unneccery render
    this.setState({
      events: nextProps.events,
      userDetails: nextProps.userDetails
    });
  }

  componentDidMount() {
    let options = {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000};

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
        userPosition: {lat: position.coords.latitude, lng: position.coords.longitude}
      });
    }, (error) => console.log(error), options);

    navigator.geolocation.watchPosition((position) => {
      this.setState({
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
        userPosition: {lat: position.coords.latitude, lng: position.coords.longitude}
      });
    }, (error) => console.log(error), options);
  }

  handleMapLoad = (map) => {
    // console.log(JSON.stringify(map.getCenter()));

  };

  onMapIdle = (map) => {
    console.log('map is ready')
  }

  getUserPos = () => {
    // console.log('map is ready')
    // console.log(GetPosition)
  }

  getLatestEventsData = () => this.props.getLatestEventsData();
  getLatestUserBalance = () => this.props.getLatestUserBalance();


  render() {
    return (
      <div style= {{height: '100%'}}>
        <GoogleMapsContainer
          googleMapURL="//maps.googleapis.com/maps/api/js?key=AIzaSyCce1xFKWufJHwv9ox5BnYplLpNlWsMt1I&libraries=geometry"
          containerElement={<div style={{ height: '100%' }} />}
          loadingElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: '100%' }} />}
          center={this.state.center}
          onMapLoad={this.handleMapLoad()}
          onMapIdle={this.onMapIdle()}
          getUserPos={this.getUserPos()}
          userPosition={this.state.userPosition}
          events={this.state.events}
        />
      </div>
    );
  }
}
