import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Headline from '../ui/Headline';
import cms from '../cms';


import nano2 from '../images/nano2.png';
import { contract } from '../web3';

import history from '../history';

class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { User: '', DeviceID: window.deviceID };
    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }
  handleIDChange(event) {
    this.setState({ DeviceID: event.target.value });
  }
  handleRegister() {
    const DeviceID = this.state.DeviceID;

    if (contract !== undefined || contract !== null) {

      contract.deployed().then((instance) => {
        console.log(instance);
        return instance.deprecate(DeviceID,{from: '0xf666111c610ff3f27d22452320f89178ef8979eb'});
      }).then((suc) => {
        console.log(suc);
        history.push('/');
      //  to be removed after hot reloading is enabled
      }).catch((err) => {
        console.log(err);
        history.push('/');
      //  window.location.reload();
      });
    } else {
      console.info('Contract is not deployed');
    }
  }

  render() {
    return (
      <div>
        <img src={nano2} alt="nano2" width="350" />
        <div className="secondary-info">Serial number is engraved Number</div>
        <form>
          <TextField
            floatingLabelText="Device ID"
            defaultValue={window.deviceID}
            onChange={this.handleIDChange}
          />
        </form>
        <RaisedButton label="Deprecate"  onClick={this.handleRegister} />
      </div>
    );
  }
}

export default () => cms(__filename)(

  <div className="App-content">
    <Headline text="Welcome Mr.Notary man" />
    <div className="secondary-info">Please enter the Nano serial Number</div>
    <Transfer />

  </div>,
    );
