import LedgerWalletSubproviderFactory from 'ledger-wallet-provider';
import Web3 from 'web3';
import contract from 'truffle-contract';
import NeukeyNotaryArtifacts from '../contracts-private/build/contracts/NeukeyNotary.json';


let ledger = null;
let NeukeyNotary = null;
const NODE_URL = '/api/';

const initWeb3 = async function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask/Parity)
  if (typeof window.web3 !== 'undefined') {
    console.info('web3 already exists');
  } else {
    const ledgerWalletSubProvider = await LedgerWalletSubproviderFactory();
    ledger = ledgerWalletSubProvider.ledger;
    window.web3 = new Web3(new Web3.providers.HttpProvider(NODE_URL));
    window.web3.eth.defaultAccount = window.web3.eth.accounts[0];
    window.web3.eth.sendTransaction({ from: window.web3.eth.accounts[1], to: '0x1078291bbcc539f51559f14bc57d1575d3801df8', value: window.web3.toWei(1, 'ether') });
    console.log(ledger);
  }
  await window.web3;
  NeukeyNotary = await contract(NeukeyNotaryArtifacts);
  await NeukeyNotary.setProvider(window.web3.currentProvider);
  NeukeyNotary.deployed().then(instance => instance.setNotary(window.web3.eth.accounts[0]));
};

const initContract = async function () {
  const NeukeyNotary = await contract(NeukeyNotaryArtifacts);
  await NeukeyNotary.setProvider(window.web3.currentProvider);
  console.log(NeukeyNotary);
 //  await NeukeyNotary.deployed().then(function(instance) {
//  await return instance.set_notary(window.web3.eth.accounts[0]);
//  });
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
    return NeukeyNotary;
  },
};

module.exports = exportObject;
