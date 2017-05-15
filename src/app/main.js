import React from 'react';
import Headline from '../ui/Headline';
import './Contracts.scss';
import cms from '../cms';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


import {grey900, grey50} from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import Delete from 'material-ui/svg-icons/action/delete';
import Add from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import {contract} from '../web3';

import history from '../history';

let TransPromise = undefined;

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
window.style = {
  backgroundColor: grey900,
  margin: 12,
};

function handleDeprecate(dev) {
  window.deviceID=dev;
  console.log(dev);
    history.push("/activate");
}

function touchme(props){
  if(props.owner===0)
  return <IconButton onClick={() => handleDeprecate(props.id)}><Add /></IconButton>;
  return props.owner;
}

class Transfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {list: [],key: '',open: false};
      console.log(history);
     TransPromise = contract.deployed().then(function(instance) {
      //Issue with filtering
      //https://github.com/ethereum/web3.js/issues/452
      return instance.allEvents({fromBlock: 0, toBlock: 'latest'});
    }).then(function(events) {
      return new Promise((resolve, reject)=>{
        events.get(function(error, result){
         if (error) {
            console.info("Error getting events from contract")
            reject(error);
        } else {
            resolve(result);
        }});
      })
    });
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
  //  history.pushState({part1 : 'test'},"/Login");
      history.push("/Login");
  }
  handleDeprecate(dev) {
    window.deviceID=dev;
    console.log(dev);
      history.push("/deprecate");
  }


  async componentDidMount() {
    //wait for transactions from web3

    const instance = await contract.deployed()
    let list = (await TransPromise)
      .filter(result => result.event === "DeviceRegistered")
      .map(result => result.args.deviceId.c[0])
      .map(async function(id) {
        const NanoData = await instance.nanoStates.call(id);
        return({
          id: new window.web3.BigNumber(NanoData[0]).toString(10),
          Pubkey: NanoData[1].toString(),
          OwnerID: new window.web3.BigNumber(NanoData[2]).toString(10),
          confirmed: NanoData[3].toString(),
          deprecated: await instance.isDeprecated.call(id)
      })}
    );

    this.setState({list: (await Promise.all(list)).filter(device => !device.deprecated)});
};

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
      <IconButton onClick={() => this.handleRegister()}><Add /></IconButton>
                      <Table>
                     <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                      <TableRow >
                        <TableHeaderColumn width={25}>DeviceId</TableHeaderColumn>
                        <TableHeaderColumn width={300}>Publick key</TableHeaderColumn>
                        <TableHeaderColumn>Owner Id</TableHeaderColumn>
                        <TableHeaderColumn>Confirmed</TableHeaderColumn>
                        <TableHeaderColumn>Deprecate</TableHeaderColumn>
                      </TableRow>
                      </TableHeader>
                      <TableBody displayRowCheckbox={false}>
                        {this.state.list.map(device =>
                           <TableRow key={device.id}>
                                  <TableRowColumn width={25}>{device.id}</TableRowColumn>
                                  <TableRowColumn width={300}>{device.Pubkey}</TableRowColumn>
                                  <TableRowColumn>{touchme({owner:device.OwnerID,id: device.id})} </TableRowColumn>
                                  <TableRowColumn >{device.confirmed}</TableRowColumn>
                                  <TableRowColumn><IconButton onClick={() => this.handleDeprecate(device.id)}><Delete /></IconButton></TableRowColumn>
                                </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          The actions in this window were passed in as an array of React objects.
        </Dialog>
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
