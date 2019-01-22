import React, {Component} from 'react';
import * as api from '../api';

import SingleInput from './SingleInput';
import TextArea from './TextArea';

class WithdrawFromProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWithdrawForm: props.showWithdrawForm,
      userDetails: props.userDetails,
      withdrawAmount: 0,
      withdrawReason: '',
      withdrawVerification: '',
      selectedProjectID: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    //see if state is set, prevent unneccery render
    if (nextProps.showWithdrawForm !== this.state.showWithdrawForm) {
      this.setState({
        showWithdrawForm: nextProps.showWithdrawForm,
        selectedProjectID: nextProps.selectedProjectID,
        userDetails: nextProps.userDetails,
      });
    }
  }

  componentDidMount() {}

  handledWithdrawAmountChange = (e) => this.setState({ withdrawAmount: e.target.value });
  handleWithdrawReasonChange = (e) => this.setState({ withdrawReason: e.target.value });
  handlewithdrawVerificationConditionChange = (e) => this.setState({ withdrawVerification: e.target.value });

  handleClearForm = (e) =>{
    e.preventDefault();
    this.props.onWithdrawFormClose(false); //reset props on form close
    this.setState({
      showWithdrawForm: false,
      withdrawAmount: 0,
      withdrawReason: '',
      withdrawVerification: '',
      selectedProjectID: ''
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    const formPayload = {
      userID: this.state.userDetails._id,
      eventID: this.state.selectedProjectID,
      withdrawAmount: this.state.withdrawAmount,
      withdrawReason: this.state.withdrawReason,
      withdrawVerification: this.state.withdrawVerification
    };

    api.withdrawFromEvent(formPayload);
    this.handleClearForm(e);
    this.props.getLatestUserBalance();
    this.props.getLatestEventsData();
  }
  render() {
    if (!this.state.showWithdrawForm) return null;

    return (
      <form className="withdrawFromProject" onSubmit={this.handleFormSubmit}>
        <h5>Withdraw money</h5>
        <SingleInput
          inputType={'number'}
          title={'How much would you like to withdraw?'}
          name={'withdrawAmount'}
          controlFunc={this.handledWithdrawAmountChange}
          content={this.state.withdrawAmount}
          placeholder={''} />
        <TextArea
          title={'How are you planning to use it?'}
          rows={5}
          resize={false}
          content={this.state.withdrawReason}
          name={'withdrawReason'}
          controlFunc={this.handleWithdrawReasonChange}
          placeholder={''} />
        <TextArea
          title={'How could this transaction be verified and by whom?'}
          rows={5}
          resize={false}
          content={this.state.withdrawVerification}
          name={'withdrawVerification'}
          controlFunc={this.handlewithdrawVerificationConditionChange}
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

export default WithdrawFromProject;
