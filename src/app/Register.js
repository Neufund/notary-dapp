import React from 'react';
import TextField from 'material-ui/TextField';
import Add from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';

import Headline from '../ui/Headline';
import './Register.scss';
import cms from '../cms';

import history from '../history';

import { toPromise, toPromiseNoError } from '../utils';
import { ledger, contract } from '../web3';
import ledgerLoginProvider from '../ledgerLoginProvider';


class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.askForAccountConfirmation = true;
    this.state = {
      DeviceID: [],
      browserSupported: true,
      oldEthereumApp: false,
      addrs: [],
      last: '',
    };

    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }
  async componentDidMount() {
    await toPromiseNoError(this.setState.bind(this), { browserSupported: ledger.isU2FSupported });
    await ledgerLoginProvider.waitUntilConnected();
    await toPromiseNoError(this.setState.bind(this), { oldEthereumApp: ledgerLoginProvider.versionIsSupported });
    this.onLedgerConnected();
  }
  async onLedgerConnected() {
    await toPromiseNoError(this.setState.bind(this), { completed: true, step: 1 });
    if (this.askForAccountConfirmation) {
      await toPromiseNoError(this.setState.bind(this), { completed: false, step: 2 });
    }
    console.log('Nano Public key');
    await this.getAccount();
  }

  async getAccount() {
    ledgerLoginProvider.stop();
    try {
    //  const test = this.state.addrs;
      this.setState({ addrs: (await this.state.addrs.concat(await toPromise(ledger.getAccounts, [], [this.askForAccountConfirmation]))) });
      this.setState({ addrs: (await this.state.addrs.concat(await toPromise(ledger.getAccounts, [], [this.askForAccountConfirmation]))) });
      this.setState({ last: this.state.addrs[this.state.addrs.length - 1] });
      console.log(this.state.addrs);
      if (this.askForAccountConfirmation) {
        ledgerLoginProvider.start();
      }
        // START FROM HERE!!
    } catch (error) {
      console.log(error);
    }
  }

  async handleIDChange(event) {
    this.setState({ DeviceID: event.target.value });
  }

  async handleRegister() {
    const amount = this.state.DeviceID;

    if (contract !== undefined || contract !== null) {
      contract.deployed()
      .then(instance => instance.registerNano(this.state.addrs, amount))
      .then((suc) => {
        console.log(suc);
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
        history.push('/');
      });
    } else {
      console.info('Contract is not deployed');
    }
  }

  async handleRegister2() {
    console.log('Its me');
  }


  render() {
    return (
      <div>
        {this.state.addrs.map(test => test)}
        <form>
          <TextField
            floatingLabelText="Public key"
            value={this.state.last}
            style={{ width: 400 }}
            disabled
          />
          <TextField
            floatingLabelText="Device ID"
            value={this.state.DeviceID}
            onChange={this.handleIDChange}
          />
        </form>
        <IconButton onClick={this.handleRegister2}><Add /></IconButton>
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
