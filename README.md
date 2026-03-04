# Safepay - a blockchain-Based Escrow Payment System for Secure E-Commerce Transactions in Rwanda


Rwanda's e-commerce space is growing rapidly, but trust between buyers and sellers remains a major barrier buyers fear paying for goods they may never receive, while sellers fear delivering without guaranteed payment. SafePay addresses this by replacing trust with code. Built on the Ethereum Sepolia testnet, SafePay locks buyer funds in a smart contract at checkout and only releases them to the seller once the buyer physically confirms delivery through a one-time password (OTP). Combined with MTN Mobile Money support, it bridges traditional and blockchain payments for the Rwandan market.
---

##  Demo Video
[Watch Demo](https://drive.google.com/file/d/1HQQV2yAn8CCIwzAlM1bpKJCzjH9-g3Z1/view?usp=sharing)

## Live App
 [https://finalcapstone-project-rsyf.vercel.app](https://finalcapstone-project-rsyf.vercel.app)

---

##  How to Run Locally

### 1. Clone & Install
```bash
git clone https://github.com/KelliaMuzira/safepay.git
cd safepay
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.local.example .env.local
```
Fill in `.env.local` with your values (see `.env.local.example` for all required keys).

### 3. Set Up the Database
Create a free PostgreSQL database at [neon.tech](https://neon.tech), paste the connection string into `DATABASE_URL`, then run the SQL schema in the Neon SQL editor.

### 4. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

##  Environment Variables

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | [neon.tech](https://neon.tech) |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `MOMO_*` keys | [momodeveloper.mtn.com](https://momodeveloper.mtn.com) |
| `EMAIL_*` | Gmail App Password |
| `CHAIN_RPC_URL` | [alchemy.com](https://alchemy.com) → Sepolia |
| `ESCROW_OWNER_PRIVATE_KEY` | Export from MetaMask |
| `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS` | `0x7361f5A6F8fE1b93e80D6B81774Da7a7f759Ab18` |

---

##  Key Features
- 🔐 ETH locked in smart contract until delivery confirmed
- 📱 MTN Mobile Money payments
- 🦊 MetaMask integration with live ETH balance
- 📧 OTP delivered by email, released on-chain
- ⚠️ Dispute system with admin resolution

##  Tech Stack
Next.js 14 · TypeScript · PostgreSQL (Neon) · Solidity · Ethers.js · MTN MoMo API · NextAuth.js · Vercel

---

##  Smart Contract
- **Network:** Ethereum Sepolia Testnet
- **Address:** [`0x7361f5A6F8fE1b93e80D6B81774Da7a7f759Ab18`](https://sepolia.etherscan.io/address/0x7361f5A6F8fE1b93e80D6B81774Da7a7f759Ab18)

---

##  Author
**Kellia MUZIRA** · [GitHub](https://github.com/KelliaMuzira) · k.muzira@alustudent.com
