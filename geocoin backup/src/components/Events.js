import React, { PropTypes } from 'react';
import {withGoogleMap, GoogleMap, Marker, Circle} from 'react-google-maps';
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
  }

  componentDidUnMount() {
  }

  // componentDidUpdate(prevProps, prevState) {
  //   alert("updated")
  // }

  MarkerTypes = (event, index) => {
    switch (event.type) {
      case "coinCache":
      return (<CoinCache lat={event.lat} lng={event.lng} key={index}/>);
      break;

      case "toll":
      return (<Toll lat={event.lat} lng={event.lng} key={index}/>);
      break;

      case "passiveTax":
      return (<PassiveTax lat={event.lat} lng={event.lng} radius={event.radius} key={index}/>);
      break;

      case "passiveEarn":
      return (<PassiveEarn lat={event.lat} lng={event.lng} radius={event.radius} key={index}/>);
      break;

      default:
      console.log("Malformed marker type")
      break;
    }
  }

  RenderMarkers = (props) => {
    return (
      this.state.events.map((event, index) => {
        return (this.MarkerTypes(event, index))
      })
    )
  }

  CheckIfInEvent = () => {

    //Convert the events to objects

    for (const event of this.state.events) {
      // console.log(event)
      // if (event.type == "toll") {
        // console.log(event.getPosition())
      // }
      // geometry.spherical.computeDistanceBetween(this.state.userPosition, {lat: event.lag, lng: event.lng})
      // google.maps.geometry.spherical.computeDistanceBetween(this.props.userPosition, {lat: event.lag, lng: event.lng})
      // console.log(event.getCenter())
      console.log(event.lat)
      console.log(event.lng)
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
