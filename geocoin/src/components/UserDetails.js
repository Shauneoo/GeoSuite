import React from 'react';
import * as api from '../api';

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: props.isLoggedIn,
      name: props.userDetails.name,
      confirmedBalance: props.userDetails.confirmedBalance,
      pendingBalance: props.userDetails.pendingBalance
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isLoggedIn: nextProps.isLoggedIn,
      name: nextProps.userDetails.name,
      confirmedBalance: nextProps.userDetails.confirmedBalance,
      pendingBalance: nextProps.userDetails.pendingBalance
    });
  }

  render() {
    if (!this.state.isLoggedIn) return null;

    return (
      <div className="userDetails">
        <p>{this.state.name}, your balance is: <br /> {this.state.confirmedBalance} ( {this.state.pendingBalance} unconfirmed) GeoCoins</p>
      </div>
    );
  }
}

UserDetails.defaultProps = {};
UserDetails.propTypes = {};

export default UserDetails;
