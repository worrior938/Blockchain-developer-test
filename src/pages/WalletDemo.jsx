import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import WalletConnect from '../components/WalletConnect';
import TransactionHandler from '../components/TransactionHandler';
import TransactionHistory from '../components/TransactionHistory';
import NFTMinter from '../components/NFTMinter';
import WalletStatus from '../components/WalletStatus';

const WalletDemo = () => {
  const { isConnected, address, network, balance } = useSelector(state => state.wallet);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('0.001');

  const handleTransactionSuccess = (receipt) => {
    console.log('Transaction successful:', receipt);
    // You can add additional logic here, like updating UI state
  };

  const handleTransactionError = (error) => {
    console.error('Transaction failed:', error);
    // You can add additional error handling here
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">
            <i className="fa fa-wallet me-3"></i>
            Wallet Connection Demo
          </h1>
          <p className="text-center text-muted mb-5">
            Experience seamless wallet integration with real-time transaction tracking
          </p>
        </div>
      </div>

      <div className="row">
        {/* Wallet Connection Section */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fa fa-plug me-2"></i>
                Wallet Connection
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <WalletConnect />
              </div>
              
              {isConnected && (
                <div className="mt-3">
                  <div className="alert alert-success">
                    <h6>Connected Wallet Info:</h6>
                    <div className="row">
                      <div className="col-6">
                        <strong>Address:</strong><br/>
                        <code className="small">{address}</code>
                      </div>
                      <div className="col-6">
                        <strong>Network:</strong><br/>
                        <span>{network}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <strong>Balance:</strong> {balance} ETH
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Section */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
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
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Amount (ETH)
                    </label>
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
                  </div>
                  
                  <TransactionHandler
                    to={recipientAddress}
                    value={parseFloat(transactionAmount)}
                    onSuccess={handleTransactionSuccess}
                    onError={handleTransactionError}
                    buttonText="Send ETH"
                    className="btn btn-primary w-100"
                  />
                  
                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="fa fa-info-circle me-1"></i>
                      Make sure you have enough ETH for the transaction and gas fees.
                    </small>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="fa fa-wallet fa-3x mb-3"></i>
                  <p>Connect your wallet to send transactions</p>
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
      <div className="row">
        <div className="col-12">
          <TransactionHistory />
        </div>
      </div>

      {/* Features Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fa fa-star me-2"></i>
                Features
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="text-center">
                    <i className="fa fa-link fa-2x text-primary mb-2"></i>
                    <h6>Wallet Connection</h6>
                    <small className="text-muted">
                      Connect to MetaMask and other Web3 wallets seamlessly
                    </small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="text-center">
                    <i className="fa fa-exchange-alt fa-2x text-success mb-2"></i>
                    <h6>Network Detection</h6>
                    <small className="text-muted">
                      Automatically detect and display current network information
                    </small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="text-center">
                    <i className="fa fa-clock fa-2x text-warning mb-2"></i>
                    <h6>Real-time Updates</h6>
                    <small className="text-muted">
                      Live transaction status updates with confirmation tracking
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Section */}
      <div className="row mt-4">
        <div className="col-12">
          <WalletStatus />
        </div>
      </div>
    </div>
  );
};

export default WalletDemo;