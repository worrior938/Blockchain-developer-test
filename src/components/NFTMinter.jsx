import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addPendingTransaction, 
  updateTransactionStatus,
  setCurrentTransaction 
} from '../redux/reducer/walletSlice';
import walletService from '../utils/walletService';
import toast from 'react-hot-toast';

// Simple NFT contract ABI (for demonstration)
// eslint-disable-next-line no-unused-vars
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

const NFTMinter = ({ contractAddress = "0x1234567890123456789012345678901234567890" }) => {
  const dispatch = useDispatch();
  const { isConnected, currentTransaction } = useSelector(state => state.wallet);
  const [tokenURI, setTokenURI] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStep, setMintingStep] = useState('');
  const [lastMintedToken, setLastMintedToken] = useState(null);

  // Sample token URIs for demo
  const sampleTokenURIs = [
    'https://api.example.com/metadata/cool-nft-1',
    'https://api.example.com/metadata/awesome-nft-2',
    'https://api.example.com/metadata/rare-nft-3'
  ];

  const handleMint = async () => {
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

    if (!tokenURI.trim()) {
      toast.error('📝 Please enter a token URI or use a sample', {
        duration: 3000,
      });
      return;
    }

    try {
      setIsMinting(true);
      setMintingStep('Preparing transaction...');

      // Show initial toast
      const mintingToast = toast.loading('🎨 Preparing to mint NFT...', {
        duration: Infinity,
      });

      // Simulate contract interaction (since we don't have a real contract)
      setMintingStep('Estimating gas fees...');
      toast.loading('⛽ Estimating gas fees...', { id: mintingToast });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMintingStep('Waiting for wallet confirmation...');
      toast.loading('👆 Please confirm the transaction in your wallet', { 
        id: mintingToast,
        duration: Infinity 
      });
      
      // Simulate user confirmation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMintingStep('Minting NFT...');
      toast.loading('🔨 Minting your NFT...', { id: mintingToast });
      
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create mock transaction
      const mockTx = {
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        from: await walletService.getCurrentAccount(),
        to: contractAddress,
        value: '0',
        gasPrice: '20',
        gas: 150000,
        tokenId: Math.floor(Math.random() * 10000) + 1
      };

      // Add to pending transactions
      dispatch(setCurrentTransaction({
        hash: mockTx.hash,
        from: mockTx.from,
        to: mockTx.to,
        value: '0',
        gasPrice: mockTx.gasPrice,
        gas: mockTx.gas,
        timestamp: Date.now(),
        type: 'NFT_MINT',
        tokenURI: tokenURI,
        tokenId: mockTx.tokenId
      }));

      dispatch(addPendingTransaction({
        hash: mockTx.hash,
        from: mockTx.from,
        to: mockTx.to,
        value: '0',
        gasPrice: mockTx.gasPrice,
        gas: mockTx.gas,
        timestamp: Date.now(),
        type: 'NFT_MINT',
        tokenURI: tokenURI,
        tokenId: mockTx.tokenId
      }));

      setMintingStep('Confirming on blockchain...');
      toast.loading('⛓️ Confirming on blockchain...', { id: mintingToast });
      
      // Simulate blockchain confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success!
      toast.success(`🎉 NFT Minted Successfully!\nToken ID: #${mockTx.tokenId}`, {
        id: mintingToast,
        duration: 6000,
        style: {
          background: '#10B981',
          color: 'white',
        },
      });
      
      // Update transaction status
      dispatch(updateTransactionStatus({
        hash: mockTx.hash,
        status: 'completed',
        receipt: {
          status: true,
          transactionHash: mockTx.hash,
          tokenId: mockTx.tokenId,
          tokenURI: tokenURI
        }
      }));

      // Set last minted token for display
      setLastMintedToken({
        tokenId: mockTx.tokenId,
        tokenURI: tokenURI,
        transactionHash: mockTx.hash
      });

      // Reset form
      setTokenURI('');
      
    } catch (error) {
      console.error('Minting error:', error);
      
      toast.error(`❌ Minting failed: ${error.message}`, {
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
    } finally {
      setIsMinting(false);
      setMintingStep('');
    }
  };

  const handleSampleURI = (uri) => {
    setTokenURI(uri);
    toast.success('📋 Sample URI loaded!');
  };

  if (!isConnected) {
    return (
      <div className="card border-warning">
        <div className="card-header">
          <h5 className="mb-0 text-warning">
            <i className="fa fa-palette me-2"></i>
            NFT Minter
          </h5>
        </div>
        <div className="card-body text-center py-4">
          <div className="mb-3">
            <i className="fa fa-wallet fa-3x text-warning mb-3"></i>
            <h6 className="text-muted">Wallet Connection Required</h6>
            <p className="text-muted small">Connect your wallet to start minting NFTs</p>
          </div>
          <div className="alert alert-info">
            <i className="fa fa-info-circle me-2"></i>
            <strong>What you can do:</strong>
            <ul className="list-unstyled mt-2 mb-0 small">
              <li>• Mint unique NFTs</li>
              <li>• Track transaction status</li>
              <li>• View minted tokens</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-primary">
      <div className="card-header">
        <h5 className="mb-0 text-primary">
          <i className="fa fa-palette me-2"></i>
          NFT Minter
          {lastMintedToken && (
            <span className="badge bg-success ms-2">
              Last: #{lastMintedToken.tokenId}
            </span>
          )}
        </h5>
      </div>
      <div className="card-body">
        {/* Minting Progress */}
        {isMinting && (
          <div className="alert alert-info mb-3">
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm text-primary me-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>
                <strong>Minting in Progress</strong>
                <br />
                <small>{mintingStep}</small>
              </div>
            </div>
            <div className="progress mt-2" style={{ height: '4px' }}>
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        )}

        {/* Last Minted Token Display */}
        {lastMintedToken && !isMinting && (
          <div className="alert alert-success mb-3">
            <h6 className="alert-heading">
              <i className="fa fa-check-circle me-2"></i>
              Recently Minted NFT
            </h6>
            <div className="row">
              <div className="col-md-6">
                <strong>Token ID:</strong> #{lastMintedToken.tokenId}
              </div>
              <div className="col-md-6">
                <strong>Transaction:</strong> 
                <code className="small ms-1">
                  {lastMintedToken.transactionHash.slice(0, 10)}...
                </code>
              </div>
            </div>
            <div className="mt-2">
              <strong>Metadata URI:</strong>
              <br />
              <small className="text-break">{lastMintedToken.tokenURI}</small>
            </div>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="tokenURI" className="form-label">
            <i className="fa fa-link me-1"></i>
            Token Metadata URI
          </label>
          <input
            type="text"
            className="form-control"
            id="tokenURI"
            placeholder="https://api.example.com/metadata/your-nft"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            disabled={isMinting}
          />
          <div className="form-text">
            <i className="fa fa-info-circle me-1"></i>
            Enter the URL to your NFT metadata (JSON format) or use a sample below
          </div>
        </div>

        {/* Sample URIs */}
        <div className="mb-3">
          <label className="form-label small text-muted">Quick Start - Sample URIs:</label>
          <div className="d-flex flex-wrap gap-1">
            {sampleTokenURIs.map((uri, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleSampleURI(uri)}
                disabled={isMinting}
              >
                Sample {index + 1}
              </button>
            ))}
          </div>
        </div>

        <button
          className={`btn w-100 ${isMinting ? 'btn-warning' : 'btn-primary'}`}
          onClick={handleMint}
          disabled={isMinting || !tokenURI.trim()}
        >
          {isMinting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {mintingStep || 'Minting NFT...'}
            </>
          ) : (
            <>
              <i className="fa fa-magic me-2"></i>
              Mint NFT
            </>
          )}
        </button>

        {/* Information Panel */}
        <div className="mt-3 p-3 bg-light rounded">
          <h6 className="small fw-bold text-muted mb-2">
            <i className="fa fa-lightbulb me-1"></i>
            How it works:
          </h6>
          <ul className="list-unstyled small text-muted mb-0">
            <li>• Enter or select a metadata URI</li>
            <li>• Confirm the transaction in your wallet</li>
            <li>• Wait for blockchain confirmation</li>
            <li>• Your NFT will be minted to your address</li>
          </ul>
        </div>

        {/* Gas Fee Estimate */}
        {!isMinting && (
          <div className="mt-2">
            <small className="text-muted">
              <i className="fa fa-gas-pump me-1"></i>
              Estimated gas fee: ~0.005 ETH
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTMinter;