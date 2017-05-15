import LedgerWalletProviderFactory from 'ledger-wallet-provider';
import contract from 'truffle-contract'
import NeukeyNotary_artifacts from '../contracts-private/build/contracts/NeukeyNotary.json'
import LedgerWalletSubproviderFactory from 'ledger-wallet-provider';
import Web3 from 'web3'
import ProviderEngine from 'web3-provider-engine';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';


let web3 = null;
let ledger = null;
let NeukeyNotary = null;
let externalWeb3 = null;
const NODE_URL = '/api/';



let initWeb3 = async function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask/Parity)
    if (typeof window.web3 !== 'undefined') {
       console.info("web3 already exists");
       externalWeb3 = true;
        }  else {
         let ledgerWalletSubProvider = await LedgerWalletSubproviderFactory();
         ledger = ledgerWalletSubProvider.ledger;
         window.web3 =  new Web3(new Web3.providers.HttpProvider(NODE_URL));
         window.web3.eth.defaultAccount = window.web3.eth.accounts[0];
         externalWeb3 = false;
         window.web3.eth.sendTransaction({from:window.web3.eth.accounts[1], to:"0x1078291bbcc539f51559f14bc57d1575d3801df8", value: window.web3.toWei(1, "ether")})
         console.log(ledger);


    }
    await window.web3;
    NeukeyNotary = await contract(NeukeyNotary_artifacts);
    await NeukeyNotary.setProvider(window.web3.currentProvider);
    NeukeyNotary.deployed().then(function(instance) {
    return instance.setNotary(window.web3.eth.accounts[0]);
  });
}

let initContract = async function() {
   let NeukeyNotary = await contract(NeukeyNotary_artifacts);
   await NeukeyNotary.setProvider(window.web3.currentProvider);
   console.log(NeukeyNotary);
 //  await NeukeyNotary.deployed().then(function(instance) {
//  await return instance.set_notary(window.web3.eth.accounts[0]);
//  });
}

let exportObject = {
    get ledger() {
        return ledger;
    },
    initWeb3,
    get web3() {
        return window.web3;
    },
    get contract(){
      return NeukeyNotary;
    }
};

module.exports = exportObject;
