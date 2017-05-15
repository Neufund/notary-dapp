import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Add from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import React from 'react';
import Headline from '../ui/Headline';
import cms from '../cms';

import { contract } from '../web3';

import history from '../history';

let TransPromise;

function handleDeprecate(dev) {
  history.push('/activate');
}

function touchme(props) {
  if (props.owner == 0) {
    return <IconButton onClick={() => handleDeprecate(props.id)}><Add /></IconButton>;
  }
  return props.owner;
}

class Transfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { list: [], key: '', open: false };
  /*  TransPromise = contract.deployed().then(instance =>
      // Issue with filtering
      // https://github.com/ethereum/web3.js/issues/452
        instance.allEvents({ fromBlock: 0, toBlock: 'latest' })).then(events => new Promise((resolve, reject) => {
          events.get((error, result) => {
            if (error) {
              console.info('Error getting events from contract');
              reject(error);
            } else {
              resolve(result);
            }
          });
        }));*/
  }

  async componentDidMount() {
    // wait for transactions from web3
    console.log(contract);

  const test = await contract.allEvents({ fromBlock: 0, toBlock: 'latest' });

  /*  const instance = await contract.deployed();
    const list = (await TransPromise)
      .filter(result => result.event === 'DeviceRegistered')
      .map(result => result.args.deviceId.c[0])
      .map(async (id) => {
        const NanoData = await instance.nanoStates.call(id);
        return ({
          id: new window.web3.BigNumber(NanoData[0]).toString(10),
          Pubkey: NanoData[1].toString(),
          OwnerID: new window.web3.BigNumber(NanoData[2]).toString(10),
          confirmed: NanoData[3].toString(),
          deprecated: await instance.isDeprecated.call(id),
        });
      },
    );

    this.setState({ list: (await Promise.all(list)).filter(device => !device.deprecated) });
  */
}

  handleRegister() {
    history.push('/Register');
  }
  handleActivate() {
    history.push('/Activate');
  }
  handleConfirm() {
    history.push('/Login');
  }
  handleDeprecate(dev) {
    window.deviceID = dev;
    console.log(dev);
    history.push('/deprecate');
  }


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
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
                <TableRowColumn>
                  {touchme({ owner: device.OwnerID, id: device.id })}
                </TableRowColumn>
                <TableRowColumn >{device.confirmed}</TableRowColumn>
                <TableRowColumn>
                  <IconButton onClick={() => this.handleDeprecate(device.id)}>
                    <Delete />
                  </IconButton>
                </TableRowColumn>
              </TableRow>,
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

export default () => cms(__filename)(

  <div className="App-content">
    <Headline text="Welcome Mr.Notary man" />
    <div className="secondary-info">Please choose and option</div>
    <Transfer />

  </div>,
    );
