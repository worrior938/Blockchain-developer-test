import Web3 from 'web3';
import { ethers } from 'ethers';

class WalletService {
  constructor() {
    this.web3 = null;
    this.provider = null;
    this.signer = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
  }

  // Get network name from chain ID
  getNetworkName(chainId) {
    const networks = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      4: 'Rinkeby Testnet',
      5: 'Goerli Testnet',
      42: 'Kovan Testnet',
      56: 'Binance Smart Chain',
      97: 'Binance Smart Chain Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai Testnet',
      43114: 'Avalanche C-Chain',
      43113: 'Avalanche Fuji Testnet'
    };
    return networks[chainId] || `Chain ID ${chainId}`;
  }

  // Connect to wallet
  async connectWallet() {
    try {
      if (!this.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      const account = accounts[0];
      
      // Get network information
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      const networkName = this.getNetworkName(parseInt(chainId, 16));
      
      // Initialize Web3 and ethers
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.web3 = new Web3(window.ethereum);

      // Get balance
      const balance = await this.web3.eth.getBalance(account);
      const balanceInEth = this.web3.utils.fromWei(balance, 'ether');

      return {
        address: account,
        network: networkName,
        chainId: parseInt(chainId, 16),
        balance: parseFloat(balanceInEth).toFixed(4)
      };
    } catch (error) {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  // Disconnect wallet
  disconnectWallet() {
    this.web3 = null;
    this.provider = null;
    this.signer = null;
  }

  // Get current account
  async getCurrentAccount() {
    if (!this.web3) {
      throw new Error('Wallet not connected');
    }
    
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0];
  }

  // Get current network
  async getCurrentNetwork() {
    if (!this.web3) {
      throw new Error('Wallet not connected');
    }

    const chainId = await this.web3.eth.getChainId();
    const networkName = this.getNetworkName(chainId);
    
    return {
      network: networkName,
      chainId: chainId
    };
  }

  // Get balance
  async getBalance(address) {
    if (!this.web3) {
      throw new Error('Wallet not connected');
    }

    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
  }

  // Send transaction
  async sendTransaction(to, value, data = '') {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const account = await this.getCurrentAccount();
      const nonce = await this.web3.eth.getTransactionCount(account, 'pending');
      const gasPrice = await this.web3.eth.getGasPrice();
      
      // Estimate gas
      const gasEstimate = await this.web3.eth.estimateGas({
        from: account,
        to: to,
        value: this.web3.utils.toWei(value.toString(), 'ether'),
        data: data
      });

      const transaction = {
        from: account,
        to: to,
        value: this.web3.utils.toWei(value.toString(), 'ether'),
        data: data,
        nonce: nonce,
        gasPrice: gasPrice,
        gas: Math.floor(gasEstimate * 1.2) // Add 20% buffer
      };

      // Send transaction
      const tx = await this.signer.sendTransaction(transaction);
      
      return {
        hash: tx.hash,
        from: account,
        to: to,
        value: value,
        gasPrice: this.web3.utils.fromWei(gasPrice, 'gwei'),
        gas: transaction.gas
      };
    } catch (error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  // Wait for transaction confirmation
  async waitForTransaction(hash, confirmations = 1) {
    if (!this.web3) {
      throw new Error('Wallet not connected');
    }

    try {
      const receipt = await this.web3.eth.waitForTransactionReceipt(hash, confirmations);
      return receipt;
    } catch (error) {
      throw new Error(`Failed to get transaction receipt: ${error.message}`);
    }
  }

  // Listen for account changes
  onAccountsChanged(callback) {
    if (!this.isMetaMaskInstalled()) {
      return;
    }

    window.ethereum.on('accountsChanged', callback);
  }

  // Listen for network changes
  onChainChanged(callback) {
    if (!this.isMetaMaskInstalled()) {
      return;
    }

    window.ethereum.on('chainChanged', callback);
  }

  // Remove event listeners
  removeListeners() {
    if (!this.isMetaMaskInstalled()) {
      return;
    }

    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');
  }
}

const walletService = new WalletService();
export default walletService;