import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import Headline from '../ui/Headline';
import './Contracts.scss';
import cms from '../cms';

import {grey900, grey50} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import nano2 from '../images/nano2.png';
import {contract} from '../web3';

import history from '../history';

class Activate extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props);
    this.state = {Owner: '', Device: window.deviceID};
    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleOwnerChange = this.handleOwnerChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);

  }
  //amount form
  handleIDChange(event) {
    this.setState({Device: event.target.value});
  }
  handleOwnerChange(event) {
    this.setState({Owner: event.target.value});
  }
  //Deposit button
  handleRegister(event) {

    let Device = this.state.Device;
    let Owner = this.state.Owner;
    if(typeof contract !== undefined || typeof contract !== null) {
      contract.deployed().then(function(instance) {
        return instance.activateNano(Device,Owner);

}).then(function(suc) {
        console.log(suc);
        history.push("/");
    //    window.location.reload();

      //  to be removed after hot reloading is enabled
}).catch(function(err){
  console.log(err);
  alert("NANO ALREADY ACTIVATED OR NOT REGISTEREDS!")
  history.push("/");
        //window.location.reload();

});

    }
    else {
      console.info("Contract is not deployed");
    }
  }

  render() {
    return (
      <div>
        {console.log(this.props)}
        <img  src={nano2} alt="nano2"  width="350"/>
        <div className="secondary-info">Serial number is engraved Number</div>
        <form>
          <TextField
            floatingLabelText="Device ID"
            floatingLabelStyle={styles.floatingLabelStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            value={this.state.Device} onChange={this.handleIDChange}/>
          <TextField
            floatingLabelText="Owner ID"
            floatingLabelStyle={styles.floatingLabelStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            value={this.state.Owner} onChange={this.handleOwnerChange}/>
        </form>
          <RaisedButton label="Activate"  style={window.style} onClick={this.handleRegister} />
      </div>
    );
  }
}

export default () => {
    return cms(__filename)(

        <div className="App-content">
            <Headline text="Welcome Mr.Notary man"/>
            <div className="secondary-info">Please enter the Nano serial Number</div>
            <Activate/>

                </div>
    );
}
