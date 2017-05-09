import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import Headline from '../ui/Headline';
import cms from '../cms';

import {grey900, lime500} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import nano2 from '../images/nano2.png';
import {contract} from '../web3';

import history from '../history';

class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {User: '', DeviceID: window.deviceID};
    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);

  }
  handleIDChange(event) {
    this.setState({DeviceID: event.target.value});
  }
  handleRegister(event) {

    let DeviceID = this.state.DeviceID;

    if(typeof contract !== undefined || typeof contract !== null) {
      contract.deployed().then(function(instance) {
        console.log(instance);
  return instance.deprecate(DeviceID);

}).then(function(suc) {
        console.log(suc);
        history.push("/");
      //  to be removed after hot reloading is enabled
}).catch(function(err){
  console.log(err);
  alert("!")
  history.push("/");
      //  window.location.reload();

});

    }
    else {
      console.info("Contract is not deployed");
    }
  }

  render() {
    return (
      <div>
        <img  src={nano2} alt="nano2"  width="350"/>
        <div className="secondary-info">Serial number is engraved Number</div>
        <form>
          <TextField
            floatingLabelText="Device ID"
            defaultValue= {window.deviceID}
            floatingLabelStyle={styles.floatingLabelStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
             onChange={this.handleIDChange}/>
        </form>
          <RaisedButton label="Deprecate" style={window.style} onClick={this.handleRegister} />
      </div>
    );
  }
}

export default () => {
    return cms(__filename)(

        <div className="App-content">
            <Headline text="Welcome Mr.Notary man"/>
            <div className="secondary-info">Please enter the Nano serial Number</div>
            <Transfer/>

                </div>
    );
}
