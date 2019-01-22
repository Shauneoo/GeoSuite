import React, { PropTypes } from 'react';
import Map from './Map';

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: props.events,
    };
  }

  componentWillReceiveProps(nextProps) {
    //see if state is set, prevent unneccery render
    if (nextProps.events !== this.state.events) {
      this.setState({
        events: nextProps.events
      });
    }
  }

  componentDidMount() {
    // Map.map = this.createEventMarker();
  }

  componentDidUnMount() {
  }

  createEventMarker = () => {
    this.lat = this.state.events[0].lat;
    this.lng = this.state.events[0].lng;

    return new google.maps.Marker({
      map: Map.map,
      position: {lat:this.lat, lng:this.lng},
      // title: this.title,
      icon: {
        url: './img/perIcon.svg',
        scaledSize: new google.maps.Size(10,10)
      }
    });
  }

  render() {
    return (
      <div></div>
    );
  }
}

Event.defaultProps = {

};

Event.propTypes = {
  events: PropTypes.array.isRequired,
};

export default Event;
