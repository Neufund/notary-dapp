import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import Headline from '../ui/Headline';
import './Contracts.scss';
import cms from '../cms';

import {grey900, grey50} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import nano2 from '../images/nano2.png';
import {contract} from '../web3';

import history from '../history';


window.styles = {
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
    color: grey50,
  },
};
//Styles for buttons
window.style = {
  backgroundColor: grey50,
  margin: 12,
};


class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.handleRegister = this.handleRegister.bind(this);

  }
  handleRegister(event) {
    window.mode = 1;
      history.push("/Login");
  }
  handleActivate(event) {
      history.push("/Activate");
  }
  handleConfirm(event) {
    window.mode = 2;
      history.push("/Login");
  }
  handleDeprecate(event) {
      history.push("/deprecate");
  }
  render() {
    return (
      <div>
          <RaisedButton label="Register"  style={style} backgroundColor={grey50} onClick={this.handleRegister} />
            <RaisedButton label="Activate"  style={style} backgroundColor={grey50} onClick={this.handleActivate} />
              <RaisedButton label="Deprecate"  style={style} backgroundColor={grey50} onClick={this.handleDeprecate} />
                <RaisedButton label="Confirm"  style={style} backgroundColor={grey50} onClick={this.handleConfirm} />
      </div>
    );
  }
}

export default () => {
    return cms(__filename)(

        <div className="App-content">
            <Headline text="Welcome Mr.Notary man"/>
            <div className="secondary-info">Please choose and option</div>
            <Transfer/>

                </div>
    );
}
