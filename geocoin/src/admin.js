import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import * as api from './api';

import Map from './components/Map';
import SplashForm from './components/SplashForm';
import UserDetails from './components/UserDetails';

class Index extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false,
      userDetails: {
        name: '',
        account: '',
        confirmedBalance: '',
        pendingBalance: ''
      },
      userPosition: {},
      events: [{
        _id: '',
        position: {lat: '', lng: ''},
        title: '',
        radius: '',
        cause: '',
        key: '',
        defaultAnimation: '',
        infoContent: '',
        walletID: '',
        WalletBalance: '',
        showInfo: '',
      }],
    };
  }

  componentDidMount() {
    this.getLatestEventsData();
  }

  getLatestEventsData = () => {
    api.fetchEvents().then(eventsData => {
      console.log("Getting event data ",eventsData)
      this.setState({events: eventsData});
    });
  }

  getLatestUserBalance = () => {
    api.fetchUserBalance(this.state.userDetails._id).then(data => {
      this.setState({userDetails: data});
    });
  }

  getUserDetailsFromDB = (user) => {
    this.setState({
      isLoggedIn: true, //waited until data is returned before updating
      userDetails: user
    });
  }

  // getUserLocation = (userPositionData) => this.setState({userPosition: userPositionData});

  render() {
    return(
      <div style= {{height: '100vh', width: '100%'}}>
        <Map
          userPosition={this.state.userPosition}
          userDetails={this.state.userDetails}
          events={this.state.events}
          getLatestEventsData={this.getLatestEventsData}
          getLatestUserBalance={this.getLatestUserBalance} />
        <UserDetails
          userDetails={this.state.userDetails}
          isLoggedIn={this.state.isLoggedIn}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
