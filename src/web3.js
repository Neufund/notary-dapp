import web3Polyfill from 'web3-polyfill';
import LedgerWalletProviderFactory from 'ledger-wallet-provider';

let web3 = null;
let ledger = null;
const NODE_URL = '/api/';



let initWeb3 = async function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask/Parity)
    if (typeof window.web3 !== 'undefined') {
        console.warn("web3 already exists");
    } else {
        let hookedWalletSubprovider = await LedgerWalletProviderFactory();
        ledger = hookedWalletSubprovider.ledger;
        web3Polyfill(window)(NODE_URL, hookedWalletSubprovider);
    }
}
let exportObject = {
    get ledger() {
        return ledger;
    },
    initWeb3,
    get web3() {
        return window.web3;
    }
};

module.exports = exportObject;
