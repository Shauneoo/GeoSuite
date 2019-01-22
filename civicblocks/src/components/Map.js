import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps';

import CreateNewProject from './CreateNewProject';
import DonateToProject from './DontateToProject';
import WithdrawFromProject from './WithdrawFromProject';

import mapStyles from '../mapStyle.json'; //https://mapstyle.withgoogle.com/

const GoogleMapsContainer = withGoogleMap(props => (
  /*Map setup*/
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={16}
    center={props.center}
    defaultOptions={{ streetViewControl: false, mapTypeControl: false, zoomControl: false, styles: mapStyles}}
    onClick={props.onMapClick}
  >
  {/*User Pos Marker*/}
  <Marker
    position={props.center}
    icon= {{url: './img/perIcon.svg', scaledSize: new google.maps.Size(10,10)}}
  />

    /*Event Markers Marker*/
    {props.events.map((marker, index) => (
      <Marker
        key={index}
        position={marker.position}
        onClick={() => props.onMarkerClick(marker)}
        icon= {{url: './img/CivicBlocks-Icon.svg', scaledSize: new google.maps.Size(40,50)}}
      >
        {marker.showInfo && (
          <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
            <div>
              <div className='row markerContent'>
                <div className="col"/>
                  <div className='col-8'>
                    <h3>Title: {marker.title}</h3>
                    <p>Balance: {marker.walletBalance}</p>
                    <p>Cause: {marker.cause}</p>
                    <button type="button" className="btn btn-success btn-md" onClick={props.onDonateClick}>Donate</button>
                    <button type="button" className="btn btn-danger btn-md" onClick={props.onWithdrawClick}>Withdraw</button>
                  </div>
                <div className="col"/>
              </div>
            </div>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
));

export default class Map extends Component {
  constructor(props){
    super(props);
    this.state = {
      center: {lat: 55.1056957, lng: -3},
      position: {},
      events: props.events,
      userDetails: props.userDetails,
      showCreateEventFrom: false,
      showDonateForm: false,
      showWithdrawForm: false,
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
    }, (error) => alert(JSON.stringify(error)), options);

    navigator.geolocation.watchPosition((position) => {
      this.setState({
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
        userPosition: {lat: position.coords.latitude, lng: position.coords.longitude}
      });
    }, (error) => alert(JSON.stringify(error)), options);
  }

  handleMapLoad = (map) =>this._mapComponent = map;

  handleMapClick = (e) => {
    //maybe dont update state directly, call create new project, then make an api call then update events
    const nextEvents = [...this.state.events, {
      position: e.latLng,
      defaultAnimation: 2,
      key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
    }];
    this.setState({
      newEventPosition: e.latLng,
      showCreateEventFrom: true,
      events: nextEvents,
    });
  }

  // Toggle to 'true' to show InfoWindow and re-renders component
  handleMarkerClick = (targetMarker) => {
    this.setState({
      currentMarkerID: targetMarker._id,
      events: this.state.events.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: true
          };
        }
        return marker;
      }),
    });
  }

  handleMarkerClose = (targetMarker) => {
    this.setState({
      currentMarkerID: null,
      events: this.state.events.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: false
          };
        }
        return marker;
      }),
    });
  }

  handleProjectDonation = (targetMarker) => {
    this.setState({
      showDonateForm: true
    });
  }

  handleProjectWithdraw = () => {
    this.setState({
      showWithdrawForm: true
    });
  }

  onDonateFormClose = (childFormValue) => this.setState({showDonateForm: childFormValue});
  onWithdrawFormClose = (childFormValue) => this.setState({showWithdrawForm: childFormValue});
  onCreateProjectFormClose = (childFormValue) => this.setState({showCreateEventFrom: childFormValue});
  onCreateProjectFormCancel = () => this.state.events.pop(); //removes half created event

  getLatestEventsData = () => this.props.getLatestEventsData();
  getLatestUserBalance = () => this.props.getLatestUserBalance();


  render() {
    return (
      <div style= {{height: '100%'}}>
        <GoogleMapsContainer
          containerElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          center={this.state.center}
          onMapLoad={this.handleMapLoad}
          userLocation={this.state.userLocation}
          events={this.state.events}
          onMarkerClose={this.handleMarkerClose}
          onMarkerClick={this.handleMarkerClick}
          onDonateClick={this.handleProjectDonation}
          onWithdrawClick={this.handleProjectWithdraw}

          onMapClick={this.handleMapClick}
        />
        <Marker position={this.state.userLocation}/>
        //potientially move to a function call
        <CreateNewProject
          showCreateEventFrom={this.state.showCreateEventFrom}
          onCreateProjectFormClose={this.onCreateProjectFormClose}
          onCreateProjectFormCancel={this.onCreateProjectFormCancel}
          position={this.state.newEventPosition}
          defaultAnimation={this.state.events[this.state.events.length-1].defaultAnimation}
          id={this.state.events[this.state.events.length-1].key}
          getLatestEventsData={this.getLatestEventsData}
        />
        <DonateToProject
          showDonateForm={this.state.showDonateForm}
          onDonateFormClose={this.onDonateFormClose}
          selectedProjectID={this.state.currentMarkerID}
          userDetails={this.state.userDetails}
          getLatestEventsData={this.getLatestEventsData}
          getLatestUserBalance={this.getLatestUserBalance}
        />
        <WithdrawFromProject
         showWithdrawForm={this.state.showWithdrawForm}
         onWithdrawFormClose={this.onWithdrawFormClose}
         selectedProjectID={this.state.currentMarkerID}
         userDetails={this.state.userDetails}
         getLatestEventsData={this.getLatestEventsData}
         getLatestUserBalance={this.getLatestUserBalance}
        />
      </div>
    );
  }
}
