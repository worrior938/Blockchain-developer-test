import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addPendingTransaction, 
  updateTransactionStatus,
  clearCurrentTransaction 
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

  const handleTransaction = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Send transaction
      const tx = await walletService.sendTransaction(to, value, data);
      
      // Add to pending transactions
      dispatch(addPendingTransaction({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasPrice: tx.gasPrice,
        gas: tx.gas,
        timestamp: Date.now()
      }));

      toast.success('Transaction sent! Waiting for confirmation...');
      
      // Wait for confirmation
      const receipt = await walletService.waitForTransaction(tx.hash, 1);
      
      if (receipt.status) {
        // Transaction successful
        dispatch(updateTransactionStatus({
          hash: tx.hash,
          status: 'completed',
          receipt: receipt
        }));
        
        toast.success('Transaction confirmed! 🎉');
        
        if (onSuccess) {
          onSuccess(receipt);
        }
      } else {
        // Transaction failed
        dispatch(updateTransactionStatus({
          hash: tx.hash,
          status: 'failed',
          receipt: 'Transaction reverted'
        }));
        
        toast.error('Transaction failed');
        
        if (onError) {
          onError('Transaction reverted');
        }
      }
      
    } catch (error) {
      console.error('Transaction error:', error);
      
      if (currentTransaction?.hash) {
        dispatch(updateTransactionStatus({
          hash: currentTransaction.hash,
          status: 'failed',
          receipt: error.message
        }));
      }
      
      toast.error(`Transaction failed: ${error.message}`);
      
      if (onError) {
        onError(error.message);
      }
    } finally {
      setIsProcessing(false);
      dispatch(clearCurrentTransaction());
    }
  };

  // Show transaction status
  const renderTransactionStatus = () => {
    if (!currentTransaction) return null;

    return (
      <div className="alert alert-info mt-2" role="alert">
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div>
            <strong>Transaction Pending</strong>
            <br />
            <small className="text-muted">
              Hash: {currentTransaction.hash.slice(0, 10)}...
            </small>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <button 
        className={className}
        onClick={handleTransaction}
        disabled={isProcessing || !isConnected}
      >
        {isProcessing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Processing...
          </>
        ) : (
          <>
            <i className="fa fa-paper-plane me-2"></i>
            {buttonText}
          </>
        )}
      </button>
      
      {renderTransactionStatus()}
    </div>
  );
};

export default TransactionHandler;