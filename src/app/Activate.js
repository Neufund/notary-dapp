import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Headline from '../ui/Headline';
import cms from '../cms';
import nano2 from '../images/nano2.png';
//import { contract, web3 } from '../web3';
import history from '../history';

class Activate extends React.Component {
  constructor(props) {
    super(props);

    this.state = { Owner: '', Device: window.deviceID };
    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleOwnerChange = this.handleOwnerChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleIDChange(event) {
    this.setState({ Device: event.target.value });
  }
  handleOwnerChange(event) {
    this.setState({ Owner: event.target.value });
  }

  handleRegister() {
    const Device = this.state.Device;
    const Owner = this.state.Owner;
    if (contract !== undefined || contract !== null) {
      contract.deployed().then(instance => instance.activateNano(Device, Owner)).then((suc) => {
        console.log(suc);
        history.push('/');
    //    window.location.reload();

      //  to be removed after hot reloading is enabled
      }).catch((err) => {
        console.log(err);
        alert('NANO ALREADY ACTIVATED OR NOT REGISTEREDS!');
        history.push('/');
        // window.location.reload();
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
            value={this.state.Device} onChange={this.handleIDChange}
          />
          <TextField
            floatingLabelText="Owner ID"
            value={this.state.Owner} onChange={this.handleOwnerChange}
          />
        </form>
        <RaisedButton label="Activate" onClick={this.handleRegister} />
      </div>
    );
  }
}

export default () => cms(__filename)(

  <div className="App-content">
    <Headline text="Welcome Mr.Notary man" />
    <div className="secondary-info">Please enter the Nano serial Number</div>
    <Activate />

  </div>,
    );
