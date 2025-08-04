import React from 'react';
import { useSelector } from 'react-redux';

const TransactionHistory = () => {
  const { transactions } = useSelector(state => state.wallet);

  const formatHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <span className="text-warning">⏳</span>;
      case 'completed':
        return <span className="text-success">✅</span>;
      case 'failed':
        return <span className="text-danger">❌</span>;
      default:
        return <span>❓</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 'completed':
        return <span className="badge bg-success">Completed</span>;
      case 'failed':
        return <span className="badge bg-danger">Failed</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const renderTransactionList = (txList, status) => {
    if (txList.length === 0) {
      return (
        <div className="text-muted text-center py-3">
          No {status} transactions
        </div>
      );
    }

    return txList.map((tx, index) => (
      <div key={tx.hash || index} className="card mb-2">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-1">
                {getStatusIcon(status)}
                <span className="ms-2 fw-bold">{formatHash(tx.hash)}</span>
                <span className="ms-2">{getStatusBadge(status)}</span>
              </div>
              
              <div className="row text-muted small">
                <div className="col-md-6">
                  <strong>From:</strong> {formatHash(tx.from)}
                </div>
                <div className="col-md-6">
                  <strong>To:</strong> {formatHash(tx.to)}
                </div>
              </div>
              
              <div className="row text-muted small">
                <div className="col-md-4">
                  <strong>Value:</strong> {tx.value} ETH
                </div>
                <div className="col-md-4">
                  <strong>Gas:</strong> {tx.gas}
                </div>
                <div className="col-md-4">
                  <strong>Gas Price:</strong> {tx.gasPrice} Gwei
                </div>
              </div>
              
              {tx.timestamp && (
                <div className="text-muted small mt-1">
                  <strong>Time:</strong> {formatTimestamp(tx.timestamp)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const totalTransactions = 
    transactions.pending.length + 
    transactions.completed.length + 
    transactions.failed.length;

  if (totalTransactions === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fa fa-history me-2"></i>
            Transaction History
          </h5>
        </div>
        <div className="card-body text-center text-muted py-4">
          <i className="fa fa-inbox fa-3x mb-3"></i>
          <p>No transactions yet</p>
          <small>Your transaction history will appear here</small>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fa fa-history me-2"></i>
          Transaction History
        </h5>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-4">
            <div className="text-center">
              <div className="h4 text-warning">{transactions.pending.length}</div>
              <small className="text-muted">Pending</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="h4 text-success">{transactions.completed.length}</div>
              <small className="text-muted">Completed</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="h4 text-danger">{transactions.failed.length}</div>
              <small className="text-muted">Failed</small>
            </div>
          </div>
        </div>

        {/* Pending Transactions */}
        {transactions.pending.length > 0 && (
          <div className="mb-4">
            <h6 className="text-warning">
              <i className="fa fa-clock me-2"></i>
              Pending Transactions ({transactions.pending.length})
            </h6>
            {renderTransactionList(transactions.pending, 'pending')}
          </div>
        )}

        {/* Completed Transactions */}
        {transactions.completed.length > 0 && (
          <div className="mb-4">
            <h6 className="text-success">
              <i className="fa fa-check-circle me-2"></i>
              Completed Transactions ({transactions.completed.length})
            </h6>
            {renderTransactionList(transactions.completed, 'completed')}
          </div>
        )}

        {/* Failed Transactions */}
        {transactions.failed.length > 0 && (
          <div className="mb-4">
            <h6 className="text-danger">
              <i className="fa fa-times-circle me-2"></i>
              Failed Transactions ({transactions.failed.length})
            </h6>
            {renderTransactionList(transactions.failed, 'failed')}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;