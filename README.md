# BotFeedback — On-Chain Feedback dApp

**BotFeedback** is a minimal, polished, and decentralized feedback application deployed on **Botchain Testnet** (Chain ID 968). It allows users to submit short feedback messages and ratings (1–5 stars) that are recorded permanently on the blockchain. Any user can connect their Web3 wallet, view submitted feedback entries in real time, and verify transaction records on the Botchain Explorer.

---

## 🌟 Key Features

- **Decentralized & Tamper-Proof**: All feedback entries and ratings are recorded immutably on the Botchain Testnet smart contract.
- **Direct Contract Reads**: Feedback messages and metrics are queried directly from the blockchain via Wagmi and Viem—no database or centralized backend required.
- **Real-Time Feed**: Submissions are displayed with the newest feedback first, including ratings, timestamps, and sender wallet addresses.
- **Dynamic Star Ratings**: Intuitive 1 to 5 star rating picker with average rating calculation.
- **Wallet Connection & Network Detection**: Detects connection states, shows connected addresses, and prompts users if they are connected to any network other than Botchain Testnet (Chain ID 968).
- **Explorer Links**: Direct verification links to the [Botchain Explorer](https://scan.bohr.life) for transaction hashes and wallet addresses.
- **Input Validation**: Strict client-side and contract-level validation rejecting empty messages, inputs exceeding 280 characters, and ratings outside the 1–5 range.

---

## 🛠 Technology Stack

- **Smart Contract**: Solidity `^0.8.24`, Hardhat
- **Frontend Framework**: Next.js (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS (Modern dark Web3 aesthetic)
- **Web3 Integration**: [wagmi](https://wagmi.sh), [viem](https://viem.sh), `@tanstack/react-query`
- **Icons**: Lucide React

---

## 🌐 Botchain Testnet Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |
| **Native Currency** | `BOT` (Decimals: 18) |

> ⚠️ **Note**: Botchain Mainnet is intentionally not configured. This application is targeted solely for Botchain Testnet.

---

## 📁 Project Structure

```text
botfeedback/
├── contracts/
│   └── BotFeedback.sol        # Solidity smart contract
├── test/
│   └── BotFeedback.ts         # Hardhat unit tests
├── scripts/
│   └── deploy.ts              # Botchain deployment script
├── app/
│   ├── layout.tsx             # Root layout with providers & SEO
│   ├── page.tsx               # Main dApp interface
│   ├── providers.tsx          # Wagmi & React Query providers
│   └── globals.css            # Dark theme styles & ambient mesh
├── components/
│   ├── WalletButton.tsx       # Wallet connection & network switch button
│   ├── FeedbackForm.tsx       # Rating selector, message textarea & submit logic
│   └── FeedbackList.tsx       # On-chain feedback feed and metrics
├── lib/
│   ├── botchain.ts            # Viem/Wagmi custom chain definition
│   └── contract.ts            # Contract ABI, address, and explorer helpers
├── .env.example               # Environment variables template
├── hardhat.config.ts          # Hardhat configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### 1. Installation

Clone or open the repository directory, then install the dependencies:

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Configure the environment variables in `.env`:

```env
# Address of the deployed BotFeedback smart contract on Botchain Testnet
NEXT_PUBLIC_BOT_FEEDBACK_ADDRESS=

# Private key of deployer wallet (for deploying smart contract via Hardhat)
PRIVATE_KEY=

# RPC URL for Botchain Testnet
BOTCHAIN_RPC_URL=https://rpc.bohr.life
```

---

## 🧪 Smart Contract Tests

Run the complete test suite covering contract submission, boundary validation, order maintenance, event emissions, and average rating calculations:

```bash
npm run test
```

To compile the smart contract:

```bash
npm run compile
```

---

## 🚢 Deploying the Smart Contract

1. Make sure your deployer wallet has testnet `BOT` funds on Botchain Testnet.
2. In `.env`, set `PRIVATE_KEY` to your deployer wallet private key (ensure you never commit real keys to version control).
3. Run the deployment script:

```bash
npm run deploy
```

Upon successful deployment, the script outputs:
- Network Name (`botchainTestnet`)
- Chain ID (`968`)
- Deployed Contract Address
- Direct Link to [Botchain Explorer](https://scan.bohr.life)

4. Copy the deployed contract address and set it in `.env`:

```env
NEXT_PUBLIC_BOT_FEEDBACK_ADDRESS=0xYourDeployedAddressHere
```

---

## 💻 Running the Frontend

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy Notice

> ⚠️ **IMPORTANT WARNING**: 
> All feedback messages submitted through this application are stored **permanently and publicly on the Botchain blockchain**. Once confirmed, messages cannot be modified, hidden, or deleted. 
> 
> **Do not submit passwords, seed phrases, private keys, personally identifiable information (PII), or confidential data.**
