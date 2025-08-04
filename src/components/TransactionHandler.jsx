import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addPendingTransaction, 
  updateTransactionStatus,
  clearCurrentTransaction,
  setCurrentTransaction
} from '../redux/reducer/walletSlice';
import walletService from '../utils/walletService';
import toast from 'react-hot-toast';

const TransactionHandler = ({ 
  to, 
  value, 
  data = '', 
  onSuccess, 
  onError,
  buttonText = "Send Transaction",
  className = "btn btn-primary"
}) => {
  const dispatch = useDispatch();
  const { currentTransaction, isConnected } = useSelector(state => state.wallet);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStep, setTransactionStep] = useState('');

  const handleTransaction = async () => {
    if (!isConnected) {
      toast.error('🔗 Please connect your wallet first', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: 'white',
        },
      });
      return;
    }

    if (!to || !to.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('📍 Please enter a valid recipient address', {
        duration: 3000,
      });
      return;
    }

    if (!value || value <= 0) {
      toast.error('💰 Please enter a valid amount', {
        duration: 3000,
      });
      return;
    }

    try {
      setIsProcessing(true);
      setTransactionStep('Preparing transaction...');
      
      // Show loading toast
      const txToast = toast.loading('🔄 Preparing transaction...', {
        duration: Infinity,
      });
      
      // Simulate transaction preparation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransactionStep('Estimating gas fees...');
      toast.loading('⛽ Estimating gas fees...', { id: txToast });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTransactionStep('Waiting for wallet confirmation...');
      toast.loading('👆 Please confirm in your wallet', { 
        id: txToast,
        duration: Infinity 
      });
      
      // Simulate user confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTransactionStep('Broadcasting transaction...');
      toast.loading('📡 Broadcasting to network...', { id: txToast });
      
      // Create mock transaction (replace with real transaction)
      const mockTx = {
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        from: await walletService.getCurrentAccount(),
        to: to,
        value: value.toString(),
        gasPrice: '20',
        gas: 21000
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set current transaction
      dispatch(setCurrentTransaction({
        hash: mockTx.hash,
        from: mockTx.from,
        to: mockTx.to,
        value: mockTx.value,
        gasPrice: mockTx.gasPrice,
        gas: mockTx.gas,
        timestamp: Date.now()
      }));

      // Add to pending transactions
      dispatch(addPendingTransaction({
        hash: mockTx.hash,
        from: mockTx.from,
        to: mockTx.to,
        value: mockTx.value,
        gasPrice: mockTx.gasPrice,
        gas: mockTx.gas,
        timestamp: Date.now()
      }));

      setTransactionStep('Waiting for confirmation...');
      toast.loading('⏳ Waiting for blockchain confirmation...', { id: txToast });
      
      // Simulate blockchain confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful receipt
      const mockReceipt = {
        status: true,
        transactionHash: mockTx.hash,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        gasUsed: 21000
      };

      // Transaction successful
      dispatch(updateTransactionStatus({
        hash: mockTx.hash,
        status: 'completed',
        receipt: mockReceipt
      }));
      
      toast.success(`🎉 Transaction Confirmed!\nSent ${value} ETH successfully`, {
        id: txToast,
        duration: 6000,
        style: {
          background: '#10B981',
          color: 'white',
        },
      });
      
      if (onSuccess) {
        onSuccess(mockReceipt);
      }
      
    } catch (error) {
      console.error('Transaction error:', error);
      
      toast.error(`❌ Transaction failed: ${error.message}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: 'white',
        },
      });
      
      if (currentTransaction?.hash) {
        dispatch(updateTransactionStatus({
          hash: currentTransaction.hash,
          status: 'failed',
          receipt: error.message
        }));
      }
      
      if (onError) {
        onError(error.message);
      }
    } finally {
      setIsProcessing(false);
      setTransactionStep('');
      dispatch(clearCurrentTransaction());
    }
  };

  // Show transaction status
  const renderTransactionStatus = () => {
    if (!currentTransaction) return null;

    return (
      <div className="alert alert-primary mt-2" role="alert">
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm text-primary me-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div>
            <strong>Transaction in Progress</strong>
            <br />
            <small>
              {transactionStep && (
                <>
                  <span className="text-muted">{transactionStep}</span>
                  <br />
                </>
              )}
              <code className="small">
                {currentTransaction.hash.slice(0, 10)}...{currentTransaction.hash.slice(-6)}
              </code>
            </small>
          </div>
        </div>
        <div className="progress mt-2" style={{ height: '3px' }}>
          <div 
            className="progress-bar progress-bar-striped progress-bar-animated" 
            role="progressbar" 
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <button 
        className={`${className} ${isProcessing ? 'btn-warning' : ''}`}
        onClick={handleTransaction}
        disabled={isProcessing || !isConnected}
      >
        {isProcessing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {transactionStep || 'Processing...'}
          </>
        ) : (
          <>
            <i className="fa fa-paper-plane me-2"></i>
            {buttonText}
          </>
        )}
      </button>
      
      {renderTransactionStatus()}
      
      {!isConnected && (
        <div className="mt-2">
          <small className="text-muted">
            <i className="fa fa-info-circle me-1"></i>
            Connect your wallet to send transactions
          </small>
        </div>
      )}
    </div>
  );
};

export default TransactionHandler;