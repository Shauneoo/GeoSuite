import React, { PropTypes } from 'react';
import * as api from '../api';

class CreateNewProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateEventFrom: props.showCreateEventFrom,
      position: props.position,
      title: '',
      cause: '',
      radius: '',
      key: props.id,
      defaultAnimation: props.defaultAnimation,
      infoContent: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showCreateEventFrom !== this.state.showCreateEventFrom) {
      this.setState({
        showCreateEventFrom: nextProps.showCreateEventFrom,
        position: nextProps.position,
        title: nextProps.title,
        cause: nextProps.cause,
        radius: nextProps.radius,
        key: nextProps.id,
        defaultAnimation: nextProps.defaultAnimation,
        infoContent: nextProps.infoContent
      });
    }
  }

  // when a user types handle
  handleTitleInput = (e) => {
    this.setState({title: e.target.value});
  }
  handleCauseInput = (e) => {
    this.setState({cause: e.target.value});
  }
  handleRadiusInput = (e) => {
    this.setState({radius: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const formPayload = {
      position: this.state.position,
      title: this.state.title,
      radius: this.state.cause,
      cause: this.state.radius,
      key: this.state.key,
      defaultAnimation: this.state.defaultAnimation,
      infoContent: this.state.infoContent
    };

    //send event to DB
    api.addEvent(formPayload);

    this.setState ({
      showCreateEventFrom: false,
      title: '',
      radius: '',
      cause: ''
    });
    this.props.getLatestEventsData();
    this.props.onCreateProjectFormClose(false) //reset props on form close
  }

  handleCancel = () => {
    // send user to db
    this.setState ({
      showCreateEventFrom: false,
      title: '',
      radius: '',
      cause: ''
    });
    //display user data
    this.props.onCreateProjectFormCancel();
    this.props.onCreateProjectFormClose(false); //reset props on form close
  }

  render() {
    if (!this.state.showCreateEventFrom) return null;

    return (
      <form id="newProjectForm" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <h3 className="headerMargin">Create new fund</h3>
          </div>
          <div className="col-1"></div>
        </div>

        <div className="form-group row">
          <div className="col-1"></div>
          <div className="col-10">
            <label>Title</label>
            <input type="text" className="form-control" id="eventName" placeholder="Please enter event name" value={this.state.title} onChange={this.handleTitleInput}/>
          </div>
          <div className="col-1"></div>
        </div>

        <div className="form-group row">
          <div className="col-1"></div>
          <div className="col-10">
            <label> What is the purpose of this fund?</label>
            <textarea placeholder="Please state indented cause" value={this.state.cause} onChange={this.handleCauseInput}></textarea>
          </div>
          <div className="col-1"></div>
        </div>

        <div className="form-group row">
          <div className="col-1"></div>
          <div className="col-10">
            <label>Radius (in meters)</label>
            <input type="number" placeholder="Enter event radius" value={this.state.radius} onChange={this.handleRadiusInput}/>
          </div>
          <div className="col-1"></div>
        </div>

        <div className="form-group row">
          <div className="col-1"></div>
          <div className="col-10">
            <input type="submit" value="Submit" className="btn btn-success btn-lg"></input>
            <button type="button" className="btn btn-danger btn-lg" onClick={this.handleCancel}>Cancel</button>
          </div>
          <div className="col-1"></div>
        </div>
      </form>
    );
  }
}

CreateNewProject.defaultProps = {
  showCreateEventFrom: false,
};

CreateNewProject.propTypes = {
  showCreateEventFrom: PropTypes.bool.isRequired,
};

export default CreateNewProject;
