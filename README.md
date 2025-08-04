# E-commerce Platform with Web3 Wallet Integration

A modern e-commerce platform with integrated Web3 wallet functionality for seamless blockchain interactions.

## Features

### 🛒 E-commerce Features
- Product catalog and shopping cart
- User authentication and registration
- Secure checkout process
- Responsive design with Bootstrap

### 🔗 Web3 Wallet Integration
- **Wallet Connection**: Connect to MetaMask and other Web3 wallets
- **Network Detection**: Automatic detection of Ethereum, Polygon, BSC, and other networks
- **Real-time Updates**: Live transaction status with confirmation tracking
- **Transaction History**: Complete history of pending, completed, and failed transactions
- **UI State Management**: Responsive UI updates during blockchain interactions

### 🎯 Wallet Features
- **Connect/Disconnect**: Seamless wallet connection and disconnection
- **Address Display**: Shows connected wallet address with formatting
- **Network Switching**: Detects and displays current network information
- **Balance Tracking**: Real-time wallet balance updates
- **Transaction Handling**: Send transactions with loading states and confirmations
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Run Locally

Clone the project

```bash
  git clone https://github.com/Meta-Dex-Platform/E-commerce
```

Go to the project directory

```bash
  cd React_E-Commerce
```

Install dependencies

```bash
  npm install --legacy-peer-deps

  OR 

  npm install react-material-ui-carousel --save --legacy-peer-deps
```

Run the project

```bash
  npm start
```

## Wallet Demo

Visit `/wallet-demo` to experience the full wallet functionality:

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask
2. **View Wallet Info**: See your address, network, and balance
3. **Send Transactions**: Send ETH to any address with real-time tracking
4. **Transaction History**: View all your transaction history with status updates

## Technical Stack

- **Frontend**: React 18, Redux Toolkit, Bootstrap 5
- **Web3**: Web3.js, Ethers.js
- **Wallet Integration**: MetaMask support with extensible architecture
- **State Management**: Redux for wallet and transaction state
- **UI Components**: Custom wallet components with loading states
- **Notifications**: React Hot Toast for user feedback

## Project Structure

```
src/
├── components/
│   ├── WalletConnect.jsx      # Wallet connection component
│   ├── TransactionHandler.jsx # Transaction management
│   ├── TransactionHistory.jsx # Transaction history display
│   └── Navbar.jsx            # Updated navbar with wallet
├── pages/
│   └── WalletDemo.jsx        # Demo page for wallet features
├── redux/
│   └── reducer/
│       ├── walletSlice.js    # Wallet state management
│       └── index.js          # Root reducer
└── utils/
    └── walletService.js      # Web3 wallet service
```

## Wallet Integration Requirements

### ✅ Implemented Features

1. **Wallet Connection**
   - ✅ Users can connect/disconnect their wallet (MetaMask)
   - ✅ UI responds correctly to connection status
   - ✅ Network changes are detected and displayed

2. **UI-State Sync**
   - ✅ After transactions complete, UI updates with success messages
   - ✅ Pending transactions show loaders/spinners
   - ✅ Confirmations update UI with real-time status

### 🔧 Usage Examples

```jsx
// Connect wallet
<WalletConnect />

// Send transaction
<TransactionHandler
  to="0x..."
  value={0.001}
  onSuccess={(receipt) => console.log('Success!', receipt)}
  onError={(error) => console.error('Error:', error)}
/>

// View transaction history
<TransactionHistory />
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the wallet functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.


