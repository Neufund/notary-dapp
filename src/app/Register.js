import React from 'react';
import TextField from 'material-ui/TextField';
import Add from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';

import Headline from '../ui/Headline';
import cms from '../cms';

import history from '../history';

import { toPromise, toPromiseNoError } from '../utils';
import { ledger, contract } from '../web3';
import ledgerLoginProvider from '../ledgerLoginProvider';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.askForAccountConfirmation = true;
    this.state = {
      DeviceID: '',
      browserSupported: true,
      oldEthereumApp: false,
      addrs: '',
      DisableButton: true,
    };

    if (contract == undefined || contract == null) { history.push('/'); }
  }

  async componentDidMount() {
    this.setState({ Nano: cookies.get('Address') });
    console.log(this.state.Nano);
    await toPromiseNoError(this.setState.bind(this), { browserSupported: ledger.isU2FSupported });
    await ledgerLoginProvider.waitUntilConnected();
    await toPromiseNoError(this.setState.bind(this), { oldEthereumApp: ledgerLoginProvider.versionIsSupported });
    console.log('there seems to be a problem');
    this.onLedgerConnected();
    ledgerLoginProvider.onDisconnect(() => {
      window.location.reload();
      contract.deployed().then(instance => instance.isNotary.call(this.state.addrs)).then((suc) => {
        if (suc == true) {
          this.setState({ DisableButton: true });
        }
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
    // ledgerLoginProvider.stop();
    try {
    //  const test = this.state.addrs;
      console.log(this.askForAccountConfirmation);
      this.setState({ addrs: await toPromise(ledger.getAccounts, [], [this.askForAccountConfirmation]) });
      console.log(this.state.addrs);

      contract.deployed().then((instance) => {
        console.log(instance);
        return instance.isNotary.call(this.state.addrs);
      }).then((suc) => {
        const cookies = new Cookies();

        if (suc == true) {
          // Incase the Notary ledger was plugged before!
          if (this.state.Nano == '') { history.push('/'); }
          this.setState({ DisableButton: false });
        } else {
          cookies.set('Address', this.state.addrs, { path: '/' });
          this.setState({ Nano: cookies.get('Address'), addrs: '' });
        //    window.location.reload();
        }
        console.log(suc);
      }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  }
  async handleIDChange(event) {
    this.setState({ DeviceID: event.target.value });
  }

  async handleRegister() {
    const amount = this.state.DeviceID;

    contract.deployed()
      .then(instance => instance.registerNano('0x6fc0c40666e25e1b20f32caa73927340357744fd', amount))
      .then((suc) => {
        console.log(suc);
        ledgerLoginProvider.stop();
        history.push('/');
      })
        .catch((err) => {
          console.log(err);
          ledgerLoginProvider.stop();
        });
  }


  render() {
    return (
      <div>
        {this.state.addrs}
        <form>
          <TextField
            floatingLabelText="Public key"
            value={this.state.Nano}
            style={{ width: 400 }}
            disabled
          />
          <TextField
            floatingLabelText="Device ID"
            value={this.state.DeviceID}
            onChange={this.handleIDChange}
          />
        </form>
        <IconButton onClick={this.handleRegister} disabled={this.state.DisableButton}><Add /></IconButton>
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

// Add Browser Check handeling
