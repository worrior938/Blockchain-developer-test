import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import WalletConnect from '../components/WalletConnect';
import TransactionHandler from '../components/TransactionHandler';
import TransactionHistory from '../components/TransactionHistory';
import NFTMinter from '../components/NFTMinter';
import WalletStatus from '../components/WalletStatus';
import { Navbar, Footer } from '../components';

const WalletDemo = () => {
  const { isConnected, address, network, balance } = useSelector(state => state.wallet);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('0.001');

  const handleTransactionSuccess = (receipt) => {
    console.log('Transaction successful:', receipt);
    // Reset form on success
    setRecipientAddress('');
    setTransactionAmount('0.001');
  };

  const handleTransactionError = (error) => {
    console.error('Transaction failed:', error);
  };

  const quickFillAddress = (address) => {
    setRecipientAddress(address);
  };

  const sampleAddresses = [
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    '0x8ba1f109551bD432803012645Hac136c22C57154'
  ];

  return (
    <>
      <Navbar />
      <div className="container mt-4 mb-5">
        <div className="row">
          <div className="col-12">
            <div className="text-center mb-5">
              <h1 className="display-4 mb-3">
                <i className="fa fa-wallet me-3 text-primary"></i>
                Web3 Wallet Demo
              </h1>
              <p className="lead text-muted mb-4">
                Experience seamless wallet integration with real-time transaction tracking
              </p>
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="alert alert-info">
                    <i className="fa fa-info-circle me-2"></i>
                    <strong>Demo Features:</strong> Connect MetaMask, send transactions, mint NFTs, and track everything in real-time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Wallet Connection Section */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100 border-primary">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fa fa-plug me-2"></i>
                  Wallet Connection
                </h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-3">
                  <WalletConnect />
                </div>
                
                {isConnected ? (
                  <div className="mt-3">
                    <div className="alert alert-success">
                      <h6 className="alert-heading">
                        <i className="fa fa-check-circle me-2"></i>
                        Wallet Connected Successfully!
                      </h6>
                      <div className="row g-2">
                        <div className="col-12">
                          <strong>Address:</strong><br/>
                          <code className="small text-break">{address}</code>
                        </div>
                        <div className="col-6">
                          <strong>Network:</strong><br/>
                          <span className="badge bg-info">{network}</span>
                        </div>
                        <div className="col-6">
                          <strong>Balance:</strong><br/>
                          <span className="fw-bold text-success">{balance} ETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    <h6 className="alert-heading">
                      <i className="fa fa-exclamation-triangle me-2"></i>
                      Wallet Not Connected
                    </h6>
                    <p className="mb-0">Connect your MetaMask wallet to access all features</p>
                  </div>
                )}

                {/* Connection Status Indicators */}
                <div className="row text-center mt-3">
                  <div className="col-4">
                    <div className={`p-2 rounded ${isConnected ? 'bg-success' : 'bg-light'}`}>
                      <i className={`fa fa-link ${isConnected ? 'text-white' : 'text-muted'}`}></i>
                      <div className="small mt-1">Connection</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className={`p-2 rounded ${isConnected && network ? 'bg-info' : 'bg-light'}`}>
                      <i className={`fa fa-globe ${isConnected && network ? 'text-white' : 'text-muted'}`}></i>
                      <div className="small mt-1">Network</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className={`p-2 rounded ${isConnected && balance ? 'bg-warning' : 'bg-light'}`}>
                      <i className={`fa fa-coins ${isConnected && balance ? 'text-white' : 'text-muted'}`}></i>
                      <div className="small mt-1">Balance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Section */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100 border-success">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="fa fa-paper-plane me-2"></i>
                  Send Transaction
                </h5>
              </div>
              <div className="card-body">
                {isConnected ? (
                  <div>
                    <div className="mb-3">
                      <label htmlFor="recipientAddress" className="form-label">
                        <i className="fa fa-user me-1"></i>
                        Recipient Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="recipientAddress"
                        placeholder="0x..."
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />
                      <div className="form-text">
                        Quick fill: 
                        {sampleAddresses.map((addr, index) => (
                          <button
                            key={index}
                            type="button"
                            className="btn btn-outline-secondary btn-sm ms-1"
                            onClick={() => quickFillAddress(addr)}
                          >
                            Sample {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="amount" className="form-label">
                        <i className="fa fa-coins me-1"></i>
                        Amount (ETH)
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          id="amount"
                          placeholder="0.001"
                          value={transactionAmount}
                          onChange={(e) => setTransactionAmount(e.target.value)}
                          step="0.001"
                          min="0"
                        />
                        <span className="input-group-text">ETH</span>
                      </div>
                      <div className="form-text">
                        Available: <strong>{balance} ETH</strong>
                      </div>
                    </div>
                    
                    <TransactionHandler
                      to={recipientAddress}
                      value={parseFloat(transactionAmount)}
                      onSuccess={handleTransactionSuccess}
                      onError={handleTransactionError}
                      buttonText="Send ETH"
                      className="btn btn-success w-100"
                    />
                    
                    <div className="mt-3 p-2 bg-light rounded">
                      <small className="text-muted">
                        <i className="fa fa-info-circle me-1"></i>
                        <strong>Transaction Info:</strong><br/>
                        • Estimated gas fee: ~0.001 ETH<br/>
                        • Network: {network}<br/>
                        • Confirmation time: ~15 seconds
                      </small>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fa fa-wallet fa-3x text-muted mb-3"></i>
                    <h6 className="text-muted">Wallet Required</h6>
                    <p className="text-muted">Connect your wallet to send transactions</p>
                    <div className="alert alert-info">
                      <small>
                        <strong>What you can do:</strong><br/>
                        • Send ETH to any address<br/>
                        • Track transaction status<br/>
                        • View transaction history
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* NFT Minter */}
        <div className="row mb-4">
          <div className="col-12">
            <NFTMinter contractAddress="0x1234567890123456789012345678901234567890" />
          </div>
        </div>

        {/* Transaction History */}
        <div className="row mb-4">
          <div className="col-12">
            <TransactionHistory />
          </div>
        </div>

        {/* Features Section */}
        <div className="row">
          <div className="col-12">
            <div className="card border-info">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="fa fa-star me-2"></i>
                  Demo Features & Capabilities
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="text-center p-3 border rounded">
                      <i className="fa fa-link fa-3x text-primary mb-3"></i>
                      <h6>Wallet Connection</h6>
                      <small className="text-muted">
                        Connect to MetaMask with auto-detection and reconnection
                      </small>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="text-center p-3 border rounded">
                      <i className="fa fa-exchange-alt fa-3x text-success mb-3"></i>
                      <h6>Smart Transactions</h6>
                      <small className="text-muted">
                        Send ETH with gas estimation and real-time status updates
                      </small>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="text-center p-3 border rounded">
                      <i className="fa fa-palette fa-3x text-warning mb-3"></i>
                      <h6>NFT Minting</h6>
                      <small className="text-muted">
                        Mint NFTs with step-by-step progress and confirmation
                      </small>
                    </div>
                  </div>
                </div>
                
                <div className="row mt-3">
                  <div className="col-md-6">
                    <h6 className="text-success">
                      <i className="fa fa-check me-2"></i>
                      Implemented Features:
                    </h6>
                    <ul className="list-unstyled small">
                      <li>✅ MetaMask connection & disconnection</li>
                      <li>✅ Network change detection</li>
                      <li>✅ Real-time balance updates</li>
                      <li>✅ Transaction status tracking</li>
                      <li>✅ NFT minting simulation</li>
                      <li>✅ Transaction history</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-info">
                      <i className="fa fa-lightbulb me-2"></i>
                      User Experience:
                    </h6>
                    <ul className="list-unstyled small">
                      <li>🎯 Clear visual feedback</li>
                      <li>🔄 Loading states & progress bars</li>
                      <li>📱 Responsive design</li>
                      <li>🎨 Toast notifications</li>
                      <li>⚡ Auto-reconnection</li>
                      <li>🛡️ Error handling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Section - Only show if connected */}
        {isConnected && (
          <div className="row mt-4">
            <div className="col-12">
              <WalletStatus />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WalletDemo;
        </div>
      </div>
    </div>
  );
};

export default WalletDemo;