import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Headline from '../ui/Headline';
import cms from '../cms';

import { contract, instance } from '../web3';
import history from '../history';

class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.handleDepricate = this.handleDepricate.bind(this);
    this.state = {
      DeviceID: window.deviceID,
      addrs: window.Notary };

    if (this.state.DeviceID == null) { history.push('/'); }
    if (instance === undefined || contract == instance) {
      console.log('Contract Not Deployed');
      history.push('/');
    }
  }

  async handleDepricate() {
    try {
      await instance.deprecate(this.state.DeviceID, { from: this.state.addrs });
    } catch (e) { console.log(e); }
    history.push('/');
  }

  render() {
    return (
      <div>
        <div className="secondary-info">Please plug the Notary Nano to continue</div>
        <form>
          <TextField
            floatingLabelText="Device ID"
            defaultValue={this.state.DeviceID}
            disabled
          />
          <IconButton onClick={() => this.handleDepricate()} ><Delete /></IconButton>
        </form>
      </div>
    );
  }
}

export default () => cms(__filename)(

  <div className="App-content">
    <Headline text="Welcome Mr.Notary man" />
    <div className="secondary-info">You are DEPRECATING! the Nano. this action cant be reverserd</div>
    <Transfer />

  </div>,
    );
