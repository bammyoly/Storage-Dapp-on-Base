
```markdown
# Simple Storage DApp on Base

A full-stack decentralized application (DApp) built with **Hardhat** for the smart contract backend and **React + Ethers.js** for the frontend.  
The project is deployed on **Base** (L2 by Coinbase).

---

## 📂 Project Structure

```

├── backend/   # Hardhat setup for compiling & deploying contracts
├── frontend/  # React app for interacting with the deployed contract
└── README.md  # Project guide

````

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
````

### 2. Backend (Hardhat Contracts)

Go into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file with your keys:

```ini
PRIVATE_KEY=your_wallet_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org
```

Compile contracts:

```bash
npx hardhat compile
```

Deploy to Base Sepolia (testnet):

```bash
npm run deploy
```

Deploy to Base Mainnet:

```bash
npx hardhat run scripts/deploy.js --network baseMainnet
```

📌 **Note**: Deployment saves the ABI + contract address automatically into:

```
frontend/src/contracts/SimpleStorage.json
```

---

## 🌐 Frontend (React DApp)

Go into the frontend folder:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The app will run on:
👉 [http://localhost:5173](http://localhost:5173)

---

## ✨ DApp Features

* 🔗 Connect / Disconnect wallet (MetaMask or Base-compatible wallets)
* 🚀 Deploy the **SimpleStorage** smart contract directly from the UI
* 📝 Store a number on-chain
* 📖 Retrieve the stored number
* ✅ Toastr alerts for deployment success/failure with a BaseScan link

---

## 🧰 Tech Stack

* **Smart Contracts / Backend**: Hardhat, Ethers.js, dotenv
* **Frontend**: React (Vite), TailwindCSS, Ethers.js, Toastr.js
* **Blockchain**: Base (Sepolia Testnet + Mainnet)

---

## 📜 License

MIT License

```

---

✅ Just copy this whole thing into your `README.md` file, and when you push to GitHub it will display perfectly formatted.  

Do you also want me to include **badges** (for Node.js, Hardhat, Base, React) at the top of the README to make it more professional?
```
