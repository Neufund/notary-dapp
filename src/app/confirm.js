import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import Headline from '../ui/Headline';
import cms from '../cms';

import {grey900, lime500} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import nano2 from '../images/nano2.png';
import {contract,ledger} from '../web3';

import history from '../history';



class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {User: '', Amount: ''};
    this.handleRegister = this.handleRegister.bind(this);
    console.log(ledger);
    this.state.User = window.accounts[0];

  }

  handleRegister(event) {


    if(typeof contract !== undefined || typeof contract !== null) {
      contract.deployed().then(function(instance) {
        return instance.confirmNano({from: window.accounts[0]});
      }).then(function(suc) {
        console.log(suc);
        history.push("/");}).catch(function(err) {
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
        <img  src={nano2} alt="nano2"  width="350"/>
        <div className="secondary-info">Serial number is engraved Number</div>
        {this.handleRegister()}
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
