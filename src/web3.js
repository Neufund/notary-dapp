import LedgerWalletSubproviderFactory from 'ledger-wallet-provider';
import Web3 from 'web3';
import contract from 'truffle-contract';
import NeukeyNotaryArtifacts from '../contracts-private/build/contracts/NeukeyNotary.json';
import ProviderEngine from 'web3-provider-engine';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import { toPromise } from './utils';


let ledger = null;
let NeukeyNotary = null;
const NODE_URL = '/api/';

const initWeb3 = async function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask/Parity)
  if (typeof window.web3 !== 'undefined') {
    console.log('web3 already exists');
  } else {
    const engine = new ProviderEngine();
    const ledgerWalletSubProvider = await LedgerWalletSubproviderFactory();
    ledger = ledgerWalletSubProvider.ledger;
    engine.addProvider(ledgerWalletSubProvider);
    engine.addProvider(new RpcSubprovider({
      rpcUrl: NODE_URL,
    }));
    engine.start();
    window.web3 = new Web3(engine);
  }
  if (NeukeyNotary == null) {
    NeukeyNotary = await contract(NeukeyNotaryArtifacts);
    await NeukeyNotary.setProvider(window.web3.currentProvider);
  } else {
    console.log('Already a contract instance is there');
  }
  NeukeyNotary.defaults({
    from: '0xf666111c610ff3f27d22452320f89178ef8979eb',
  });
//   Only once to set the notary
  // NeukeyNotary.deployed().then(instance => instance.setNotary('0xf666111c610ff3f27d22452320f89178ef8979eb'));
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
