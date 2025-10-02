
# Simple Storage DApp on Base

A full-stack decentralized application (DApp) built with **Hardhat** for the smart contract backend and **React + Ethers.js** for the frontend.
The project is deployed on **Base**.

---

## Project Structure

├── backend/ # Hardhat setup for compiling & deploying contracts

├── frontend/ # React app for interacting with the deployed contract

└── README.md # Project guide

---

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/bammyoly/Storage-Dapp-on-Base.git
cd storage-dapp-on-base
```

### 2. Backend (Hardhat Contracts)

Go into the backend folder:

```bash
cd backend
```

### 3. Install dependencies:

```bash
npm install
```

### 4. Create a .env file with your keys:

```env
PRIVATE_KEY=your_wallet_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org
```

### 5. Compile contracts:

```bash
npx hardhat compile
```

### 6. Deploy to Base Sepolia (testnet):

```bash
npm run deploy
```

### 7. Deploy to Base Mainnet:

```bash
npx hardhat run scripts/deploy.js --network baseMainnet
```

### 8. Deployment saves the ABI + address automatically into:

```
frontend/src/contracts/SimpleStorage.json
```

### 9. Frontend (React DApp)

Go into the frontend folder:

```bash
cd ../frontend
```

### 10. Install dependencies:

```bash
npm install
```

### 11. Start the dev server:

```bash
npm run dev
```

### 12. The app will run on:

```
http://localhost:5173
```

---

##  DApp Features

* Connect / Disconnect wallet (MetaMask or Base-compatible wallets)
* Deploy the SimpleStorage smart contract directly from the UI
* Store a number on-chain
* Retrieve the stored number
* Toastr alerts for deployment success/failure with a BaseScan link

---

##  Tech Stack

* **Smart Contracts / Backend:** Hardhat, Ethers.js, dotenv
* **Frontend:** React (Vite), TailwindCSS, Ethers.js, Toastr.js
* **Blockchain:** Base (Sepolia Testnet + Mainnet)

---

## 📜 License

MIT License
