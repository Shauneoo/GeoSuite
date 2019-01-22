import React, { Component } from 'react';
import Map from './Map';


class App extends Component {
  render() {
    const location = {lat: 40, lng: -73};

    return (
      <div>
        <div><Map center={location} /></div>
      </div>
    );
  }
}

App.defaultProps = {};

App.propTypes = {};

export default App;
