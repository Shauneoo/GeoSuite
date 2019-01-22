import React, {Component} from 'react';
import * as api from '../api';

import SingleInput from './SingleInput';
import TextArea from './TextArea';

class DonateToProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDonateForm: props.showDonateForm,
      userDetails: props.userDetails,
      donateAmount: 0,
      supportingReason: '',
      donationCondition: '',
      selectedProjectID: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    //see if state is set, prevent unneccery render
    if (nextProps.showDonateForm !== this.state.showDonateForm) {
      this.setState({
        showDonateForm: nextProps.showDonateForm,
        selectedProjectID: nextProps.selectedProjectID,
        userDetails: nextProps.userDetails,
      });
    }
  }
  componentDidMount() {}

  handledDonateAmountChange = (e) => this.setState({ donateAmount: e.target.value });
  handleSupportingReasonChange = (e) => this.setState({ supportingReason: e.target.value });
  handleDonationConditionChange = (e) => this.setState({ donationCondition: e.target.value });

  handleClearForm = (e) =>{
    e.preventDefault();
    this.props.onDonateFormClose(false); //reset props on form close
    this.setState({
      showDonateForm: false,
      donateAmount: 0,
      supportingReason: '',
      donationCondition: '',
      selectedProjectID: ''
    });
  }
  handleFormSubmit = (e) => {
    e.preventDefault();

    const formPayload = {
      userID: this.state.userDetails._id,
      eventID: this.state.selectedProjectID,
      donateAmount: this.state.donateAmount,
      supportingReason: this.state.supportingReason,
      donationCondition: this.state.donationCondition
    };
    api.depositToEvent(formPayload);
    this.handleClearForm(e);
    this.props.getLatestUserBalance();
    this.props.getLatestEventsData();
  }

  render() {
    if (!this.state.showDonateForm) return null;

    return (
      <form className="dontateToProject" onSubmit={this.handleFormSubmit}>
        <h5>Donate money</h5>
        <SingleInput
          inputType={'number'}
          title={'How much would you like to donate?'}
          name={'donateAmount'}
          controlFunc={this.handledDonateAmountChange}
          content={this.state.donateAmount}
          placeholder={''} />
        <TextArea
          title={'Why do you support this idea?'}
          rows={5}
          resize={false}
          content={this.state.supportingReason}
          name={'supportingReason'}
          controlFunc={this.handleSupportingReasonChange}
          placeholder={''} />
        <TextArea
          title={'Would you like to specify how this money should be used?'}
          rows={5}
          resize={false}
          content={this.state.donationCondition}
          name={'donationCondition'}
          controlFunc={this.handleDonationConditionChange}
          placeholder={''} />
        <input
          type="submit"
          className="btn btn-primary"
          value="Submit"/>
        <button type="button" className="btn btn-danger btn-md" onClick={this.handleClearForm}>
          Cancel
        </button>
      </form>
    );
  }
}

export default DonateToProject;
