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

    this.handleRegister = this.handleRegister.bind(this);

  }
  handleRegister(event) {
      history.push("/Login");
  }
  handleActivate(event) {
      history.push("/Activate");
  }
  handleDeprecate(event) {
      history.push("/deprecate");
  }
  render() {
    return (
      <div>
          <RaisedButton label="Register" primary={true} style={style} backgroundColor={lime500} onClick={this.handleRegister} />
            <RaisedButton label="Activate" primary={true} style={style} backgroundColor={lime500} onClick={this.handleActivate} />
              <RaisedButton label="Deprecate" primary={true} style={style} backgroundColor={lime500} onClick={this.handleDeprecate} />

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
