import LedgerWalletProviderFactory from 'ledger-wallet-provider';
import Web3 from 'web3';
import contract from 'truffle-contract';
import NeukeyNotaryArtifacts from '../contracts-private/build/contracts/NeukeyNotary.json';
import web3Polyfill from 'web3-polyfill';
import { toPromise } from './utils';


let ledger = null;
const NeukeyNotary = null;
const NODE_URL = '/api/';
let instance = null;

const initWeb3 = async function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask/Parity)
  if (typeof window.web3 !== 'undefined') {
    console.log('web3 already exists');
  } else {
    const hookedWalletSubprovider = await LedgerWalletProviderFactory();
    ledger = hookedWalletSubprovider.ledger;
    web3Polyfill(window)(NODE_URL, hookedWalletSubprovider);
  //  const accounts = await toPromise(window.web3.eth.getAccounts);
  //  console.log(accounts);
  //  window.web3Manager = new Web3(new Web3.providers.HttpProvider(NODE_URL));
  //  window.web3Manager.eth.defaultAccount = window.web3Manager.eth.accounts[0];
  // Use to send Ether to
  //  window.web3Manager.eth.sendTransaction({ from: window.web3Manager.eth.accounts[1], to: '0x1078291bbcc539f51559f14bc57d1575d3801df8', value: window.web3.toWei(1, 'ether') });
  }
  const NeukeyNotary = await contract(NeukeyNotaryArtifacts);
  await NeukeyNotary.setProvider(window.web3.currentProvider);
  instance = await NeukeyNotary.deployed();
  console.log(instance);
//  NeukeyNotary.deployed().then(instance => instance.setNotary('0x3605d3d35878daf71d9af44692ccf0f04e9a2446'));
};

const exportObject = {
  get ledger() {
    return ledger;
  },
  initWeb3,
  get web3() {
    return window.web3;
  },
  get contract() {
    return instance;
  },
};

module.exports = exportObject;
