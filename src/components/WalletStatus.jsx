import React from 'react';
import { useSelector } from 'react-redux';

const WalletStatus = () => {
  const walletState = useSelector(state => state.wallet);

  return (
    <div className="card">
      <div className="card-header">
        <h6 className="mb-0">
          <i className="fa fa-info-circle me-2"></i>
          Wallet Status (Debug)
        </h6>
      </div>
      <div className="card-body">
        <pre className="mb-0" style={{ fontSize: '0.8rem' }}>
          {JSON.stringify(walletState, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WalletStatus;