"use client";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { Order, Product } from "@/types";

// ── Import the deployed contract ABI ─────────────────────────────────────────
import { CREATE_ESCROW_ABI } from "../../lib/SafePayEscrow.abi";

const CATEGORIES = ['All', 'Shoes', 'Bags', 'Electronics', 'Fashion', 'Accessories', 'Beauty'];

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  pending:   { bg: 'rgba(245,158,11,0.1)',  text: '#F59E0B', dot: '#F59E0B' },
  paid:      { bg: 'rgba(59,130,246,0.1)',   text: '#3B82F6', dot: '#3B82F6' },
  in_escrow: { bg: 'rgba(139,92,246,0.1)',   text: '#8B5CF6', dot: '#8B5CF6' },
  delivered: { bg: 'rgba(6,182,212,0.1)',    text: '#06B6D4', dot: '#06B6D4' },
  completed: { bg: 'rgba(16,185,129,0.1)',   text: '#10B981', dot: '#10B981' },
  disputed:  { bg: 'rgba(239,68,68,0.1)',    text: '#EF4444', dot: '#EF4444' },
  refunded:  { bg: 'rgba(249,115,22,0.1)',   text: '#F97316', dot: '#F97316' },
};

type CartItem = Product & { qty: number };
type OrderWithSeller = Order & { seller_name?: string; tx_hash?: string };
type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
};

// ── Contract config (set in .env.local) ──────────────────────────────────────
const CONTRACT_ADDRESS  = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS as string;
const SEPOLIA_CHAIN_ID  = 11155111;
const RWF_PER_ETH       = Number(process.env.NEXT_PUBLIC_SEPOLIA_RWF_PER_ETH  || "4000000");
const MIN_ESCROW_ETH    = Number(process.env.NEXT_PUBLIC_SEPOLIA_MIN_ESCROW_ETH || "0.00001");
const EXPLORER_URL      = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "https://sepolia.etherscan.io";

// ─────────────────────────────────────────────────────────────────────────────

function BuyerDashboardContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<'shop' | 'orders'>(
    searchParams.get('tab') === 'orders' ? 'orders' : 'shop'
  );

  const [products, setProducts]   = useState<Product[]>([]);
  const [category, setCategory]   = useState('All');
  const [search, setSearch]       = useState('');
  const [fetching, setFetching]   = useState(true);
  const [orders, setOrders]       = useState<OrderWithSeller[]>([]);

  // ── cart ─────────────────────────────────────────────
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [payMethod, setPayMethod] = useState<'mobile_money' | 'crypto'>('mobile_money');
  const [checkingOut, setCheckingOut]   = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [lastReceipts, setLastReceipts] = useState<Array<{
    item_name: string; amount: number; gateway_ref: string; tx_hash: string; method: string;
  }>>([]);

  // MoMo
  const [momoPhone, setMomoPhone] = useState('');
  const [momoRef, setMomoRef]     = useState<string | null>(null);
  const [momoStatus, setMomoStatus] = useState('');
  const [momoPaying, setMomoPaying] = useState(false);

  // MetaMask
  const [hasMetaMask, setHasMetaMask]       = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [connectingMM, setConnectingMM]       = useState(false);
  const [cryptoStep, setCryptoStep]         = useState<'idle' | 'signing' | 'waiting' | 'done'>('idle');
  const [cryptoProgress, setCryptoProgress] = useState('');

  // ── otp ──────────────────────────────────────────────
  const [otpOrder, setOtpOrder]         = useState<OrderWithSeller | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput]         = useState('');
  const [otpLoading, setOtpLoading]     = useState(false);

  // ── dispute ──────────────────────────────────────────
  const [disputeOrder, setDisputeOrder]   = useState<OrderWithSeller | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeLoading, setDisputeLoading] = useState(false);

  // ── fetchers ─────────────────────────────────────────
  async function fetchProducts(cat = 'All') {
    setFetching(true);
    const url  = cat === 'All' ? '/api/products' : `/api/products?category=${encodeURIComponent(cat)}`;
    const res  = await fetch(url);
    const data = await res.json();
    setProducts(data.products || []);
    setFetching(false);
  }

  async function fetchOrders() {
    const res  = await fetch('/api/orders?role=buyer');
    const data = await res.json();
    setOrders(data.orders || []);
  }

  async function connectMetaMask() {
    const ethereum = (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
    if (!ethereum) return;
    setConnectingMM(true);
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts[0]) {
        setConnectedWallet(accounts[0]);
        toaster.create({
          title: `🦊 Connected: ${accounts[0].slice(0,8)}…${accounts[0].slice(-6)}`,
          type: 'success',
          duration: 3000,
        });
      }
    } catch {
      // user rejected: keep silent
    } finally {
      setConnectingMM(false);
    }
  }

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);
  useEffect(() => {
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const eth = (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
    setHasMetaMask(Boolean(eth));
    if (eth) {
      eth.request({ method: 'eth_accounts' })
        .then((accounts) => {
          const accs = accounts as string[];
          if (accs.length > 0) setConnectedWallet(accs[0]);
        })
        .catch(() => {});
    }
  }, []);

  // ── cart helpers ─────────────────────────────────────
  function addToCart(product: Product) {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    toaster.create({ title: `🛒 ${product.name} added to cart`, type: 'success', duration: 2000 });
    setCartOpen(true);
  }

  function removeFromCart(id: string) { setCart(prev => prev.filter(i => i.id !== id)); }
  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }

  const cartTotal = cart.reduce((sum, i) => sum + Number(i.price) * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const inCartIds = new Set(cart.map(i => i.id));

  // ── CHECKOUT ─────────────────────────────────────────
  async function handleCheckout() {
    if (cart.length === 0) return;

    // ── MoMo path ────────────────────────────────────
    if (payMethod === "mobile_money") {
      if (!momoPhone.trim()) {
        toaster.create({ title: "Enter MoMo phone number", type: "warning", duration: 3000 });
        return;
      }

      setMomoPaying(true);
      setMomoStatus("Sending MoMo prompt…");
      setMomoRef(null);

      const payRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: String(cartTotal),
          phoneNumber: momoPhone.trim(),
          orderId: `cart-${Date.now()}`,
        }),
      });

      const payData = await payRes.json();
      if (!payRes.ok) {
        setMomoPaying(false);
        setMomoStatus("");
        toaster.create({ title: payData.error || "MoMo payment failed", type: "error", duration: 4000 });
        return;
      }

      const referenceId = payData.referenceId as string;
      setMomoRef(referenceId);
      setMomoStatus("Prompt sent. Approve on phone…");

      // Poll up to 60s
      const start = Date.now();
      let paidOk = false;
      while (Date.now() - start < 60000) {
        const stRes  = await fetch(`/api/payments/${referenceId}`);
        const stData = await stRes.json();
        const s = stData?.status;
        if (s) setMomoStatus(`Status: ${s}`);
        if (s === "SUCCESSFUL") { paidOk = true; break; }
        if (s === "FAILED")      break;
        await new Promise(r => setTimeout(r, 3000));
      }

      if (!paidOk) {
        setMomoPaying(false);
        toaster.create({ title: "MoMo not approved / failed", type: "error", duration: 4000 });
        return;
      }

      setMomoPaying(false);
      setMomoStatus("✅ Payment successful!");

      // Create orders in DB for MoMo
      setCheckingOut(true);
      const receipts: typeof lastReceipts = [];
      let allOk = true;

      for (const item of cart) {
        for (let q = 0; q < item.qty; q++) {
          const res  = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              seller_id:      item.seller_id,
              item_name:      item.name,
              amount:         item.price,
              payment_method: "mobile_money",
              momo_reference: referenceId,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            receipts.push({ item_name: item.name, amount: Number(item.price), ...data.payment, method: "mobile_money" });
          } else {
            toaster.create({ title: `❌ ${item.name}: ${data.error || "failed"}`, type: "error", duration: 4000 });
            allOk = false;
          }
        }
      }

      setCheckingOut(false);
      if (receipts.length > 0) {
        setLastReceipts(receipts);
        setCheckoutDone(true);
        setCart([]); setCartOpen(false);
        setMomoPhone(""); setMomoRef(null); setMomoStatus("");
        await fetchOrders();
        if (allOk) toaster.create({ title: `✅ ${receipts.length} order(s) placed!`, type: "success", duration: 5000 });
      }
      return;
    }

    // ── Crypto / MetaMask path ────────────────────────
    if (payMethod === "crypto") {
      const ethereum = (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
      if (!ethereum) {
        toaster.create({ title: "MetaMask not detected. Install MetaMask first.", type: "error", duration: 4000 });
        return;
      }

      if (!CONTRACT_ADDRESS) {
        toaster.create({ title: "Contract address not configured (NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS)", type: "error", duration: 5000 });
        return;
      }

      try {
        setCheckingOut(true);
        setCryptoStep('signing');
        setCryptoProgress("Connecting to MetaMask…");

        // 1. Import ethers dynamically (keeps bundle lean for non-crypto users)
        const { ethers } = await import("ethers");
        const provider = new ethers.BrowserProvider(ethereum);
        await provider.send("eth_requestAccounts", []);

        // 2. Ensure correct network (Sepolia)
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
          setCryptoProgress("Switching to Sepolia network…");
          await provider.send("wallet_switchEthereumChain", [
            { chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` },
          ]);
        }

        const signer = await provider.getSigner();
        const buyerAddress = await signer.getAddress();
        setConnectedWallet(buyerAddress);

        // 3. Build the contract interface using the deployed ABI
        //    CREATE_ESCROW_ABI is imported from lib/SafePayEscrow.abi.ts
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CREATE_ESCROW_ABI,
          signer
        );

        const cryptoPaidUnits: Array<{ order_id: string; item: CartItem; tx_hash: string }> = [];
        let unitIndex = 0;
        const totalUnits = cart.reduce((s, i) => s + i.qty, 0);

        // 4. Process each cart item × qty
        for (const item of cart) {
          if (!item.seller_wallet_address) {
            throw new Error(`"${item.name}": seller has no wallet configured. Contact support.`);
          }

          for (let q = 0; q < item.qty; q++) {
            unitIndex++;
            const amountEth = Math.max(Number(item.price) / RWF_PER_ETH, MIN_ESCROW_ETH);
            const amountWei = ethers.parseEther(amountEth.toFixed(8));

            // Unique orderId per unit
            const orderId = `ord-${Date.now()}-${item.id.slice(0, 6)}-${q}-${Math.random().toString(16).slice(2, 8)}`;

            // 5. Get backend signature for this (orderId, seller, amountWei)
            setCryptoProgress(`Signing escrow ${unitIndex}/${totalUnits}: ${item.name}…`);
            const sigRes = await fetch("/api/payments/crypto-sign", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                seller:    item.seller_wallet_address,
                amountWei: amountWei.toString(),
                buyer:     buyerAddress,
              }),
            });
            const sigData = await sigRes.json();
            if (!sigRes.ok) throw new Error(sigData.error || `Signing failed for ${item.name}`);

            // 6. Send transaction to the SafePayEscrow contract via MetaMask
            setCryptoStep('waiting');
            setCryptoProgress(`Waiting for MetaMask approval (${unitIndex}/${totalUnits})…`);

            const tx = await contract.createEscrow(
              orderId,
              item.seller_wallet_address,
              sigData.signature,
              { value: amountWei }
            );

            setCryptoProgress(`Mining tx ${unitIndex}/${totalUnits}…`);
            const receipt = await tx.wait();
            const txHash  = receipt?.hash ?? tx.hash;

            cryptoPaidUnits.push({ order_id: orderId, item, tx_hash: txHash });
            toaster.create({
              title:       `⛓ ${item.name} locked in escrow`,
              description: `tx: ${(txHash as string).slice(0, 20)}…`,
              type:        "success",
              duration:    4000,
            });
          }
        }

        // 7. Record each paid unit in the DB
        setCryptoStep('done');
        setCryptoProgress("Recording orders…");
        const receipts: typeof lastReceipts = [];
        let allOk = true;

        for (const unit of cryptoPaidUnits) {
          const res  = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id:        unit.order_id,
              seller_id:       unit.item.seller_id,
              item_name:       unit.item.name,
              amount:          unit.item.price,
              payment_method:  "crypto",
              crypto_tx_hash:  unit.tx_hash,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            receipts.push({
              item_name:   unit.item.name,
              amount:      Number(unit.item.price),
              gateway_ref: unit.order_id,
              tx_hash:     unit.tx_hash,
              method:      "crypto",
              ...data.payment,
            });
          } else {
            toaster.create({ title: `❌ ${unit.item.name}: ${data.error || "failed"}`, type: "error", duration: 4000 });
            allOk = false;
          }
        }

        setCheckingOut(false);
        setCryptoStep('idle');
        setCryptoProgress('');

        if (receipts.length > 0) {
          setLastReceipts(receipts);
          setCheckoutDone(true);
          setCart([]); setCartOpen(false);
          await fetchOrders();
          if (allOk) toaster.create({ title: `✅ ${receipts.length} order(s) placed on-chain!`, type: "success", duration: 5000 });
        }

      } catch (err: unknown) {
        setCheckingOut(false);
        setCryptoStep('idle');
        setCryptoProgress('');
        const msg = err instanceof Error ? err.message : "MetaMask payment failed";
        // User rejected = silent, anything else = toast
        if (!msg.includes("user rejected") && !msg.includes("User denied")) {
          toaster.create({ title: msg, type: "error", duration: 6000 });
        }
      }
    }
  }

  // ── OTP ──────────────────────────────────────────────
  async function handleGenerateOtp() {
    if (!otpOrder) return;
    setOtpLoading(true);
    const res  = await fetch('/api/otp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: otpOrder.id, action: 'generate' }),
    });
    const data = await res.json();
    setOtpLoading(false);
    if (res.ok) {
      setGeneratedOtp(data.otp);
      toaster.create({
        title: data.email_sent
          ? `📧 OTP sent to ${data.email_to || session?.user?.email}`
          : `⚠️ Email failed — use code on screen`,
        type: data.email_sent ? 'info' : 'warning', duration: 4000,
      });
    } else {
      toaster.create({ title: data.error || 'Failed to generate OTP', type: 'error', duration: 3000 });
    }
  }

  async function handleVerifyOtp() {
    if (!otpOrder || !otpInput) return;
    setOtpLoading(true);
    const res  = await fetch('/api/otp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: otpOrder.id, action: 'verify', otp_token: otpInput }),
    });
    const data = await res.json();
    setOtpLoading(false);
    if (res.ok) {
      toaster.create({ title: '✅ Delivery confirmed! Payment released to seller.', type: 'success', duration: 5000 });
      setOtpOrder(null); setGeneratedOtp(null); setOtpInput(''); fetchOrders();
    } else {
      toaster.create({ title: data.error || 'Invalid OTP', type: 'error', duration: 3000 });
    }
  }

  // ── Dispute ──────────────────────────────────────────
  async function handleOpenDispute() {
    if (!disputeOrder || !disputeReason.trim()) return;
    setDisputeLoading(true);
    const res = await fetch('/api/disputes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: disputeOrder.id, reason: disputeReason }),
    });
    setDisputeLoading(false);
    if (res.ok) {
      toaster.create({ title: '⚠️ Dispute opened. Admin will review shortly.', type: 'warning', duration: 5000 });
      setDisputeOrder(null); setDisputeReason(''); fetchOrders();
    } else {
      toaster.create({ title: 'Failed to open dispute', type: 'error', duration: 3000 });
    }
  }

  // ── Stats ─────────────────────────────────────────────
  const completed = orders.filter(o => o.status === 'completed').length;
  const inEscrow  = orders.filter(o => ['in_escrow','paid','pending'].includes(o.status)).length;
  const disputed  = orders.filter(o => o.status === 'disputed').length;
  const delivered = orders.filter(o => o.status === 'delivered').length;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const methodLabel: Record<string, string> = {
    mobile_money: '📱 MTN Mobile Money',
    crypto:       '⛓️ Crypto (Sepolia ETH)',
  };

  function goBack() {
    setOtpOrder(null); setGeneratedOtp(null); setOtpInput('');
    setDisputeOrder(null); setDisputeReason('');
    setCheckoutDone(false); setLastReceipts([]);
  }

  // ── MetaMask step label ───────────────────────────────
  function cryptoButtonLabel() {
    if (cryptoStep === 'signing')  return `✍️ Getting backend signature…`;
    if (cryptoStep === 'waiting')  return `🦊 Approve in MetaMask…`;
    if (cryptoStep === 'done')     return `⏳ Recording orders…`;
    return `🔐 Checkout · ${cartTotal.toLocaleString()} RWF`;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy:   #04080F; --deep:  #060B17; --panel: #0D1526;
          --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
          --accent: #3B82F6; --accent2: #2563EB;
          --text:   #E8EDF5; --muted: #7B8BAD;
          --green:  #10B981; --gold: #F59E0B; --red: #EF4444;
          --purple: #8B5CF6;
        }
        body { background: var(--deep); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .dash-wrap { display: flex; min-height: 100vh; }

        /* SIDEBAR */
        .sidebar { width: 240px; flex-shrink: 0; background: var(--navy); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
        .sidebar-logo { padding: 28px 24px 20px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; border-bottom: 1px solid var(--border); }
        .sidebar-logo span { color: var(--accent); }
        .sidebar-user { padding: 16px 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); }
        .avatar { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #10B981, #059669); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .user-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 11px; color: var(--muted); }
        .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; cursor: pointer; font-size: 14px; color: var(--muted); transition: all .15s; border: 1px solid transparent; user-select: none; }
        .nav-item:hover { color: var(--text); background: rgba(255,255,255,0.04); }
        .nav-item.active { color: var(--text); background: rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.2); }
        .nav-badge { background: rgba(59,130,246,0.2); color: var(--accent); font-size: 11px; font-weight: 600; padding: 1px 7px; border-radius: 100px; }
        .nav-badge-green { background: rgba(16,185,129,0.2); color: var(--green); font-size: 11px; font-weight: 600; padding: 1px 7px; border-radius: 100px; }
        .sidebar-foot { padding: 16px 12px; border-top: 1px solid var(--border); }
        .sign-out { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; cursor: pointer; font-size: 13px; color: var(--muted); transition: all .15s; background: none; border: none; width: 100%; font-family: 'DM Sans', sans-serif; }
        .sign-out:hover { color: var(--red); background: rgba(239,68,68,0.07); }

        /* MAIN */
        .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .topbar { padding: 20px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--navy); position: sticky; top: 0; z-index: 10; gap: 16px; }
        .topbar-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.3px; }
        .topbar-sub { font-size: 13px; color: var(--muted); margin-top: 2px; }
        .topbar-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .content { padding: 28px 32px; flex: 1; }

        /* SEARCH */
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--muted); pointer-events: none; }
        .search-input { width: 240px; background: var(--panel); border: 1px solid var(--border); border-radius: 9px; padding: 9px 14px 9px 36px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; transition: border-color .2s; }
        .search-input::placeholder { color: var(--muted); }
        .search-input:focus { border-color: var(--accent); }

        /* CART BUTTON */
        .cart-btn { position: relative; display: flex; align-items: center; gap: 8px; padding: 9px 16px; background: var(--panel); border: 1px solid var(--border); border-radius: 9px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all .15s; white-space: nowrap; }
        .cart-btn:hover { border-color: var(--accent); }
        .cart-btn.has-items { border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.08); }
        .cart-count { background: var(--green); color: #fff; font-size: 11px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

        /* CART DRAWER */
        .cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 200; }
        .cart-drawer { position: fixed; right: 0; top: 0; bottom: 0; width: 420px; background: var(--navy); border-left: 1px solid var(--border2); z-index: 201; display: flex; flex-direction: column; animation: slideIn .2s ease; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .cart-head { padding: 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .cart-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; }
        .cart-close { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
        .cart-close:hover { border-color: var(--border2); color: var(--text); }
        .cart-items { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .cart-item { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 12px; display: flex; gap: 12px; align-items: center; }
        .cart-item-img { width: 56px; height: 56px; border-radius: 8px; overflow: hidden; position: relative; flex-shrink: 0; background: var(--deep); }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
        .cart-item-price { font-size: 13px; color: var(--accent); font-weight: 600; }
        .cart-item-actions { display: flex; align-items: center; }
        .qty-btn { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--border); background: var(--deep); color: var(--text); font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
        .qty-btn:hover { border-color: var(--accent); color: var(--accent); }
        .qty-val { width: 32px; text-align: center; font-size: 13px; font-weight: 600; }
        .cart-remove { width: 26px; height: 26px; border-radius: 6px; border: 1px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.08); color: var(--red); font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-left: 8px; transition: all .15s; }
        .cart-remove:hover { background: rgba(239,68,68,0.18); }
        .cart-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--muted); }

        .cart-foot { padding: 16px; border-top: 1px solid var(--border); }
        .cart-total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .cart-total-label { font-size: 13px; color: var(--muted); }
        .cart-total-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px; color: var(--accent); }

        /* Payment method tabs */
        .pay-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
        .pay-tab { padding: 10px 8px; border-radius: 9px; border: 1px solid var(--border); background: var(--panel); color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all .15s; text-align: center; }
        .pay-tab:hover { border-color: var(--border2); color: var(--text); }
        .pay-tab.active-momo { border-color: rgba(245,158,11,0.4); background: rgba(245,158,11,0.08); color: #F59E0B; }
        .pay-tab.active-crypto { border-color: rgba(139,92,246,0.4); background: rgba(139,92,246,0.08); color: var(--purple); }

        /* Crypto progress bar */
        .crypto-progress { background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.2); border-radius: 9px; padding: 10px 14px; font-size: 12px; color: #c4b5fd; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .crypto-spinner { width: 14px; height: 14px; border: 2px solid rgba(139,92,246,0.3); border-top-color: var(--purple); border-radius: 50%; animation: spin .8s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* CATEGORIES */
        .cat-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .cat-pill { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 500; border: 1px solid var(--border); background: var(--panel); color: var(--muted); cursor: pointer; transition: all .15s; white-space: nowrap; }
        .cat-pill:hover { border-color: var(--border2); color: var(--text); }
        .cat-pill.active { background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.4); color: var(--accent); }

        /* STAT CARDS */
        .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 28px; }
        .stat-card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 20px; position: relative; overflow: hidden; }
        .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .stat-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 26px; letter-spacing: -0.5px; }
        .stat-icon  { position: absolute; right: 16px; top: 16px; font-size: 20px; opacity: 0.35; }

        /* PRODUCTS */
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .product-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: border-color .2s, transform .2s; }
        .product-card:hover { border-color: var(--border2); transform: translateY(-2px); }
        .product-img { position: relative; height: 175px; background: var(--deep); }
        .product-cat { position: absolute; top: 10px; right: 10px; background: rgba(59,130,246,0.85); backdrop-filter: blur(4px); color: #fff; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.5px; }
        .in-cart-badge { position: absolute; top: 10px; left: 10px; background: rgba(16,185,129,0.85); backdrop-filter: blur(4px); color: #fff; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 100px; }
        .product-body { padding: 14px; }
        .product-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-desc { font-size: 12px; color: var(--muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }
        .product-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
        .product-price { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: var(--accent); }
        .product-seller { font-size: 11px; color: var(--muted); }
        .add-btn { width: 100%; margin-top: 12px; padding: 10px; border-radius: 9px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.25); color: var(--accent); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; }
        .add-btn:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
        .add-btn.in-cart { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); color: var(--green); }
        .add-btn.in-cart:hover { background: var(--green); color: #fff; border-color: var(--green); }

        /* BUTTONS */
        .btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; border: none; white-space: nowrap; }
        .btn-blue  { background: var(--accent); color: #fff; box-shadow: 0 0 20px rgba(59,130,246,0.25); }
        .btn-blue:hover  { background: var(--accent2); transform: translateY(-1px); }
        .btn-green { background: var(--green); color: #fff; }
        .btn-green:hover { background: #059669; }
        .btn-red-outline { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.25); }
        .btn-red-outline:hover { background: rgba(239,68,68,0.18); }
        .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border2); }
        .btn-ghost:hover { color: var(--text); border-color: var(--accent); }
        .btn-lg { padding: 13px 24px; font-size: 15px; border-radius: 10px; width: 100%; justify-content: center; }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }
        .back-btn { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; padding: 6px 0; margin-bottom: 20px; transition: color .15s; }
        .back-btn:hover { color: var(--text); }

        /* RECEIPT */
        .receipt-wrap { max-width: 600px; margin: 0 auto; }
        .receipt-header { background: linear-gradient(135deg, #065f46, #047857); border-radius: 14px 14px 0 0; padding: 28px 24px; text-align: center; }
        .receipt-icon { font-size: 36px; margin-bottom: 8px; }
        .receipt-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; color: #fff; margin-bottom: 4px; }
        .receipt-sub { font-size: 13px; color: rgba(255,255,255,0.65); }
        .receipt-body { background: var(--panel); border: 1px solid var(--border); border-top: none; border-radius: 0 0 14px 14px; padding: 24px; }
        .receipt-item { background: var(--deep); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
        .receipt-item-name { font-weight: 600; font-size: 14px; margin-bottom: 8px; }
        .receipt-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid var(--border); }
        .receipt-row:last-child { border-bottom: none; }
        .receipt-row-label { font-size: 12px; color: var(--muted); }
        .receipt-row-value { font-size: 12px; font-weight: 500; }
        .tx-box { background: var(--deep); border-radius: 8px; padding: 8px 12px; margin-top: 6px; }
        .tx-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
        .tx-value { font-size: 11px; font-family: monospace; color: var(--accent); word-break: break-all; }
        .notice { padding: 10px 14px; border-radius: 9px; font-size: 12px; display: flex; align-items: center; gap: 8px; }

        /* ORDERS */
        .order-list { display: flex; flex-direction: column; gap: 10px; }
        .order-card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; transition: border-color .2s; }
        .order-card:hover { border-color: var(--border2); }
        .order-card.highlight { border-color: rgba(6,182,212,0.3); }
        .order-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .order-name { font-weight: 600; font-size: 15px; }
        .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-dot { width: 5px; height: 5px; border-radius: 50%; }
        .order-meta { display: flex; gap: 24px; flex-wrap: wrap; }
        .meta-label { font-size: 11px; color: var(--muted); margin-bottom: 2px; }
        .meta-value { font-size: 13px; font-weight: 500; }
        .divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }

        /* OTP */
        .otp-wrap { max-width: 500px; margin: 0 auto; }
        .modal-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 28px; }
        .modal-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 4px; }
        .modal-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
        .order-pill { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); border-radius: 10px; padding: 14px; margin-bottom: 20px; }
        .order-pill-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
        .order-pill-amount { font-size: 13px; color: var(--muted); }
        .step-box { background: var(--deep); border: 1px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 14px; }
        .step-box.active { border-color: rgba(59,130,246,0.3); }
        .step-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .step-num { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--accent); }
        .step-num.dim { background: rgba(255,255,255,0.04); border-color: var(--border); color: var(--muted); }
        .step-title { font-size: 13px; font-weight: 600; }
        .otp-display { background: rgba(16,185,129,0.08); border: 2px solid rgba(16,185,129,0.3); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 12px; }
        .otp-label { font-size: 11px; color: var(--green); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .otp-code  { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 42px; letter-spacing: 8px; color: var(--green); }
        .otp-exp   { font-size: 12px; color: var(--muted); margin-top: 6px; }
        .otp-email { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); border-radius: 8px; padding: 8px 12px; font-size: 12px; color: #93c5fd; margin-top: 8px; }
        .otp-input { width: 100%; background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px; color: var(--text); font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 12px; text-align: center; outline: none; transition: border-color .2s; margin-bottom: 12px; }
        .otp-input:focus { border-color: var(--accent); }
        .otp-input::placeholder { color: var(--border2); letter-spacing: 4px; font-size: 24px; }
        .otp-input:disabled { opacity: 0.4; }
        .warning-box { background: rgba(245,158,11,0.07); border: 1px solid rgba(245,158,11,0.2); border-radius: 9px; padding: 10px 14px; font-size: 12px; color: #fcd34d; margin-top: 14px; }

        /* DISPUTE */
        .dispute-order-box { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 14px; margin-bottom: 20px; }
        .dispute-order-name   { font-weight: 600; font-size: 15px; color: #fca5a5; margin-bottom: 4px; }
        .dispute-order-amount { font-size: 13px; color: var(--muted); }
        .dispute-textarea { width: 100%; background: var(--deep); border: 1px solid var(--border); border-radius: 9px; padding: 12px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color .2s; resize: vertical; min-height: 120px; margin-bottom: 16px; }
        .dispute-textarea:focus { border-color: var(--red); }
        .dispute-textarea::placeholder { color: var(--muted); }

        /* EMPTY */
        .empty { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 60px 20px; text-align: center; }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 16px; margin-bottom: 6px; }
        .empty-sub { font-size: 13px; color: var(--muted); margin-bottom: 20px; }
        .delivered-alert { background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.25); border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #67e8f9; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .stat-grid { grid-template-columns: repeat(2,1fr); }
          .content { padding: 20px 16px; }
          .topbar { padding: 16px 20px; }
          .cart-drawer { width: 100%; }
          .search-input { width: 160px; }
        }
      `}</style>

      <div className="dash-wrap">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">Safe<span>Pay</span></div>
          <div className="sidebar-user">
            <div className="avatar">{session?.user?.name?.charAt(0).toUpperCase() || 'B'}</div>
            <div>
              <div className="user-name">{session?.user?.name}</div>
              <div className="user-role">Buyer</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            {[
              { key: 'shop'   as const, icon: '🛍️', label: 'Shop',      badge: 0             },
              { key: 'orders' as const, icon: '📦', label: 'My Orders', badge: orders.length },
            ].map(t => (
              <div key={t.key}
                className={`nav-item ${tab === t.key && !otpOrder && !disputeOrder && !checkoutDone ? 'active' : ''}`}
                onClick={() => { setTab(t.key); goBack(); }}>
                <span>{t.icon}</span>
                <span style={{ flex: 1 }}>{t.label}</span>
                {t.badge > 0 && <span className="nav-badge">{t.badge}</span>}
              </div>
            ))}
            {cartCount > 0 && (
              <div className="nav-item" onClick={() => setCartOpen(true)} style={{ marginTop: 8, borderColor: 'rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.06)', color: 'var(--green)' }}>
                <span>🛒</span>
                <span style={{ flex: 1 }}>Cart</span>
                <span className="nav-badge-green">{cartCount}</span>
              </div>
            )}
          </nav>
          {hasMetaMask && (
            connectedWallet ? (
              <div style={{ margin: '0 12px 8px', padding: '8px 12px', borderRadius: 9, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, color: 'rgba(110,231,183,0.6)', marginBottom: 1 }}>MetaMask</div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#6ee7b7' }}>
                    {connectedWallet.slice(0,8)}…{connectedWallet.slice(-6)}
                  </div>
                </div>
              </div>
            ) : (
              <div onClick={connectMetaMask} style={{ margin: '0 12px 8px', padding: '8px 12px', borderRadius: 9, background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'rgba(253,186,116,0.6)', marginBottom: 1 }}>MetaMask</div>
                  <div style={{ fontSize: 11, color: '#fdba74' }}>{connectingMM ? 'Connecting…' : 'Click to connect'}</div>
                </div>
                <span style={{ fontSize: 14 }}>🦊</span>
              </div>
            )
          )}
          <div className="sidebar-foot">
            <button className="sign-out" onClick={() => signOut({ callbackUrl: '/' })}>
              <span>🚪</span> Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div>
              <div className="topbar-title">
                {checkoutDone && '✅ Orders Placed'}
                {otpOrder && '🔑 Confirm Delivery'}
                {disputeOrder && '⚠️ Open Dispute'}
                {!checkoutDone && !otpOrder && !disputeOrder && tab === 'shop' && '🛍️ Shop'}
                {!checkoutDone && !otpOrder && !disputeOrder && tab === 'orders' && '📦 My Orders'}
              </div>
              <div className="topbar-sub">
                {tab === 'shop' && !checkoutDone && 'All payments secured by smart contract escrow'}
                {tab === 'orders' && !otpOrder && !disputeOrder && `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
              </div>
            </div>
            <div className="topbar-right">
              {tab === 'shop' && !checkoutDone && !otpOrder && !disputeOrder && (
                <div className="search-wrap">
                  <span className="search-icon">🔍</span>
                  <input className="search-input" value={search} placeholder="Search..." onChange={e => setSearch(e.target.value)} />
                </div>
              )}
              <button className={`cart-btn ${cartCount > 0 ? 'has-items' : ''}`} onClick={() => setCartOpen(true)}>
                🛒 Cart
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
            </div>
          </div>

          <div className="content">

            {/* SHOP */}
            {tab === 'shop' && !checkoutDone && !otpOrder && !disputeOrder && (
              <>
                <div className="cat-row">
                  {CATEGORIES.map(cat => (
                    <button key={cat} className={`cat-pill ${category === cat ? 'active' : ''}`}
                      onClick={() => { setCategory(cat); fetchProducts(cat); }}>
                      {cat}
                    </button>
                  ))}
                </div>
                {fetching ? (
                  <div className="empty"><div className="empty-icon">⏳</div><div className="empty-title">Loading products...</div></div>
                ) : filtered.length === 0 ? (
                  <div className="empty"><div className="empty-icon">🔍</div><div className="empty-title">No products found</div><div className="empty-sub">Try a different search or category</div></div>
                ) : (
                  <div className="product-grid">
                    {filtered.map(product => (
                      <div className="product-card" key={product.id}>
                        <div className="product-img">
                          <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                          <span className="product-cat">{product.category}</span>
                          {inCartIds.has(product.id) && <span className="in-cart-badge">✓ In Cart</span>}
                        </div>
                        <div className="product-body">
                          <div className="product-name">{product.name}</div>
                          <div className="product-desc">{product.description}</div>
                          <div className="product-foot">
                            <span className="product-price">{Number(product.price).toLocaleString()} RWF</span>
                            <span className="product-seller">{product.seller_name}</span>
                          </div>
                          <button className={`add-btn ${inCartIds.has(product.id) ? 'in-cart' : ''}`}
                            onClick={() => addToCart(product)}>
                            {inCartIds.has(product.id) ? '✓ Add More' : '🛒 Add to Cart'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* RECEIPT */}
            {checkoutDone && lastReceipts.length > 0 && (
              <div className="receipt-wrap">
                <div className="receipt-header">
                  <div className="receipt-icon">🎉</div>
                  <div className="receipt-title">{lastReceipts.length} Order{lastReceipts.length > 1 ? 's' : ''} Confirmed!</div>
                  <div className="receipt-sub">All funds safely locked in escrow</div>
                </div>
                <div className="receipt-body">
                  {lastReceipts.map((r, i) => (
                    <div className="receipt-item" key={i}>
                      <div className="receipt-item-name">{r.item_name}</div>
                      <div className="receipt-row"><span className="receipt-row-label">Amount</span><span className="receipt-row-value">{r.amount.toLocaleString()} RWF</span></div>
                      <div className="receipt-row"><span className="receipt-row-label">Method</span><span className="receipt-row-value">{methodLabel[r.method] || r.method}</span></div>
                      <div className="receipt-row"><span className="receipt-row-label">Reference</span><span className="receipt-row-value">{r.gateway_ref}</span></div>
                      <div className="tx-box">
                        <div className="tx-label">TX Hash</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="tx-value">{r.tx_hash}</div>
                          {r.tx_hash?.startsWith('0x') && (
                            <a href={`${EXPLORER_URL}/tx/${r.tx_hash}`} target="_blank" rel="noopener noreferrer"
                              style={{ color: 'var(--accent)', fontSize: 11, flexShrink: 0, textDecoration: 'none' }}>
                              View ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="notice" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', color: '#93c5fd', marginBottom: 16, marginTop: 8 }}>
                    📦 Orders are with sellers. Payment releases after you confirm each delivery.
                  </div>
                  <button className="btn btn-blue btn-lg" onClick={() => { goBack(); setTab('orders'); }}>
                    View My Orders →
                  </button>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {tab === 'orders' && !otpOrder && !disputeOrder && !checkoutDone && (
              <>
                <div className="stat-grid">
                  {[
                    { label: 'Total Orders', value: orders.length, color: '#3B82F6', icon: '📦' },
                    { label: 'In Escrow',    value: inEscrow,      color: '#8B5CF6', icon: '🔐' },
                    { label: 'Completed',    value: completed,     color: '#10B981', icon: '✅' },
                    { label: 'Disputed',     value: disputed,      color: '#EF4444', icon: '⚠️' },
                  ].map(s => (
                    <div className="stat-card" key={s.label}>
                      <span className="stat-icon">{s.icon}</span>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                {delivered > 0 && (
                  <div className="delivered-alert">
                    🔔 {delivered} order{delivered > 1 ? 's' : ''} awaiting your delivery confirmation
                  </div>
                )}
                <div className="order-list">
                  {orders.length === 0 ? (
                    <div className="empty">
                      <div className="empty-icon">🛍️</div>
                      <div className="empty-title">No orders yet</div>
                      <div className="empty-sub">Start shopping and your orders will appear here</div>
                      <button className="btn btn-blue" onClick={() => setTab('shop')}>Browse Products →</button>
                    </div>
                  ) : orders.map(order => {
                    const sc = STATUS_STYLE[order.status] || STATUS_STYLE.pending;
                    return (
                      <div key={order.id} className={`order-card ${order.status === 'delivered' ? 'highlight' : ''}`}>
                        <div className="order-head">
                          <span className="order-name">{order.item_name}</span>
                          <span className="status-pill" style={{ background: sc.bg, color: sc.text }}>
                            <span className="status-dot" style={{ background: sc.dot }} />
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="order-meta">
                          <div><div className="meta-label">Amount</div><div className="meta-value">{Number(order.amount).toLocaleString()} RWF</div></div>
                          {order.seller_name && <div><div className="meta-label">Seller</div><div className="meta-value">{order.seller_name}</div></div>}
                          <div><div className="meta-label">Date</div><div className="meta-value">{new Date(order.created_at).toLocaleDateString()}</div></div>
                        </div>
                        {order.tx_hash && (
                          <div className="tx-box" style={{ marginTop: 12 }}>
                            <div className="tx-label">Transaction Hash</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="tx-value" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>{order.tx_hash}</div>
                              {order.tx_hash.startsWith('0x') && !order.tx_hash.startsWith('0xSIM') && (
                                <a href={`${EXPLORER_URL}/tx/${order.tx_hash}`} target="_blank" rel="noopener noreferrer"
                                  style={{ color: 'var(--accent)', fontSize: 12, flexShrink: 0, textDecoration: 'none' }}>View ↗</a>
                              )}
                            </div>
                          </div>
                        )}
                        <hr className="divider" />
                        {order.status === 'delivered' && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button className="btn btn-green btn-sm" onClick={() => { setOtpOrder(order); setGeneratedOtp(null); setOtpInput(''); }}>✅ Confirm Delivery (OTP)</button>
                            <button className="btn btn-red-outline btn-sm" onClick={() => { setDisputeOrder(order); setDisputeReason(''); }}>⚠️ Open Dispute</button>
                          </div>
                        )}
                        {['pending','paid','in_escrow'].includes(order.status) && (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <div className="notice" style={{ flex: 1, background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', color: '#93c5fd' }}>🔐 Payment locked — waiting for seller to deliver</div>
                            <button className="btn btn-red-outline btn-sm" onClick={() => { setDisputeOrder(order); setDisputeReason(''); }}>Dispute</button>
                          </div>
                        )}
                        {order.status === 'completed' && <div className="notice" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', color: '#6ee7b7' }}>✅ Delivered — payment released to seller</div>}
                        {order.status === 'refunded'  && <div className="notice" style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.15)', color: '#fdba74' }}>💰 Refunded by admin</div>}
                        {order.status === 'disputed'  && <div className="notice" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5' }}>⚠️ Dispute under review by admin</div>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* OTP */}
            {otpOrder && (
              <div className="otp-wrap">
                <button className="back-btn" onClick={() => { setOtpOrder(null); setGeneratedOtp(null); setOtpInput(''); }}>← Back to Orders</button>
                <div className="modal-card">
                  <div className="modal-title">Confirm Delivery</div>
                  <div className="modal-sub">Verify you received your item to release payment to the seller</div>
                  <div className="order-pill">
                    <div className="order-pill-name">{otpOrder.item_name}</div>
                    <div className="order-pill-amount">{Number(otpOrder.amount).toLocaleString()} RWF · locked in escrow</div>
                  </div>
                  <div className={`step-box ${!generatedOtp ? 'active' : ''}`}>
                    <div className="step-head"><div className="step-num">1</div><div className="step-title">Generate your OTP</div></div>
                    {!generatedOtp ? (
                      <>
                        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>OTP will appear here and be emailed to <strong style={{ color: 'var(--text)' }}>{session?.user?.email}</strong></p>
                        <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={handleGenerateOtp} disabled={otpLoading}>
                          {otpLoading ? '⏳ Generating…' : '📧 Generate & Send OTP'}
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="otp-display"><div className="otp-label">Your OTP Code</div><div className="otp-code">{generatedOtp}</div><div className="otp-exp">⏱ Expires in 5 minutes</div></div>
                        <div className="otp-email">📧 Also sent to {session?.user?.email}</div>
                        <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => setGeneratedOtp(null)}>🔄 Regenerate</button>
                      </>
                    )}
                  </div>
                  <div className={`step-box ${generatedOtp ? 'active' : ''}`} style={{ opacity: generatedOtp ? 1 : 0.4 }}>
                    <div className="step-head"><div className={`step-num ${generatedOtp ? '' : 'dim'}`}>2</div><div className="step-title">Enter OTP to release payment</div></div>
                    <input className="otp-input" value={otpInput} placeholder="······" maxLength={6} disabled={!generatedOtp} onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))} />
                    <button className="btn btn-green btn-lg" onClick={handleVerifyOtp} disabled={otpInput.length !== 6 || !generatedOtp || otpLoading}>
                      {otpLoading ? '⏳ Verifying…' : '✅ Confirm Delivery & Release Payment'}
                    </button>
                  </div>
                  <div className="warning-box">⚠️ Only confirm after you have <strong>physically received</strong> your item. This action is irreversible.</div>
                </div>
              </div>
            )}

            {/* DISPUTE */}
            {disputeOrder && (
              <div className="otp-wrap">
                <button className="back-btn" onClick={() => { setDisputeOrder(null); setDisputeReason(''); }}>← Back to Orders</button>
                <div className="modal-card">
                  <div className="modal-title">Open a Dispute</div>
                  <div className="modal-sub">Admin will review your case and issue a refund if applicable</div>
                  <div className="dispute-order-box">
                    <div className="dispute-order-name">{disputeOrder.item_name}</div>
                    <div className="dispute-order-amount">{Number(disputeOrder.amount).toLocaleString()} RWF</div>
                  </div>
                  <label style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 8 }}>Describe the issue</label>
                  <textarea className="dispute-textarea" value={disputeReason} onChange={e => setDisputeReason(e.target.value)} placeholder="e.g. Item not delivered, wrong item received, item damaged..." />
                  <button className="btn btn-lg" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)', width: '100%', justifyContent: 'center' }}
                    onClick={handleOpenDispute} disabled={!disputeReason.trim() || disputeLoading}>
                    {disputeLoading ? '⏳ Submitting…' : '⚠️ Submit Dispute'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* CART DRAWER */}
      {cartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-head">
              <div className="cart-title">🛒 Cart {cartCount > 0 && <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}>({cartCount} item{cartCount !== 1 ? 's' : ''})</span>}</div>
              <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <div style={{ fontSize: 40 }}>🛒</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Your cart is empty</div>
                <div style={{ fontSize: 12 }}>Add products from the shop</div>
              </div>
            ) : (
              <div className="cart-items">
                {cart.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-img">
                      <Image src={item.image_url} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">{(Number(item.price) * item.qty).toLocaleString()} RWF</div>
                    </div>
                    <div className="cart-item-actions">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                      <button className="cart-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="cart-foot">
                <div className="cart-total-row">
                  <span className="cart-total-label">Total ({cartCount} items)</span>
                  <span className="cart-total-value">{cartTotal.toLocaleString()} RWF</span>
                </div>

                {/* ── Payment method tabs (MoMo | Crypto only) ── */}
                <div className="pay-tabs">
                  <button
                    className={`pay-tab ${payMethod === 'mobile_money' ? 'active-momo' : ''}`}
                    onClick={() => setPayMethod('mobile_money')}>
                    📱 MTN MoMo
                  </button>
                  <button
                    className={`pay-tab ${payMethod === 'crypto' ? 'active-crypto' : ''}`}
                    onClick={() => setPayMethod('crypto')}>
                    🦊 Crypto (ETH)
                  </button>
                </div>

                {/* ── MoMo inputs ── */}
                {payMethod === "mobile_money" && (
                  <div style={{ marginBottom: 12 }}>
                    <input
                      style={{ width: '100%', background: 'var(--deep)', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 14px', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, outline: 'none', marginBottom: 8 }}
                      placeholder="MoMo phone e.g. 25078xxxxxxx"
                      value={momoPhone}
                      onChange={e => setMomoPhone(e.target.value)}
                    />
                    {momoRef    && <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Ref: {momoRef}</div>}
                    {momoStatus && <div style={{ fontSize: 12, color: '#93c5fd',     marginBottom: 6 }}>{momoStatus}</div>}
                  </div>
                )}

                {/* ── Crypto / MetaMask info ── */}
                {payMethod === "crypto" && (
                  <div style={{ marginBottom: 12 }}>
                    {hasMetaMask ? (
                      connectedWallet ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 9, marginBottom: 8 }}>
                          <span>🦊</span>
                          <div style={{ fontFamily: 'monospace', fontSize: 11, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#6ee7b7' }}>
                            {connectedWallet.slice(0,10)}…{connectedWallet.slice(-8)}
                          </div>
                          <span style={{ fontSize: 10, background: 'rgba(16,185,129,0.2)', color: 'var(--green)', padding: '2px 7px', borderRadius: 100 }}>Connected</span>
                        </div>
                      ) : (
                        <button
                          onClick={connectMetaMask}
                          disabled={connectingMM}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', padding: '9px', borderRadius: 9, background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', marginBottom: 8, opacity: connectingMM ? 0.5 : 1 }}>
                          {connectingMM ? '⏳ Connecting…' : '🦊 Connect MetaMask'}
                        </button>
                      )
                    ) : (
                      <div style={{ fontSize: 12, color: '#fca5a5', marginBottom: 8, padding: '8px 12px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
                        ⚠️ MetaMask not detected. Install the MetaMask browser extension to pay with ETH.
                      </div>
                    )}

                    {hasMetaMask && connectedWallet && CONTRACT_ADDRESS && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 7, fontFamily: 'monospace', marginBottom: 8 }}>
                        Contract: {CONTRACT_ADDRESS.slice(0,10)}…{CONTRACT_ADDRESS.slice(-8)}
                        <a href={`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: 'var(--accent)', marginLeft: 8, textDecoration: 'none', fontSize: 11 }}>View ↗</a>
                      </div>
                    )}

                    {cryptoStep !== 'idle' && cryptoProgress && (
                      <div className="crypto-progress" style={{ marginTop: 8 }}>
                        <div className="crypto-spinner" />
                        {cryptoProgress}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Checkout button ── */}
                <button
                  className="btn btn-blue btn-lg"
                  onClick={handleCheckout}
                  disabled={
                    checkingOut || momoPaying ||
                    (payMethod === "crypto"       && (!hasMetaMask || !connectedWallet)) ||
                    (payMethod === "mobile_money" && momoPhone.trim().length < 10)
                  }>
                  {momoPaying
                    ? "📱 Waiting for MoMo approval…"
                    : checkingOut
                      ? cryptoButtonLabel()
                      : `🔐 Checkout · ${cartTotal.toLocaleString()} RWF`}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default function BuyerDashboard() {
  return (
    <Suspense fallback={null}>
      <BuyerDashboardContent />
    </Suspense>
  );
}
