import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setConnecting, 
  setConnected, 
  setDisconnected, 
  setNetwork, 
  setBalance,
  setError 
} from '../redux/reducer/walletSlice';
import walletService from '../utils/walletService';
import toast from 'react-hot-toast';

const WalletConnect = () => {
  const dispatch = useDispatch();
  const { 
    isConnected, 
    address, 
    network, 
    balance, 
    isConnecting, 
    error 
  } = useSelector(state => state.wallet);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      dispatch(setConnecting(true));
      
      const walletData = await walletService.connectWallet();
      dispatch(setConnected(walletData));
      
      toast.success('Wallet connected successfully!');
      
      // Set up event listeners
      setupEventListeners();
      
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    walletService.disconnectWallet();
    walletService.removeListeners();
    dispatch(setDisconnected());
    toast.success('Wallet disconnected');
  };

  // Set up event listeners for account and network changes
  const setupEventListeners = () => {
    // Listen for account changes
    walletService.onAccountsChanged(async (accounts) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        handleDisconnect();
      } else {
        // User switched accounts
        try {
          const newAddress = accounts[0];
          const newBalance = await walletService.getBalance(newAddress);
          const networkData = await walletService.getCurrentNetwork();
          
          dispatch(setConnected({
            address: newAddress,
            network: networkData.network,
            chainId: networkData.chainId,
            balance: parseFloat(newBalance).toFixed(4)
          }));
          
          toast.success('Account changed');
        } catch (error) {
          toast.error('Failed to update account information');
        }
      }
    });

    // Listen for network changes
    walletService.onChainChanged(async (chainId) => {
      try {
        const networkData = await walletService.getCurrentNetwork();
        dispatch(setNetwork(networkData));
        
        // Update balance for new network
        if (address) {
          const newBalance = await walletService.getBalance(address);
          dispatch(setBalance(parseFloat(newBalance).toFixed(4)));
        }
        
        toast.success(`Switched to ${networkData.network}`);
      } catch (error) {
        toast.error('Failed to update network information');
      }
    });
  };

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Get network icon/color
  const getNetworkIcon = (networkName) => {
    if (networkName.includes('Ethereum')) return '🔵';
    if (networkName.includes('Polygon')) return '🟣';
    if (networkName.includes('Binance')) return '🟡';
    if (networkName.includes('Avalanche')) return '🔴';
    return '⚫';
  };

  if (isConnecting) {
    return (
      <div className="btn btn-outline-primary" disabled>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Connecting...
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="dropdown">
        <button 
          className="btn btn-outline-success dropdown-toggle" 
          type="button" 
          id="walletDropdown" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
        >
          <i className="fa fa-wallet me-2"></i>
          {formatAddress(address)}
        </button>
        <ul className="dropdown-menu" aria-labelledby="walletDropdown">
          <li>
            <div className="dropdown-item-text">
              <small className="text-muted">Address</small><br/>
              <code className="small">{address}</code>
            </div>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <div className="dropdown-item-text">
              <small className="text-muted">Network</small><br/>
              <span>{getNetworkIcon(network)} {network}</span>
            </div>
          </li>
          <li>
            <div className="dropdown-item-text">
              <small className="text-muted">Balance</small><br/>
              <span>{balance} ETH</span>
            </div>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button 
              className="dropdown-item text-danger" 
              onClick={handleDisconnect}
            >
              <i className="fa fa-sign-out-alt me-2"></i>
              Disconnect
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <button 
      className="btn btn-outline-primary" 
      onClick={handleConnect}
    >
      <i className="fa fa-wallet me-2"></i>
      Connect Wallet
    </button>
  );
};

export default WalletConnect;