# SafePay 🔐
### A Blockchain-Based Escrow Payment System for Secure E-Commerce Transactions in Rwanda

Rwanda's e-commerce space is growing rapidly, but trust between buyers and sellers remains a major barrier — buyers fear paying for goods they may never receive, while sellers fear delivering without guaranteed payment. SafePay addresses this by replacing trust with code.

Built on the Ethereum Sepolia testnet, SafePay locks buyer funds in a smart contract at checkout and only releases them to the seller once the buyer physically confirms delivery through a one-time password (OTP). Combined with MTN Mobile Money support, it bridges traditional and blockchain payments for the Rwandan market.

---

## 🔗 Links

- Demo Video — (https://drive.google.com/file/d/1HQQV2yAn8CCIwzAlM1bpKJCzjH9-g3Z1/view?usp=sharing)
- [Live App] (https://finalcapstone-project-rsyf.vercel.app)


---

## ✨ Key Features

- 🔐 ETH locked in smart contract at checkout — released only after buyer confirms delivery
- 📱 MTN Mobile Money payments supported
- 🦊 MetaMask integration with live ETH balance display
- 📧 OTP delivered by email for secure delivery confirmation
- ⚠️ Dispute system with admin resolution panel
- 👥 Three user roles — Buyer, Seller, Admin — each with their own dashboard

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, React |
| Backend | Next.js API Routes |
| Database | PostgreSQL via Neon |
| Authentication | NextAuth.js, bcrypt |
| Blockchain | Solidity, Ethers.js v6, Hardhat |
| Payments | MTN Mobile Money API |
| Email | Nodemailer via Gmail SMTP |
| Deployment | Vercel |

---

## 📋 Prerequisites

Before running the project locally, make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) browser extension
- A free [Neon](https://neon.tech) PostgreSQL database
- A free [Alchemy](https://alchemy.com) account for Sepolia RPC
- An [MTN MoMo Developer](https://momodeveloper.mtn.com) account
- A Gmail account with an App Password enabled

---

## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/KelliaMuzira/safepay.git
cd safepay
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in all the required values. See the [Environment Variables](#-environment-variables) section below for a full explanation of each variable.

### 4. Set Up the Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project and copy your connection string
3. Paste it as your `DATABASE_URL` in `.env.local`

```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```env
# Database
DATABASE_URL=your_neon_connection_string

# NextAuth
NEXTAUTH_SECRET=run_openssl_rand_base64_32_to_generate
NEXTAUTH_URL=http://localhost:3000

# MTN Mobile Money
MOMO_SUBSCRIPTION_KEY=your_mtn_subscription_key
MOMO_API_USER=your_mtn_api_user
MOMO_API_KEY=your_mtn_api_key
MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com
MOMO_TARGET_ENVIRONMENT=sandbox

# Email (Gmail SMTP)
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

# Blockchain
CHAIN_RPC_URL=your_alchemy_sepolia_rpc_url
ESCROW_OWNER_PRIVATE_KEY=your_metamask_private_key
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x7361f5A6F8fE1b93e80D6B81774Da7a7f759Ab18
```

### Where to Get Each Variable

| Variable | How to Get It |
|---|---|
| `DATABASE_URL` | Create a project at [neon.tech](https://neon.tech) and copy the connection string |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` in your terminal |
| `MOMO_*` | Register at [momodeveloper.mtn.com](https://momodeveloper.mtn.com) and create a Collections product |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Generate a Gmail App Password at myaccount.google.com → Security → App Passwords |
| `CHAIN_RPC_URL` | Create an app at [alchemy.com](https://alchemy.com), select Ethereum Sepolia, and copy the HTTPS URL |
| `ESCROW_OWNER_PRIVATE_KEY` | Open MetaMask → Account Details → Export Private Key |
| `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS` | Already set — this is the deployed SafePayEscrow contract address on Sepolia |

---

## ⛓ Smart Contract

The SafePayEscrow smart contract is written in Solidity and deployed on the Ethereum Sepolia testnet.

- **Network:** Ethereum Sepolia Testnet
- **Contract Address:** `0x7361f5A6F8fE1b93e80D6B81774Da7a7f759Ab18`
- **View on Etherscan:** [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x7361f5A6F8fE1b93e80D6B81774Da7a7f759Ab18)

### Core Functions

| Function | Description |
|---|---|
| `createEscrow()` | Locks buyer ETH in the contract at the time of purchase |
| `releasePayment()` | Releases locked ETH to the seller after buyer confirms delivery via OTP |
| `refundBuyer()` | Returns locked ETH to the buyer when admin resolves a dispute in their favour |

To redeploy the contract locally using Hardhat:

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 👤 User Roles

| Role | What They Can Do |
|---|---|
| Buyer | Browse products, add to cart, pay via MoMo or ETH, confirm delivery via OTP, open disputes |
| Seller | List products, view orders, mark orders as delivered, configure wallet address |
| Admin | View and resolve all disputes, manage platform users |

To create an admin account, register normally and then update the user role directly in your Neon database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

---

## 🧪 Running Tests

```bash
npx hardhat test
```

This runs the smart contract unit tests. Frontend and API testing was done manually during development as documented in Chapter Four of the project report.

---

## 📁 Project Structure

```
safepay/
├── contracts/
│   └── SafePayEscrow.sol        # Escrow smart contract
├── scripts/
│   └── deploy.js                # Hardhat deployment script
├── src/
│   ├── app/
│   │   ├── api/                 # Next.js API routes
│   │   │   ├── auth/            # NextAuth config
│   │   │   ├── orders/          # Order management
│   │   │   ├── payments/        # Payment processing
│   │   │   ├── otp/             # OTP generation and verification
│   │   │   ├── disputes/        # Dispute handling
│   │   │   └── crypto/          # Crypto payment signing
│   │   ├── buyer/               # Buyer dashboard pages
│   │   ├── seller/              # Seller dashboard pages
│   │   └── admin/               # Admin dashboard pages
│   └── lib/
│       ├── db.ts                # PostgreSQL connection
│       ├── otp.ts               # OTP utilities
│       └── momo.ts              # MTN MoMo integration
├── .env.local.example           # Environment variable template
└── README.md
```

---

## 👩🏾‍💻 Author

**Kellia MUZIRA**
BSc. Software Engineering — African Leadership University, Kigali, Rwanda
📧 [k.muzira@alustudent.com](mailto:k.muzira@alustudent.com)
🐙 [GitHub](https://github.com/KelliaMuzira)

---

## 📄 License

This project was developed as a final year capstone project at African Leadership University. All rights reserved.
