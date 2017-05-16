import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Headline from '../ui/Headline';
import cms from '../cms';
import { toPromise, toPromiseNoError } from '../utils';
import { ledger, contract } from '../web3';
import ledgerLoginProvider from '../ledgerLoginProvider';
import history from '../history';
import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/content/add';

class Activate extends React.Component {
  constructor(props) {
    super(props);

    this.askForAccountConfirmation = true;
    this.state = {Owner: '',
                  deviceID: window.deviceID,
                  DisableButton: true,
                  browserSupported: true,
                  oldEthereumApp: false,
                  addrs: '',
                  last: '',
    };

    if(this.state.deviceID == null)
    history.push('/');
    if (contract == undefined || contract == null) {
      console.log("Contract Not Deployed");
      history.push('/');
    }
    this.handleOwnerChange = this.handleOwnerChange.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
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
      this.setState({ addrs: await toPromise(ledger.getAccounts, [], [this.askForAccountConfirmation])});
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

  handleOwnerChange(event) {
    this.setState({ Owner: event.target.value });
  }

  handleActivate() {
    //for some reason state is not defined in the contract
    const addrs = this.state.addrs[0];
    const deviceID = this.state.deviceID;
    const Owner = this.state.Owner;
 contract.deployed().then(function (instance) {

   return instance.activateNano(deviceID, Owner,{from: addrs})
 }).then((suc) => {
   console.log(suc);
   history.push('/');
 }).catch((err) => {
   console.log(err);
   history.push('/');
   // window.location.reload();
 });
  }

  render() {
    return (
      <div>
        <div className="secondary-info">Please write the owner ID number. Plug the notary nano to activate</div>
        <form>
          <TextField
            floatingLabelText="Device ID"
            value={this.state.deviceID}
            disabled
          />
          <TextField
            floatingLabelText="Owner ID"
            value={this.state.Owner} onChange={this.handleOwnerChange}
          />
        <IconButton onClick={() => this.handleActivate()} disabled = {this.state.DisableButton}>  <Add /></IconButton>

        </form>
      </div>
    );
  }
}

export default () => cms(__filename)(

  <div className="App-content">
    <Headline text="Welcome Mr.Notary man" />
    <div className="secondary-info">After handing the owner thier Nano</div>
    <Activate />

  </div>,
    );
