import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPendingTransaction, updateTransactionStatus } from '../redux/reducer/walletSlice';
import walletService from '../utils/walletService';
import toast from 'react-hot-toast';

// Simple NFT contract ABI (for demonstration)
const NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const NFTMinter = ({ contractAddress }) => {
  const dispatch = useDispatch();
  const { isConnected, currentTransaction } = useSelector(state => state.wallet);
  const [tokenURI, setTokenURI] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!tokenURI.trim()) {
      toast.error('Please enter a token URI');
      return;
    }

    try {
      setIsMinting(true);

      // Create contract instance
      const web3 = walletService.web3;
      const contract = new web3.eth.Contract(NFT_ABI, contractAddress);
      
      // Get current account
      const account = await walletService.getCurrentAccount();
      
      // Estimate gas for mint function
      const gasEstimate = await contract.methods.mint(tokenURI).estimateGas({ from: account });
      
      // Send transaction
      const tx = await contract.methods.mint(tokenURI).send({
        from: account,
        gas: Math.floor(gasEstimate * 1.2) // Add 20% buffer
      });

      // Add to pending transactions
      dispatch(addPendingTransaction({
        hash: tx.transactionHash,
        from: account,
        to: contractAddress,
        value: '0',
        gasPrice: web3.utils.fromWei(tx.gasUsed * tx.effectiveGasPrice, 'gwei'),
        gas: tx.gasUsed,
        timestamp: Date.now(),
        type: 'NFT_MINT'
      }));

      toast.success('NFT minted successfully! 🎉');
      
      // Update transaction status
      dispatch(updateTransactionStatus({
        hash: tx.transactionHash,
        status: 'completed',
        receipt: tx
      }));

      // Reset form
      setTokenURI('');
      
    } catch (error) {
      console.error('Minting error:', error);
      
      if (currentTransaction?.hash) {
        dispatch(updateTransactionStatus({
          hash: currentTransaction.hash,
          status: 'failed',
          receipt: error.message
        }));
      }
      
      toast.error(`Minting failed: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fa fa-palette me-2"></i>
            NFT Minter
          </h5>
        </div>
        <div className="card-body text-center text-muted py-4">
          <i className="fa fa-wallet fa-3x mb-3"></i>
          <p>Connect your wallet to mint NFTs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fa fa-palette me-2"></i>
          NFT Minter
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="tokenURI" className="form-label">
            Token URI (Metadata URL)
          </label>
          <input
            type="text"
            className="form-control"
            id="tokenURI"
            placeholder="https://api.example.com/metadata/1"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
          />
          <div className="form-text">
            Enter the URL to your NFT metadata (JSON format)
          </div>
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleMint}
          disabled={isMinting || !tokenURI.trim()}
        >
          {isMinting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Minting NFT...
            </>
          ) : (
            <>
              <i className="fa fa-plus me-2"></i>
              Mint NFT
            </>
          )}
        </button>

        <div className="mt-3">
          <small className="text-muted">
            <i className="fa fa-info-circle me-1"></i>
            This will mint a new NFT to your connected wallet address.
          </small>
        </div>
      </div>
    </div>
  );
};

export default NFTMinter;