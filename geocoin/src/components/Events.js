
import React, { PropTypes } from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Marker, Circle } from 'react-google-maps';
import Map from './Map';

import CoinCache from './CoinCache';
import Toll from './Toll';
import PassiveTax from './PassiveTax';
import PassiveEarn from './PassiveEarn';


class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: props.events,
      eventObjects: [],
      userPosition: props.userPosition,
    };
  }

  componentWillReceiveProps(nextProps) {
    //see if state is set, prevent uneccary render
    if (nextProps.events !== this.state.events) {
      this.setState({
        events: nextProps.events
      });
    }
  }

  componentDidMount() {
    this.GenerateEvents();
  }

  componentDidUnMount() {
  }

  // componentDidUpdate(prevProps, prevState) {
  //   alert("updated")
  // }

  MarkerTypes = (event, index) => {
    switch (event.type) {
      case "coinCache":
      return (<CoinCache lat={event.position.lat} lng={event.position.lng} key={index}/>);
      break;

      case "toll":
      return (<Toll lat={event.position.lat} lng={event.position.lng} key={index}/>);
      break;

      case "passiveTax":
      return (<PassiveTax lat={event.position.lat} lng={event.position.lng} radius={event.radius} key={index}/>);
      break;

      case "passiveEarn":
      return (<PassiveEarn lat={event.position.lat} lng={event.position.lng} radius={event.radius} key={index}/>);
      break;

      default:
      console.log("Malformed marker type")
      break;
    }
  }

  GenerateEvents = (props) => {
    let genEvents = [];
    this.props.events.map((event, index) => {genEvents.push(this.MarkerTypes(event, index))});
    this.setState({eventObjects: genEvents})
  }

  RenderMarkers = (props) => {
    return (
      this.state.events.map((event, index) => {
        return (this.MarkerTypes(event, index))
      })
    )
  }

  CheckIfInEvent = () => {
    // for (let event of this.state.eventObjects) {
    //   console.log(event+" "+ this.state.eventObjects[event])
    // }

    // Convert the events to objects
    // for (let i = 0; i < this.state.eventObjects.length; i++) {
    //   // console.log(this.state.eventObjects[i]);
    //   // console.log(this.state.eventObjects[i].latLng.lat());
    //   console.log(this.state.eventObjects.map(x => x.getPosition()))
    //   // console.log(i+" "+ this.state.eventObjects[i])
    // }

    for (let event of this.state.eventObjects) {
      console.log("EventObjects "+ event);
      console.log("Event Pos "+ event.getPosition());
      // console.log(google.maps.geometry.spherical({lat: event.props.lat, lng: event.props.lng}, this.props.userPosition))
      // if (event.type == "toll") {
        // console.log(event.getPosition())

         // event.getPosition().then(LatLng => {
         //   console.log(LatLng);
         // });
      // }
      // event.geometry.spherical.computeDistanceBetween(this.state.userPosition, {lat: event.lag, lng: event.lng})
      // google.maps.geometry.spherical.computeDistanceBetween(this.props.userPosition, {lat: event.lag, lng: event.lng})
      // console.log(event.getCenter())
      // console.log(event.lat)
      // console.log(event.lng)
      // console.log(event.getPosition());

    }
  }

  render() {
    {this.CheckIfInEvent()}
    return (
      <div>
        {this.RenderMarkers(this.state.events)}
      </div>
    );
  }
}

export default Event;
