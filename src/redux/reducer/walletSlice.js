import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  address: null,
  network: null,
  chainId: null,
  balance: null,
  isConnecting: false,
  error: null,
  transactions: {
    pending: [],
    completed: [],
    failed: []
  },
  currentTransaction: null
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnecting: (state, action) => {
      state.isConnecting = action.payload;
      state.error = null;
    },
    setConnected: (state, action) => {
      state.isConnected = true;
      state.isConnecting = false;
      state.address = action.payload.address;
      state.network = action.payload.network;
      state.chainId = action.payload.chainId;
      state.balance = action.payload.balance;
      state.error = null;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
      state.address = null;
      state.network = null;
      state.chainId = null;
      state.balance = null;
      state.isConnecting = false;
      state.error = null;
    },
    setNetwork: (state, action) => {
      state.network = action.payload.network;
      state.chainId = action.payload.chainId;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    addPendingTransaction: (state, action) => {
      state.transactions.pending.push(action.payload);
      state.currentTransaction = action.payload;
    },
    updateTransactionStatus: (state, action) => {
      const { hash, status, receipt } = action.payload;
      
      // Remove from pending
      state.transactions.pending = state.transactions.pending.filter(tx => tx.hash !== hash);
      
      // Add to appropriate array
      if (status === 'completed') {
        state.transactions.completed.push({ ...receipt, hash });
      } else if (status === 'failed') {
        state.transactions.failed.push({ hash, error: receipt });
      }
      
      // Clear current transaction if it matches
      if (state.currentTransaction?.hash === hash) {
        state.currentTransaction = null;
      }
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    }
  }
});

export const {
  setConnecting,
  setConnected,
  setDisconnected,
  setNetwork,
  setBalance,
  setError,
  addPendingTransaction,
  updateTransactionStatus,
  clearCurrentTransaction
} = walletSlice.actions;

export default walletSlice.reducer;