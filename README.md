# 🚀 Full Stack Solana dApp

A full-stack Solana dApp featuring token creation, bonding curve-based buy/sell mechanisms, a wallet-connected frontend, and a secure backend using Anchor, Rust, TypeScript, and React.


## 🧱 Tech Stack

| Layer      | Stack                                  |
|------------|----------------------------------------|
| Smart Contract | Rust + Anchor on Solana           |
| Backend    | TypeScript (Node.js + Express + Anchor)|
| Frontend   | React + Tailwind + Solana Wallet Adapter |
| Blockchain | Solana Devnet                          |


## 🪙 Features

- ✅ Token creation on Solana devnet
- ✅ Bonding curve token buy/sell logic
- ✅ Phantom wallet integration
- ✅ Anti-whale and anti-bot protection
- ✅ Secure backend with proper signer checks
- ✅ API routes for buying, selling, wallet balance, and token creation
- ✅ Styled UI with feedback on transactions


## 📁 Project Structure

```bash
/
├── README.md
├── build.sh
├── backend-api # Node.js backend with Anchor bindings
│   ├── package.json
│   ├── src
│   │   ├── index.ts
│   │   ├── routes
│   │   │   ├── price.ts
│   │   │   └── token.ts
│   │   └── utils
│   │       └── solana.ts
│   └── tsconfig.json
├── frontend # React frontend with wallet adapter
│   ├── index.html
│   ├── package.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── config.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   ├── tsconfig.json
│   └── vite.config.ts
└── solana-program # Solana smart contract written in Rust using Anchor
    ├── Anchor.toml
    ├── Cargo.toml
    ├── package.json
    ├── programs
    │   └── solana-program
    │       ├── Cargo.toml
    │       ├── src
    │       │   └── lib.rs
    ├── tests
    │   └── solana-program.ts
    └── tsconfig.json
```


## ⚙️ Setup Instructions

### Prerequisites

- Node.js ≥ 18
- Yarn or npm
- Anchor CLI: `cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked`
- Solana CLI: `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`
- Phantom Wallet Extension



## 🔨 Build Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/arpanadlakhiya/solana-rust-react-app.git
```

### 2. Build & Deploy Solana Program

```bash
cd solana-program
anchor build
anchor deploy --provider.cluster devnet
```

🔁 Update declare_id!() in lib.rs and programId in backend-api/utils/solana.ts with the generated program ID.

### 3. Start Backend

```bash
cd ../backend-api
npm install
npm run dev
```

Runs at: http://localhost:3000/api

### 4. Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Runs at: http://localhost:5173

## 🔌 API Endpoints

|Method |	Endpoint            | Description               |
|-------|-----------------------|---------------------------|
|POST   |	/api/create-token   | Create new token          |
|POST   |	/api/buy	        | Buy tokens                |
|POST   |	/api/sell	        | Sell tokens               |
|POST   |	/api/wallet-balance | Get wallet SOL balance    |


You can also visit Solscan to view the account details
Get your account address by 

```bash
solana address
```

https://solscan.io/account/YOUR_ACCOUNT_ADDRESS?cluster=devnet

## 📦 Future Improvements

- Real bonding curve (exponential or sigmoid)
- Token metadata via Metaplex
- GraphQL indexer for analytics
- Token leaderboard and activity feed

