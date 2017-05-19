import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Add from 'material-ui/svg-icons/content/add';

import React from 'react';
import Headline from '../ui/Headline';
import cms from '../cms';

import { contract, web3, ledger } from '../web3';
import history from '../history';

import { toPromise, toPromiseNoError } from '../utils';
import ledgerLoginProvider from '../ledgerLoginProvider';


async function eventPromise() {
  console.log('test');
  const eventList = contract.deployed().then(instance2 =>
    // Issue with filtering
    // https://github.com/ethereum/web3.js/issues/452
      instance2.allEvents({ fromBlock: 0, toBlock: 'latest' }))
      .then(events => new Promise((resolve, reject) => {
        events.get((error, result) => {
          if (error) {
            console.info('Error getting events from contract');
            reject(error);
          } else {
            resolve(result);
          }
        });
      }));
  return eventList;
}

class Transfer extends React.Component {
  constructor(props) {
    super(props);
    this.askForAccountConfirmation = true;

    this.state = {
      list: [],
      key: '',
      DisableButton: true,
      browserSupported: true,
      oldEthereumApp: false };
    this.getNanoData();
  }

  async componentDidMount() {
    await toPromiseNoError(this.setState.bind(this), { browserSupported: ledger.isU2FSupported });
    await ledgerLoginProvider.waitUntilConnected();
    await toPromiseNoError(this.setState.bind(this),
              { oldEthereumApp: ledgerLoginProvider.versionIsSupported });
    this.onLedgerConnected();
    ledgerLoginProvider.onDisconnect(() => {
      contract.deployed().then(instance => instance.isNotary.call(this.state.addrs)).then((suc) => {
        if (suc === true) { this.setState({ DisableButton: true }); }
        window.location.reload();
      }).catch((err) => {
        console.log(err);
      });
    });
  }
  async onLedgerConnected() {
    console.log('Nano Public key');
    await this.getAccount();
  }

  async getAccount() {
    ledgerLoginProvider.stop();
    try {
      this.setState({ addrs: await toPromise(ledger.getAccounts, [], [this.askForAccountConfirmation]) });
      window.Notary = this.state.addrs[0];
      if (this.askForAccountConfirmation) {
        ledgerLoginProvider.start();
      }
      contract.deployed().then((instance) => {
        console.log(instance);
        return instance.isNotary.call(this.state.addrs);
      }).then((suc) => {
        if (suc === true) { this.setState({ DisableButton: false }); }
        console.log(suc);
      }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getNanoData() {
    const instance = await contract.deployed();

    const list = (await eventPromise())
      .filter(result => result.event === 'DeviceRegistered')
      .map(result => result.args.deviceId.c[0])
      .map(async (id) => {
        const NanoData = await instance.nanoStates.call(id);
        return ({
          id: new web3.BigNumber(NanoData[0]).toString(10),
          Pubkey: NanoData[1].toString(),
          OwnerID: new web3.BigNumber(NanoData[2]).toString(10),
          confirmed: NanoData[3].toString(),
          deprecated: await instance.isDeprecated.call(id),
        });
      },
    );
    this.setState({ list: (await Promise.all(list)).filter(device => !device.deprecated) });
  }

  handleActivate(dev) {
    window.deviceID = dev;
    history.push('/activate');
  }

  handleDeprecate(dev) {
    window.deviceID = dev;
    history.push('/deprecate');
  }

  render() {
    return (
      <div>
        <IconButton onClick={() => history.push('/Register')}><Add /></IconButton>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow >
              <TableHeaderColumn width={30}>DeviceId</TableHeaderColumn>
              <TableHeaderColumn width={300}>Publick key</TableHeaderColumn>
              <TableHeaderColumn>Owner Id</TableHeaderColumn>
              <TableHeaderColumn>Confirmed</TableHeaderColumn>
              <TableHeaderColumn>Deprecate</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              this.state.list.map(device =>
                <TableRow key={device.id}>
                  <TableRowColumn width={30}>{device.id}</TableRowColumn>
                  <TableRowColumn width={300}>{device.Pubkey}</TableRowColumn>
                  <TableRowColumn>
                    {(device.OwnerID == null || device.OwnerID == 0) ?
                      <IconButton onClick={() => this.handleActivate(device.id)} disabled={this.state.DisableButton}><Add /></IconButton> : device.OwnerID}
                  </TableRowColumn>
                  <TableRowColumn >{device.confirmed}</TableRowColumn>
                  <TableRowColumn>
                    <IconButton onClick={() => this.handleDeprecate(device.id)} disabled={this.state.DisableButton}>
                      <Delete />
                    </IconButton>
                  </TableRowColumn>
                </TableRow>)
            }
          </TableBody>
        </Table>
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
