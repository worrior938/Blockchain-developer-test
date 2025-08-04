import React from 'react';
import { Navbar, Footer } from '../components';
import WalletConnect from '../components/WalletConnect';
import WalletStatus from '../components/WalletStatus';
import NFTMinter from '../components/NFTMinter';
import TransactionHistory from '../components/TransactionHistory';

const WalletDemo = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mb-4">🔗 Wallet Demo</h1>
            <p className="text-center text-muted mb-5">
              Experience blockchain wallet integration and NFT minting functionality
            </p>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">💼 Wallet Connection</h5>
              </div>
              <div className="card-body">
                <WalletConnect />
                <WalletStatus />
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">🎨 NFT Minting</h5>
              </div>
              <div className="card-body">
                <NFTMinter />
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">📋 Transaction History</h5>
              </div>
              <div className="card-body">
                <TransactionHistory />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WalletDemo;