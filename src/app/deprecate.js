import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import Headline from '../ui/Headline';
import './Contracts.scss';
import cms from '../cms';

import {grey900, lime500} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import nano2 from '../images/nano2.png';
import {contract} from '../web3';

import history from '../history';


const styles = {
  errorStyle: {
    color: grey900,
  },
  underlineStyle: {
    borderColor: grey900,
  },
  floatingLabelStyle: {
    color: grey900,
  },
  floatingLabelFocusStyle: {
    color: lime500,
  },
};
//Styles for buttons
const style = {
  backgroundColor: grey900,
  margin: 12,
};

class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {User: '', Amount: ''};
    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);

  }
  //amount form
  handleIDChange(event) {
    this.setState({Amount: event.target.value});
  }
  //Deposit button
  handleRegister(event) {

    let amount = this.state.Amount;
    let addrs = this.state.User;
    //Input checks (More research regarding javascripts security methods to be doen)
  /*  if(amount.match(/^[0-9A-Fa-fxX]+$/) == null
       || addrs.match(/^[0-9A-Fa-fxX]+$/) == null
        || amount === ''
         || addrs === '') {

       alert("Wrong input");
       //Only amount is emptied because its annoying to rewrite the full adress again
       this.setState({Amount: ''});
       return;
     }*/
     //console.log(window.accounts[0]);
    if(typeof contract !== undefined || typeof contract !== null) {
      contract.deployed().then(function(instance) {
        console.log(instance);
  return instance.deprecate(amount);

}).then(function(suc) {
        console.log(suc);
        history.push("/");
      //  to be removed after hot reloading is enabled
}).catch(function(err){
  console.log(err);
  alert("!")
  history.push("/");
      //  window.location.reload();

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
        <form>
          <TextField
            floatingLabelText="Device ID"
            floatingLabelStyle={styles.floatingLabelStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            value={this.state.Amount} onChange={this.handleIDChange}/>
        </form>
          <RaisedButton label="Deprecate" primary={true} style={style} backgroundColor={lime500} onClick={this.handleRegister} />
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
