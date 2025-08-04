import React, { useEffect, useCallback } from 'react';
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

  // Handle wallet disconnection
  const handleDisconnect = useCallback(() => {
    walletService.disconnectWallet();
    walletService.removeListeners();
    dispatch(setDisconnected());
    toast.success('👋 Wallet disconnected', {
      style: {
        background: '#6B7280',
        color: 'white',
      },
    });
  }, [dispatch]);

  // Set up event listeners for account and network changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setupEventListeners = useCallback(() => {
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
          
          toast.success(`🔄 Account switched\n${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`, {
            duration: 3000,
            style: {
              background: '#3B82F6',
              color: 'white',
            },
          });
        } catch (error) {
          console.error('Error switching accounts:', error);
        }
      }
    });

    // Listen for network changes
    walletService.onChainChanged(async (chainId) => {
      try {
        const networkData = await walletService.getCurrentNetwork();
        const account = await walletService.getCurrentAccount();
        const balance = await walletService.getBalance(account);
        
        dispatch(setNetwork({
          network: networkData.network,
          chainId: networkData.chainId
        }));
        
        dispatch(setBalance(parseFloat(balance).toFixed(4)));
        
        toast.success(`🌐 Network switched to ${networkData.network}`, {
          duration: 3000,
          style: {
            background: '#8B5CF6',
            color: 'white',
          },
        });
      } catch (error) {
        console.error('Error switching networks:', error);
      }
    });
  }, [dispatch]);

  // Initialize wallet connection on component mount
  // eslint-disable-next-line no-use-before-define
  useEffect(() => {
    checkExistingConnection();
  }, [checkExistingConnection]);

  // Check if wallet is already connected
  const checkExistingConnection = useCallback(async () => {
    try {
      if (walletService.isMetaMaskInstalled()) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          // Auto-connect if already authorized
          const walletData = await walletService.connectWallet();
          dispatch(setConnected(walletData));
          setupEventListeners();
        }
      }
    } catch (error) {
      // Silently fail - user hasn't connected yet
    }
  }, [dispatch, setupEventListeners]);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      dispatch(setConnecting(true));
      
      if (!walletService.isMetaMaskInstalled()) {
        throw new Error('MetaMask not detected. Please install MetaMask browser extension.');
      }
      
      const walletData = await walletService.connectWallet();
      dispatch(setConnected(walletData));
      
      toast.success(`🎉 Wallet connected!\nNetwork: ${walletData.network}`, {
        duration: 4000,
        style: {
          background: '#10B981',
          color: 'white',
        },
      });
      
      // Set up event listeners
      setupEventListeners();
      
    } catch (error) {
      dispatch(setError(error.message));
      
      if (error.message.includes('User rejected')) {
        toast.error('Connection cancelled by user');
      } else if (error.message.includes('MetaMask not detected')) {
        toast.error('Please install MetaMask to continue', {
          duration: 6000,
          action: {
            label: 'Install MetaMask',
            onClick: () => window.open('https://metamask.io/download/', '_blank')
          }
        });
      } else {
        toast.error(`Connection failed: ${error.message}`);
      }
    }
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

  // Show install MetaMask prompt if not available
  if (!walletService.isMetaMaskInstalled()) {
    return (
      <div className="btn-group">
        <button 
          className="btn btn-outline-warning"
          onClick={() => window.open('https://metamask.io/download/', '_blank')}
        >
          <i className="fa fa-download me-2"></i>
          Install MetaMask
        </button>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <button className="btn btn-outline-primary" disabled>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Connecting to wallet...
      </button>
    );
  }

  if (error) {
    return (
      <button 
        className="btn btn-outline-danger"
        onClick={handleConnect}
        title={error}
      >
        <i className="fa fa-exclamation-triangle me-2"></i>
        Retry Connection
      </button>
    );
  }

  if (isConnected) {
    return (
      <div className="dropdown">
        <button 
          className="btn btn-success dropdown-toggle d-flex align-items-center" 
          type="button" 
          id="walletDropdown" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
          style={{ minWidth: '160px' }}
        >
          <div className="d-flex align-items-center">
            <div className="bg-white rounded-circle p-1 me-2">
              <i className="fa fa-wallet text-success"></i>
            </div>
            <div className="text-start">
              <div className="small fw-bold">{formatAddress(address)}</div>
              <div className="small opacity-75">{balance} ETH</div>
            </div>
          </div>
        </button>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="walletDropdown" style={{ minWidth: '280px' }}>
          <li>
            <div className="dropdown-item-text border-bottom pb-2 mb-2">
              <div className="d-flex align-items-center mb-2">
                <i className="fa fa-user-circle fa-2x text-primary me-2"></i>
                <div>
                  <div className="fw-bold">Connected Wallet</div>
                  <small className="text-muted">Ready for transactions</small>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="dropdown-item-text">
              <div className="row g-0">
                <div className="col-4">
                  <small className="text-muted">Address</small>
                </div>
                <div className="col-8">
                  <code className="small">{formatAddress(address)}</code>
                  <button 
                    className="btn btn-sm btn-outline-secondary ms-1 p-0 px-1"
                    onClick={() => {
                      navigator.clipboard.writeText(address);
                      toast.success('Address copied!');
                    }}
                    title="Copy address"
                  >
                    <i className="fa fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="dropdown-item-text">
              <div className="row g-0">
                <div className="col-4">
                  <small className="text-muted">Network</small>
                </div>
                <div className="col-8">
                  <span className="small">{getNetworkIcon(network)} {network}</span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="dropdown-item-text">
              <div className="row g-0">
                <div className="col-4">
                  <small className="text-muted">Balance</small>
                </div>
                <div className="col-8">
                  <span className="fw-bold">{balance} ETH</span>
                </div>
              </div>
            </div>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button 
              className="dropdown-item"
              onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
            >
              <i className="fa fa-external-link-alt me-2"></i>
              View on Explorer
            </button>
          </li>
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
    <div className="btn-group">
      <button 
        className="btn btn-primary" 
        onClick={handleConnect}
      >
        <i className="fa fa-wallet me-2"></i>
        Connect Wallet
      </button>
    </div>
  );
};

export default WalletConnect;