import React from 'react';
import * as api from '../api';

class SplashForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: props.isLoggedIn,
      userInput: ''
    };
  }

  // when a user types handle
  handleUserInput = (e) => {
    this.setState({
      userInput: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // send user to db
    api.addUser(this.state.userInput).then(user => {
      this.props.getUserDetailsFromDB(user); //returning data
    });
    this.setState({isLoggedIn: true});
  }

  render() {
    if (this.state.isLoggedIn) return null;

    return (
      <div className="splashPopup">
        <div className="row no-gutters">
          <div className="col"></div>
          <div className="col-lg-4 col-md-5 col-sm-6 col-8">
            <img src="./img/CivicBlocks-logo.svg" className="logo" alt="geocoinlogo"></img>
            <p id="siteDescription">is an explorative platform for geolocated currencies</p>
          </div>
          <div className="col"></div>
        </div>
        <div className="row no-gutters signInContainer">
          <div className="col"></div>
          <div className="col-lg-4 col-md-5 col-sm-6 col-8">
            <form className="userInput">
              <div className="form-group" action="">
                <label>Please enter your name to create your temporary CivicBlocks wallet:</label>
                <input id='userNameInput' type="text" value={this.state.userInput} onChange={this.handleUserInput} />
              </div>
              <button className="btn btn-primary btn-md" onClick={this.handleSubmit}>Sign in</button>
            </form>
          </div>
          <div className="col"></div>
        </div>
      </div>
    );
  }
}

SplashForm.defaultProps = {
};

SplashForm.propTypes = {
};

export default SplashForm;
