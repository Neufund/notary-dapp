import React from 'react';
import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import Headline from '../ui/Headline';
import cms from '../cms';
import history from '../history';
import { contract } from '../web3';


class Activate extends React.Component {
  constructor(props) {
    super(props);

    this.askForAccountConfirmation = true;
    this.state = { Owner: '',
      deviceID: window.deviceID,
      addrs: '',
      last: '',
    };

    if (this.state.deviceID == null) { history.push('/'); }
    if (contract == undefined || contract == null) { history.push('/'); }
    if (window.Notary == undefined) { history.push('/'); }
    this.handleOwnerChange = this.handleOwnerChange.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
  }


  handleOwnerChange(event) {
    this.setState({ Owner: event.target.value });
  }

  handleActivate() {
    // for some reason state is not defined in the contract
    const addrs = this.state.addrs[0];
    const deviceID = this.state.deviceID;
    const Owner = this.state.Owner;
    contract.deployed().then(instance => instance.activateNano(deviceID, Owner, { from: window.Notary })).then((suc) => {
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
          <IconButton onClick={() => this.handleActivate()}> <Add /></IconButton>

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
