import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Headline from '../ui/Headline';
import cms from '../cms';

import { toPromise, toPromiseNoError } from '../utils';
import { ledger, contract } from '../web3';
import ledgerLoginProvider from '../ledgerLoginProvider';
import history from '../history';

class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.handleDepricate = this.handleDepricate.bind(this);
    this.askForAccountConfirmation = true;
    this.state = {
      DeviceID: window.deviceID,
      DisableButton: true,
      browserSupported: true,
      oldEthereumApp: false,
      last: '',
      addrs: '' };
    if (this.state.DeviceID == null) { history.push('/'); }
    if (contract === undefined || contract == null) {
      console.log('Contract Not Deployed');
      history.push('/');
    }
  }

  handleDepricate() {
    contract.deployed().then((instance) => {
      console.log(this.state.addrs);
      return instance.deprecate(this.state.DeviceID, { from: window.Notary });
    }).then((suc) => {
      console.log(suc);
      history.push('/');
    }).catch((err) => {
      console.log(err);
      history.push('/');
    });
  }

  render() {
    return (
      <div>
        <div className="secondary-info">Please plug the Notary Nano to continue</div>
        <form>
          <TextField
            floatingLabelText="Device ID"
            defaultValue={window.deviceID}
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
