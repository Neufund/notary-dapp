import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Headline from '../ui/Headline';
import cms from '../cms';


import nano2 from '../images/nano2.png';
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
      DeviceID: window.deviceID ,
      DisableButton: true,
      browserSupported: true,
      oldEthereumApp: false,
      last: '',
      addrs:'',};
    if(this.state.DeviceID == null)
    history.push('/');
    if (contract == undefined || contract == null) {
      console.log("Contract Not Deployed");
      history.push('/');
    }

  }

  async componentDidMount() {
    await toPromiseNoError(this.setState.bind(this), { browserSupported: ledger.isU2FSupported });
    await ledgerLoginProvider.waitUntilConnected();
    await toPromiseNoError(this.setState.bind(this), { oldEthereumApp: ledgerLoginProvider.versionIsSupported });
    this.onLedgerConnected();
    ledgerLoginProvider.onDisconnect(() => {

      contract.deployed().then((instance) => {
        console.log(instance);
        return instance.isNotary.call(this.state.addrs);
      }).then((suc) => {
        if(suc == true)
          this.setState({DisableButton: true})
          window.location.reload();
        console.log(suc);
      }).catch((err) => {
        console.log(err);
      });
        });
  }
  async onLedgerConnected() {
    console.log('Nano Public key');
    await this.getAccount();
  }

  async getAccount() {
    ledgerLoginProvider.stop();
    try {
    //  const test = this.state.addrs;
    console.log(this.askForAccountConfirmation);
      this.setState({ addrs: await toPromise(ledger.getAccounts, [], [false])});
      console.log(this.state.addrs);
      if (this.askForAccountConfirmation) {
        ledgerLoginProvider.start();
      }
      contract.deployed().then((instance) => {
        console.log(instance);
        return instance.isNotary.call(this.state.addrs);
      }).then((suc) => {
        if(suc == true)
          this.setState({DisableButton: false})
        console.log(suc);
      }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  }
  handleDepricate() {
      contract.deployed().then((instance) => {
        console.log(this.state.addrs);
        return instance.deprecate(this.state.DeviceID,{from: this.state.addrs[0]});
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
        <IconButton  onClick={() => this.handleDepricate()} disabled={this.state.DisableButton} ><Delete /></IconButton>
        </form>
      </div>
    );
  }
}

export default () => cms(__filename)(

  <div className="App-content">
    <Headline text="Welcome Mr.Notary man" />
    <div className="secondary-info">You are DEPRECATING! the Nano. this action can't be reverserd</div>
    <Transfer />

  </div>,
    );
