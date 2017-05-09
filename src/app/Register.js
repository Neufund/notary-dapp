import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import Headline from '../ui/Headline';
import './Register.scss';
import cms from '../cms';

import {grey900, lime500} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Add from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';


import nano2 from '../images/nano2.png';
import {contract} from '../web3';

import history from '../history';

import {toPromise, toPromiseNoError, wait} from '../utils';
import {ledger} from '../web3';
import ledgerLoginProvider from '../ledgerLoginProvider';


class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.askForAccountConfirmation = true;
    this.state = {
        Amount: '',
        list: '',
        completed: false,
        step: 1,
        browserSupported: true,
        nonNeufundLedger: false,
        oldEthereumApp: false,
        showTutorial: false,
        config: null,
        accounts: null
    };

    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }
  async componentDidMount() {
      await toPromiseNoError(this.setState.bind(this), {"browserSupported": ledger.isU2FSupported});
      await ledgerLoginProvider.waitUntilConnected();
      await toPromiseNoError(this.setState.bind(this), {"oldEthereumApp": ledgerLoginProvider.versionIsSupported});
      ledgerLoginProvider.onDisconnect(() => {
          history.push("/logout");
      });
      this.onLedgerConnected();
  }
  async onLedgerConnected() {
      await toPromiseNoError(this.setState.bind(this), {completed: true, step: 1});
      if (this.askForAccountConfirmation) {
          await toPromiseNoError(this.setState.bind(this), {completed: false, step: 2});
      }
      console.log("Nano Public key");
      await this.getAccount();
  }

  async getAccount() {
      ledgerLoginProvider.stop();
      try {
          window.accounts = await toPromise(ledger.getAccounts, [], [this.askForAccountConfirmation]);
          if (this.askForAccountConfirmation) {
              await toPromiseNoError(this.setState.bind(this), {completed: true, accounts});
          } else {
              await toPromiseNoError(this.setState.bind(this), {accounts});
          }
        //  this.onAccountConfirmed() START FROM HERE!!
      } catch (error) {
          console.log(error);
      }
      ledgerLoginProvider.start();
  }

  async handleIDChange(event) {
    this.setState({Amount: event.target.value});
  }

  async handleRegister(event) {

    let amount = this.state.Amount;
    let addrs = window.accounts[0];

    if(typeof contract !== undefined || typeof contract !== null) {
      contract.deployed().then(function(instance) {
        console.log(instance);
  return instance.registerNano(addrs,amount);

}).then(function(suc) {
        console.log(suc);
        history.push("/");
}).catch(function(err){
  console.log(err);
  history.push("/");
});

    }
    else {
      console.info("Contract is not deployed");
    }
  }


  render() {
    return (
      <div>
        <form>
          <TextField
            floatingLabelText="Device ID"
            floatingLabelStyle={styles.floatingLabelStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            value={this.state.Amount} onChange={this.handleIDChange}/>
        </form>
          <IconButton onClick={this.handleRegister}><Add /></IconButton>
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

//Add Browser Check handeling
