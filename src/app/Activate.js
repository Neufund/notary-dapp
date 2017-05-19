import React from 'react';
import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import Headline from '../ui/Headline';
import cms from '../cms';
import history from '../history';
import { contract, instance } from '../web3';


class Activate extends React.Component {
  constructor(props) {
    super(props);
    this.handleOwnerChange = this.handleOwnerChange.bind(this);
    this.handleActivate = this.handleActivate.bind(this);

    this.state = {
      Owner: '',
      deviceID: window.deviceID,
      addrs: window.Notary,
    };

    if (this.state.deviceID == null) { history.push('/'); }
    if (contract == undefined || contract == null) { history.push('/'); }
    if (window.Notary == undefined) { history.push('/'); }
  }


  handleOwnerChange(event) { this.setState({ Owner: event.target.value }); }

  async handleActivate() {
    try {
      await instance.activateNano(this.state.deviceID, this.state.Owner, { from: this.state.addrs });
    } catch (e) { console.log(e); }
    history.push('/');
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
    <div className="secondary-info">After handing the owner their Nano</div>
    <Activate />
  </div>,
    );
