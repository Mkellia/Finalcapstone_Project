"use client";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { Order, Product } from "@/types";

const STATUS_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  pending:   { bg: 'rgba(245,158,11,0.1)',  text: '#F59E0B', dot: '#F59E0B' },
  paid:      { bg: 'rgba(59,130,246,0.1)',   text: '#3B82F6', dot: '#3B82F6' },
  in_escrow: { bg: 'rgba(139,92,246,0.1)',   text: '#8B5CF6', dot: '#8B5CF6' },
  delivered: { bg: 'rgba(6,182,212,0.1)',    text: '#06B6D4', dot: '#06B6D4' },
  completed: { bg: 'rgba(16,185,129,0.1)',   text: '#10B981', dot: '#10B981' },
  disputed:  { bg: 'rgba(239,68,68,0.1)',    text: '#EF4444', dot: '#EF4444' },
  refunded:  { bg: 'rgba(249,115,22,0.1)',   text: '#F97316', dot: '#F97316' },
};

type OrderWithBuyer = Order & { buyer_name?: string; tx_hash?: string };
type Currency = "RWF" | "ETH";
// NEW: typed MetaMask provider
type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Food', 'Beauty', 'Automotive', 'Art', 'Other'];
const EMPTY_FORM = { name: '', description: '', price: '', category: 'Electronics', image_url: '', in_stock: true };
const RWF_PER_ETH = Number(process.env.NEXT_PUBLIC_SEPOLIA_RWF_PER_ETH || "4000000");

export default function SellerDashboard() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<'orders' | 'products' | 'wallet'>('orders');
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("RWF");

  const [orders,   setOrders]   = useState<OrderWithBuyer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // wallet
  const [walletAddress, setWalletAddress] = useState('');
  const [savedWallet,   setSavedWallet]   = useState('');
  const [savingWallet,  setSavingWallet]  = useState(false);
  const [sellerBalance, setSellerBalance] = useState<string | null>(null);
  const [loadingSellerBal, setLoadingSellerBal] = useState(false);
  // NEW
  const [hasMetaMask,   setHasMetaMask]   = useState(false);
  const [connectingMM,  setConnectingMM]  = useState(false);

  // product modal
  const [showModal,   setShowModal]   = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form,        setForm]        = useState({ ...EMPTY_FORM });
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // ── fetchers ────────────────────────────────────────────
  async function fetchOrders() {
    const res  = await fetch('/api/orders?role=seller');
    const data = await res.json();
    setOrders(data.orders || []);
  }

  async function fetchProducts() {
    const res  = await fetch('/api/products');
    const data = await res.json();
    const mine = (data.products || []).filter((p: Product) => p.seller_id === session?.user?.id);
    setProducts(mine);
  }

  async function fetchWallet() {
    const res  = await fetch('/api/sellers/wallet');
    const data = await res.json();
    const savedWalletAddress = data.wallet_address || '';
    setWalletAddress(savedWalletAddress);
    setSavedWallet(savedWalletAddress);
    if (savedWalletAddress) fetchSellerBalance(savedWalletAddress);
  }

  async function fetchSellerBalance(address: string) {
    setLoadingSellerBal(true);
    try {
      const res = await fetch(`/api/wallet-balance?address=${address}`);
      const data = await res.json();
      if (res.ok) setSellerBalance(data.balance);
      else setSellerBalance(null);
    } catch {
      setSellerBalance(null);
    } finally {
      setLoadingSellerBal(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);
  useEffect(() => {
    if (session?.user?.id) { fetchProducts(); fetchWallet(); }
  }, [session]);
  useEffect(() => {
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);
  // NEW: detect MetaMask
  useEffect(() => {
    setHasMetaMask(Boolean((window as unknown as { ethereum?: unknown }).ethereum));
  }, []);

  // close modal on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') closeModal(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // ── modal helpers ────────────────────────────────────────
  function openCreate() { setEditProduct(null); setForm({ ...EMPTY_FORM }); setShowModal(true); }
  function openEdit(p: Product) {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category, image_url: p.image_url, in_stock: p.in_stock });
    setShowModal(true);
  }
  function closeModal() { setShowModal(false); setEditProduct(null); setForm({ ...EMPTY_FORM }); }
  const setF = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  // ── product CRUD ─────────────────────────────────────────
  async function saveProduct() {
    if (!form.name || !form.price || !form.image_url) {
      toaster.create({ title: 'Name, price and image are required', type: 'error', duration: 3000 });
      return;
    }
    setSaving(true);
    const payload = { ...form, price: Number(form.price) };
    const res = editProduct
      ? await fetch(`/api/products/${editProduct.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/products',                   { method: 'POST',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      toaster.create({ title: editProduct ? '✅ Product updated' : '🎉 Product created!', type: 'success', duration: 3000 });
      closeModal(); fetchProducts();
    } else {
      const d = await res.json();
      toaster.create({ title: d.error || 'Failed to save product', type: 'error', duration: 3000 });
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setDeleting(null);
    if (res.ok) { toaster.create({ title: '🗑️ Product deleted', type: 'info', duration: 3000 }); fetchProducts(); }
    else toaster.create({ title: 'Failed to delete product', type: 'error', duration: 3000 });
  }

  // ── order actions ────────────────────────────────────────
  async function markDelivered(orderId: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'delivered' }),
    });
    if (res.ok) { toaster.create({ title: '📦 Marked as delivered. Waiting for buyer OTP.', type: 'info', duration: 3000 }); fetchOrders(); }
    else toaster.create({ title: 'Failed to update order', type: 'error', duration: 3000 });
  }

  // ── wallet ───────────────────────────────────────────────
  async function saveWallet() {
    if (walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toaster.create({ title: 'Invalid wallet. Must start with 0x and be 42 chars.', type: 'error', duration: 4000 });
      return;
    }
    setSavingWallet(true);
    const res = await fetch('/api/sellers/wallet', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
    setSavingWallet(false);
    if (res.ok) {
      setSavedWallet(walletAddress);
      fetchSellerBalance(walletAddress);
      toaster.create({ title: '✅ Wallet saved! Buyers can now pay you with crypto.', type: 'success', duration: 3000 });
    } else {
      toaster.create({ title: 'Failed to save wallet', type: 'error', duration: 3000 });
    }
  }

  // NEW: one-click MetaMask connect — works from banner OR wallet tab
  async function connectMetaMask() {
    const ethereum = (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
    if (!ethereum) {
      toaster.create({ title: 'MetaMask not detected. Install from metamask.io', type: 'error', duration: 4000 });
      return;
    }
    setConnectingMM(true);
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts[0]) {
        setWalletAddress(accounts[0]);
        setSavingWallet(true);
        const res = await fetch('/api/sellers/wallet', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet_address: accounts[0] }),
        });
        setSavingWallet(false);
        if (res.ok) {
          setSavedWallet(accounts[0]);
          fetchSellerBalance(accounts[0]);
          toaster.create({ title: '🦊 MetaMask connected & wallet saved!', type: 'success', duration: 4000 });
        }
      }
    } catch {
      toaster.create({ title: 'MetaMask connection cancelled', type: 'warning', duration: 2000 });
    } finally {
      setConnectingMM(false);
    }
  }

  // ── stats ────────────────────────────────────────────────
  const totalEarnings = orders.filter(o => o.status === 'completed').reduce((s, o) => s + Number(o.amount), 0);
  const pending       = orders.filter(o => ['in_escrow','paid','pending'].includes(o.status)).length;
  const completed     = orders.filter(o => o.status === 'completed').length;
  const delivered     = orders.filter(o => o.status === 'delivered').length;
  const inEscrow      = orders.filter(o => ['in_escrow','delivered'].includes(o.status)).reduce((s, o) => s + Number(o.amount), 0);
  const formatAmount = (amountRwf: number) =>
    displayCurrency === "RWF"
      ? `${amountRwf.toLocaleString()} RWF`
      : `${(amountRwf / RWF_PER_ETH).toFixed(6)} ETH`;

  // NEW: drives warning badge + banner visibility
  const walletMissing = !savedWallet;

  const tabs = [
    { key: 'orders'   as const, icon: '📦', label: 'Orders',   badge: orders.length   },
    { key: 'products' as const, icon: '🛍️', label: 'Products', badge: products.length },
    { key: 'wallet'   as const, icon: '💳', label: 'Wallet',   badge: 0               },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #04080F; --deep: #060B17; --panel: #0D1526; --card: #0F1A2E;
          --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
          --accent: #3B82F6; --accent2: #2563EB;
          --text: #E8EDF5; --muted: #7B8BAD;
          --green: #10B981; --gold: #F59E0B; --red: #EF4444;
        }
        body { background: var(--deep); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .dash-wrap { display: flex; min-height: 100vh; }

        /* SIDEBAR */
        .sidebar { width: 240px; flex-shrink: 0; background: var(--navy); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
        .sidebar-logo { padding: 28px 24px 20px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; border-bottom: 1px solid var(--border); }
        .sidebar-logo span { color: var(--accent); }
        .sidebar-user { padding: 16px 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); }
        .avatar { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--accent), #6366f1); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .user-info { min-width: 0; }
        .user-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 11px; color: var(--muted); }
        .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; cursor: pointer; font-size: 14px; color: var(--muted); transition: all .15s; border: 1px solid transparent; user-select: none; }
        .nav-item:hover { color: var(--text); background: rgba(255,255,255,0.04); }
        .nav-item.active { color: var(--text); background: rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.2); }
        .nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .nav-label { flex: 1; }
        .nav-badge { background: rgba(59,130,246,0.2); color: var(--accent); font-size: 11px; font-weight: 600; padding: 1px 7px; border-radius: 100px; }
        .nav-badge-warn { background: rgba(245,158,11,0.25); color: #F59E0B; font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 100px; animation: warn-pulse 2s ease infinite; }
        @keyframes warn-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .sidebar-foot { padding: 16px 12px; border-top: 1px solid var(--border); }
        .sign-out { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; cursor: pointer; font-size: 13px; color: var(--muted); transition: all .15s; background: none; border: none; width: 100%; font-family: 'DM Sans', sans-serif; }
        .sign-out:hover { color: var(--red); background: rgba(239,68,68,0.07); }

        /* MAIN */
        .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .topbar { padding: 20px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--navy); position: sticky; top: 0; z-index: 10; }
        .topbar-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.3px; }
        .topbar-sub { font-size: 13px; color: var(--muted); margin-top: 2px; }
        .content { padding: 28px 32px; flex: 1; }

        /* NEW ── WALLET WARNING BANNER */
        @keyframes pulse-border { 0%,100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.2); } 50% { box-shadow: 0 0 0 8px rgba(245,158,11,0); } }
        .wallet-warn-banner {
          background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.04));
          border: 1px solid rgba(245,158,11,0.4); border-radius: 14px;
          padding: 16px 20px; margin-bottom: 24px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
          animation: pulse-border 2.5s ease infinite;
        }
        .wallet-warn-left { display: flex; align-items: center; gap: 12px; }
        .wallet-warn-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .wallet-warn-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #fbbf24; margin-bottom: 3px; }
        .wallet-warn-sub { font-size: 12px; color: rgba(253,230,138,0.65); }
        .wallet-warn-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .btn-mm { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 9px; background: linear-gradient(135deg,#f97316,#ea580c); color: #fff; font-family: 'DM Sans',sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all .15s; white-space: nowrap; }
        .btn-mm:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(249,115,22,0.4); }
        .btn-mm:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-go-wallet { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 9px; background: rgba(245,158,11,0.1); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); font-family: 'DM Sans',sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s; white-space: nowrap; }
        .btn-go-wallet:hover { background: rgba(245,158,11,0.2); }

        /* WALLET TAB extras */
        .btn-mm-large { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 11px; border-radius: 9px; background: linear-gradient(135deg,#f97316,#ea580c); color: #fff; font-family: 'DM Sans',sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all .15s; margin-bottom: 10px; }
        .btn-mm-large:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(249,115,22,0.35); }
        .btn-mm-large:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .no-mm-note { font-size: 12px; color: var(--muted); padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 10px; }

        /* STAT CARDS */
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
        .stat-card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 20px; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; inset: 0; opacity: 0; background: linear-gradient(135deg, rgba(59,130,246,0.08), transparent); transition: opacity .2s; }
        .stat-card:hover::before { opacity: 1; }
        .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .stat-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 26px; letter-spacing: -0.5px; }
        .stat-sub   { font-size: 11px; color: var(--muted); margin-top: 4px; }
        .stat-icon  { position: absolute; right: 16px; top: 16px; font-size: 20px; opacity: 0.4; }

        /* BUTTONS */
        .btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; border: none; white-space: nowrap; }
        .btn-blue { background: var(--accent); color: #fff; box-shadow: 0 0 20px rgba(59,130,246,0.25); }
        .btn-blue:hover { background: var(--accent2); transform: translateY(-1px); }
        .btn-outline { background: transparent; color: var(--muted); border: 1px solid var(--border2); }
        .btn-outline:hover { color: var(--text); border-color: var(--accent); }
        .btn-danger { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
        .btn-danger:hover { background: rgba(239,68,68,0.18); }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

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
        .meta-item  { display: flex; flex-direction: column; gap: 2px; }
        .meta-label { font-size: 11px; color: var(--muted); }
        .meta-value { font-size: 13px; font-weight: 500; }
        .divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }
        .tx-box { background: var(--deep); border-radius: 8px; padding: 10px 12px; margin-top: 10px; }
        .tx-label { font-size: 10px; color: var(--muted); margin-bottom: 3px; text-transform: uppercase; letter-spacing: 1px; }
        .tx-value { font-size: 11px; font-family: monospace; color: var(--accent); word-break: break-all; }
        .notice { padding: 10px 14px; border-radius: 9px; font-size: 12px; margin-top: 10px; display: flex; align-items: center; gap: 8px; }

        /* PRODUCTS */
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }
        .product-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: border-color .2s, transform .2s; }
        .product-card:hover { border-color: var(--border2); transform: translateY(-2px); }
        .product-img { position: relative; height: 170px; background: var(--deep); overflow: hidden; }
        .product-img img { object-fit: cover; }
        .img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%); }
        .img-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 5px; }
        .img-actions { position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; opacity: 0; transition: opacity .2s; }
        .product-card:hover .img-actions { opacity: 1; }
        .icon-btn { width: 30px; height: 30px; border-radius: 7px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all .15s; backdrop-filter: blur(8px); }
        .icon-btn-edit   { background: rgba(59,130,246,0.8); color: #fff; }
        .icon-btn-delete { background: rgba(239,68,68,0.8);  color: #fff; }
        .icon-btn:hover  { transform: scale(1.1); }
        .pill { font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.5px; }
        .pill-green { background: rgba(16,185,129,0.15); color: var(--green); }
        .pill-red   { background: rgba(239,68,68,0.15);  color: var(--red); }
        .pill-blue  { background: rgba(59,130,246,0.15); color: var(--accent); }
        .product-body { padding: 14px; }
        .product-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-desc { font-size: 12px; color: var(--muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }
        .product-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
        .product-price { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: var(--accent); }
        .add-card { background: transparent; border: 2px dashed var(--border2); border-radius: 16px; min-height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all .2s; color: var(--muted); }
        .add-card:hover { border-color: var(--accent); color: var(--accent); background: rgba(59,130,246,0.04); }
        .add-icon { font-size: 32px; }
        .add-label { font-size: 13px; font-weight: 500; }

        /* EMPTY */
        .empty { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 60px 20px; text-align: center; color: var(--muted); }
        .empty-icon  { font-size: 40px; margin-bottom: 12px; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 16px; color: var(--text); margin-bottom: 6px; }
        .empty-sub   { font-size: 13px; }

        /* WALLET */
        .wallet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .wallet-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
        .wallet-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 4px; }
        .wallet-sub { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
        .wallet-input { width: 100%; background: var(--deep); border: 1px solid var(--border); border-radius: 9px; padding: 11px 14px; color: var(--text); font-family: monospace; font-size: 13px; outline: none; transition: border-color .2s; margin-bottom: 12px; }
        .wallet-input:focus { border-color: var(--accent); }
        .wallet-input::placeholder { color: var(--muted); font-family: 'DM Sans', sans-serif; }
        .saved-wallet { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); border-radius: 9px; padding: 10px 14px; margin-bottom: 16px; }
        .saved-label { font-size: 11px; color: var(--green); font-weight: 600; margin-bottom: 4px; }
        .saved-addr  { font-size: 11px; font-family: monospace; color: #6ee7b7; word-break: break-all; }
        .step-list { display: flex; flex-direction: column; gap: 14px; }
        .step-item { display: flex; align-items: flex-start; gap: 12px; }
        .step-num { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--accent); }
        .step-title { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
        .step-desc  { font-size: 12px; color: var(--muted); line-height: 1.5; }
        .earn-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
        .earn-card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 18px; }
        .earn-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .earn-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: -0.5px; }
        .earn-sub   { font-size: 11px; color: var(--muted); margin-top: 4px; }

        /* MODAL */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .15s ease; }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        .modal { background: var(--panel); border: 1px solid var(--border2); border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; padding: 32px; animation: slideUp .2s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .modal-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.3px; }
        .modal-close { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
        .modal-close:hover { border-color: var(--border2); color: var(--text); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { font-size: 12px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }
        .form-input, .form-select, .form-textarea { background: var(--deep); border: 1px solid var(--border); border-radius: 9px; padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color .2s; width: 100%; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
        .form-select option { background: #0D1526; }
        .form-textarea { resize: vertical; min-height: 90px; }
        .preview-box { position: relative; height: 140px; background: var(--deep); border: 1px solid var(--border); border-radius: 9px; overflow: hidden; margin-top: 8px; }
        .preview-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--muted); font-size: 13px; gap: 6px; }
        .stock-toggle { display: flex; gap: 8px; }
        .stock-btn { flex: 1; padding: 10px; border-radius: 9px; border: 1px solid var(--border); background: var(--deep); color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all .15s; text-align: center; }
        .stock-btn.active-green { border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.1); color: var(--green); }
        .stock-btn.active-red   { border-color: rgba(239,68,68,0.4);  background: rgba(239,68,68,0.1);  color: var(--red); }
        .modal-foot { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); }

        .alert { padding: 12px 16px; border-radius: 10px; font-size: 13px; display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .alert-cyan { background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.2); color: #67e8f9; }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .stat-grid { grid-template-columns: repeat(2,1fr); }
          .wallet-grid, .earn-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .content { padding: 20px 16px; }
          .topbar { padding: 16px 20px; }
          .wallet-warn-banner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="dash-wrap">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">Safe<span>Pay</span></div>
          <div className="sidebar-user">
            <div className="avatar">{session?.user?.name?.charAt(0).toUpperCase() || 'S'}</div>
            <div className="user-info">
              <div className="user-name">{session?.user?.name}</div>
              <div className="user-role">Seller</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            {tabs.map(t => (
              <div key={t.key} className={`nav-item ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                <span className="nav-icon">{t.icon}</span>
                <span className="nav-label">{t.label}</span>
                {/* ⚠️ Pulsing warning badge on Wallet when no wallet set */}
                {t.key === 'wallet' && walletMissing
                  ? <span className="nav-badge-warn">!</span>
                  : t.badge > 0
                    ? <span className="nav-badge">{t.badge}</span>
                    : null}
              </div>
            ))}
          </nav>
          {savedWallet && (
            <div style={{ margin: '0 12px 8px', padding: '8px 12px', borderRadius: 9, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.8px' }}>ETH Balance</div>
              {loadingSellerBal ? (
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Loading…</div>
              ) : sellerBalance !== null ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--green)' }}>
                    {parseFloat(sellerBalance).toFixed(5)}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>ETH</span>
                  <button
                    onClick={() => savedWallet && fetchSellerBalance(savedWallet)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 12, padding: '0 2px' }}
                    title="Refresh"
                  >
                    ↺
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>—</div>
              )}
            </div>
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
                {tab === 'orders'   && '📦 Orders'}
                {tab === 'products' && '🛍️ Products'}
                {tab === 'wallet'   && '💳 Wallet'}
              </div>
              <div className="topbar-sub">
                {tab === 'orders'   && 'Manage and track your incoming orders'}
                {tab === 'products' && 'Create, edit, and manage your product listings'}
                {tab === 'wallet'   && 'Manage your payout wallet'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 9, overflow: 'hidden' }}>
                <button
                  onClick={() => setDisplayCurrency("RWF")}
                  style={{
                    padding: '9px 10px',
                    border: 'none',
                    background: displayCurrency === "RWF" ? 'rgba(59,130,246,0.16)' : 'var(--panel)',
                    color: displayCurrency === "RWF" ? 'var(--accent)' : 'var(--muted)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  RWF
                </button>
                <button
                  onClick={() => setDisplayCurrency("ETH")}
                  style={{
                    padding: '9px 10px',
                    border: 'none',
                    background: displayCurrency === "ETH" ? 'rgba(59,130,246,0.16)' : 'var(--panel)',
                    color: displayCurrency === "ETH" ? 'var(--accent)' : 'var(--muted)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  ETH
                </button>
              </div>
              {tab === 'products' && (
                <button className="btn btn-blue" onClick={openCreate}>＋ Add Product</button>
              )}
            </div>
          </div>

          <div className="content">

            {/* ── NEW: WALLET WARNING BANNER ───────────────────────────────────
                Shows on Orders + Products tabs when wallet is not set.
                Has two actions: Connect MetaMask (instant) or go to Wallet tab.
            ─────────────────────────────────────────────────────────────────── */}
            {walletMissing && (tab === 'orders' || tab === 'products') && (
              <div className="wallet-warn-banner">
                <div className="wallet-warn-left">
                  <div className="wallet-warn-icon">👛</div>
                  <div>
                    <div className="wallet-warn-title">⚠️ No wallet address set</div>
                    <div className="wallet-warn-sub">
                      Buyers cannot pay you with crypto until you add your Ethereum wallet
                    </div>
                  </div>
                </div>
                <div className="wallet-warn-actions">
                  {hasMetaMask && (
                    <button className="btn-mm" onClick={connectMetaMask} disabled={connectingMM || savingWallet}>
                      {connectingMM ? '⏳ Connecting…' : '🦊 Connect MetaMask'}
                    </button>
                  )}
                  <button className="btn-go-wallet" onClick={() => setTab('wallet')}>
                    ✏️ Set Up Wallet →
                  </button>
                </div>
              </div>
            )}

            {/* ══ ORDERS ══ */}
            {tab === 'orders' && (
              <>
                <div className="stat-grid">
                  {[
                    { label: 'Total Orders',  value: orders.length,                       color: '#3B82F6', icon: '📦', sub: 'All time'      },
                    { label: 'Awaiting',      value: pending,                             color: '#8B5CF6', icon: '⏳', sub: 'In progress'    },
                    { label: 'Delivered',     value: delivered,                           color: '#06B6D4', icon: '🚚', sub: 'Awaiting OTP'   },
                    { label: 'Total Earned',  value: formatAmount(totalEarnings), color: '#10B981', icon: '💰', sub: 'Completed payouts'  },
                  ].map(s => (
                    <div className="stat-card" key={s.label}>
                      <span className="stat-icon">{s.icon}</span>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                      <div className="stat-sub">{s.sub}</div>
                    </div>
                  ))}
                </div>

                {delivered > 0 && (
                  <div className="alert alert-cyan">
                    🔔 {delivered} order{delivered > 1 ? 's' : ''} marked as delivered — awaiting buyer OTP confirmation
                  </div>
                )}

                <div className="order-list">
                  {orders.length === 0 ? (
                    <div className="empty">
                      <div className="empty-icon">📭</div>
                      <div className="empty-title">No orders yet</div>
                      <div className="empty-sub">Orders will appear here once buyers purchase your products</div>
                    </div>
                  ) : orders.map(order => {
                    const sc = STATUS_COLOR[order.status] || STATUS_COLOR.pending;
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
                          <div className="meta-item"><span className="meta-label">Amount</span><span className="meta-value">{formatAmount(Number(order.amount))}</span></div>
                          {order.buyer_name && <div className="meta-item"><span className="meta-label">Buyer</span><span className="meta-value">{order.buyer_name}</span></div>}
                          <div className="meta-item"><span className="meta-label">Date</span><span className="meta-value">{new Date(order.created_at).toLocaleDateString()}</span></div>
                        </div>
                        {order.tx_hash && (
                          <div className="tx-box">
                            <div className="tx-label">TX Hash</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="tx-value" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{order.tx_hash}</div>
                              {order.tx_hash.startsWith('0x') && !order.tx_hash.startsWith('0xMOMO') && (
                                <a href={`https://sepolia.etherscan.io/tx/${order.tx_hash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: 12, flexShrink: 0, textDecoration: 'none' }}>View ↗</a>
                              )}
                            </div>
                          </div>
                        )}
                        <hr className="divider" />
                        {['in_escrow','paid','pending'].includes(order.status) && (
                          <button className="btn btn-blue btn-sm" onClick={() => markDelivered(order.id)}>📦 Mark as Delivered</button>
                        )}
                        {order.status === 'delivered' && <div className="notice" style={{ background: 'rgba(6,182,212,0.07)',  color: '#67e8f9', border: '1px solid rgba(6,182,212,0.15)'  }}>⏳ Waiting for buyer to confirm delivery and enter OTP</div>}
                        {order.status === 'completed' && <div className="notice" style={{ background: 'rgba(16,185,129,0.07)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.15)' }}>✅ Payment released to your wallet</div>}
                        {order.status === 'disputed'  && <div className="notice" style={{ background: 'rgba(239,68,68,0.07)',  color: '#fca5a5', border: '1px solid rgba(239,68,68,0.15)'  }}>⚠️ Buyer opened a dispute — admin is reviewing</div>}
                        {order.status === 'refunded'  && <div className="notice" style={{ background: 'rgba(249,115,22,0.07)', color: '#fdba74', border: '1px solid rgba(249,115,22,0.15)' }}>💰 Buyer was refunded by admin</div>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ══ PRODUCTS ══ */}
            {tab === 'products' && (
              <>
                <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                  {[
                    { label: 'Total Listed', value: products.length,                                          color: '#3B82F6', icon: '🛍️' },
                    { label: 'In Stock',     value: products.filter(p => p.in_stock).length,                 color: '#10B981', icon: '✅' },
                    { label: 'Categories',   value: [...new Set(products.map(p => p.category))].length || 0, color: '#8B5CF6', icon: '🗂️' },
                  ].map(s => (
                    <div className="stat-card" key={s.label}>
                      <span className="stat-icon">{s.icon}</span>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="product-grid">
                  <div className="add-card" onClick={openCreate}>
                    <div className="add-icon">＋</div>
                    <div className="add-label">Add New Product</div>
                  </div>
                  {products.map(product => (
                    <div className="product-card" key={product.id}>
                      <div className="product-img">
                        <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                        <div className="img-overlay" />
                        <div className="img-badges">
                          <span className={`pill ${product.in_stock ? 'pill-green' : 'pill-red'}`}>{product.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                        <div className="img-actions">
                          <button className="icon-btn icon-btn-edit" onClick={() => openEdit(product)} title="Edit">✏️</button>
                          <button className="icon-btn icon-btn-delete" onClick={() => deleteProduct(product.id)} disabled={deleting === product.id} title="Delete">🗑️</button>
                        </div>
                      </div>
                      <div className="product-body">
                        <div className="product-name">{product.name}</div>
                        <div className="product-desc">{product.description}</div>
                        <div className="product-foot">
                          <span className="product-price">{formatAmount(Number(product.price))}</span>
                          <span className="pill pill-blue">{product.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ══ WALLET ══ */}
            {tab === 'wallet' && (
              <>
                <div className="earn-grid">
                  {[
                    { label: 'Total Earned',     value: formatAmount(totalEarnings), color: '#10B981', sub: 'From completed orders' },
                    { label: 'Pending Release',  value: formatAmount(inEscrow),      color: '#8B5CF6', sub: 'Locked in escrow'       },
                    { label: 'Completed Orders', value: `${completed}`,                          color: '#3B82F6', sub: 'Successfully delivered'  },
                  ].map(s => (
                    <div className="earn-card" key={s.label}>
                      <div className="earn-label">{s.label}</div>
                      <div className="earn-value" style={{ color: s.color }}>{s.value}</div>
                      <div className="earn-sub">{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="wallet-grid">
                  <div className="wallet-card">
                    <div className="wallet-title">Your Ethereum Wallet</div>
                    <div className="wallet-sub">This address receives ETH when buyers pay with crypto</div>

                    {savedWallet && (
                      <div className="saved-wallet">
                        <div className="saved-label">✅ Current wallet</div>
                        <div className="saved-addr">{savedWallet}</div>
                      </div>
                    )}

                    {/* NEW: MetaMask one-click connect */}
                    {hasMetaMask ? (
                      <button className="btn-mm-large" onClick={connectMetaMask} disabled={connectingMM || savingWallet}>
                        {connectingMM ? '⏳ Connecting…' : '🦊 Connect MetaMask (Auto-fill)'}
                      </button>
                    ) : (
                      <div className="no-mm-note">
                        MetaMask not detected. Install from{' '}
                        <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>metamask.io</a>
                        {' '}or paste your address below.
                      </div>
                    )}

                    {/* Manual entry — always available as fallback */}
                    <input
                      className="wallet-input"
                      value={walletAddress}
                      onChange={e => setWalletAddress(e.target.value)}
                      placeholder="0x... or paste address manually"
                    />
                    <button className="btn btn-blue" style={{ width: '100%', justifyContent: 'center' }}
                      onClick={saveWallet} disabled={savingWallet}>
                      {savingWallet ? 'Saving…' : savedWallet ? '🔄 Update Wallet' : '💾 Save Wallet Address'}
                    </button>
                  </div>

                  <div className="wallet-card">
                    <div className="wallet-title">How crypto payments work</div>
                    <div className="wallet-sub">Step-by-step escrow flow</div>
                    <div className="step-list">
                      {[
                        { n: '1', t: 'Buyer selects Crypto',    d: 'Buyer chooses Sepolia ETH at checkout'    },
                        { n: '2', t: 'ETH locked in escrow',    d: 'Smart contract holds funds securely'      },
                        { n: '3', t: 'You deliver the item',    d: 'Mark order as delivered in your dashboard' },
                        { n: '4', t: 'Buyer confirms with OTP', d: 'One-time code confirms receipt'            },
                        { n: '5', t: 'ETH released to you',     d: 'Smart contract sends ETH to your wallet'  },
                      ].map(s => (
                        <div className="step-item" key={s.n}>
                          <div className="step-num">{s.n}</div>
                          <div>
                            <div className="step-title">{s.t}</div>
                            <div className="step-desc">{s.d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 9, fontSize: 12, color: '#fcd34d' }}>
                      ⚠️ Sepolia testnet only — get test ETH from{' '}
                      <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', textDecoration: 'underline' }}>sepoliafaucet.com</a>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {showModal && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal" ref={modalRef}>
            <div className="modal-head">
              <div className="modal-title">{editProduct ? '✏️ Edit Product' : '＋ New Product'}</div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Product Name</label>
                <input className="form-input" value={form.name} onChange={setF('name')} placeholder="e.g. Wireless Headphones" />
              </div>
              <div className="form-group full">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={setF('description')} placeholder="Describe your product — features, condition, what's included…" />
              </div>
              <div className="form-group">
                <label className="form-label">Price (RWF)</label>
                <input className="form-input" type="number" value={form.price} onChange={setF('price')} placeholder="e.g. 25000" min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={setF('category')}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group full">
                <label className="form-label">Image URL</label>
                <input className="form-input" value={form.image_url} onChange={setF('image_url')} placeholder="https://images.unsplash.com/..." />
                <div className="preview-box">
                  {form.image_url
                    ? <Image src={form.image_url} alt="preview" fill style={{ objectFit: 'cover' }} unoptimized onError={() => setForm(f => ({ ...f, image_url: '' }))} />
                    : <div className="preview-placeholder"><span style={{ fontSize: 24 }}>🖼️</span><span>Image preview will appear here</span></div>}
                </div>
              </div>
              <div className="form-group full">
                <label className="form-label">Stock Status</label>
                <div className="stock-toggle">
                  <button className={`stock-btn ${form.in_stock ? 'active-green' : ''}`} onClick={() => setForm(f => ({ ...f, in_stock: true }))}>✅ In Stock</button>
                  <button className={`stock-btn ${!form.in_stock ? 'active-red' : ''}`}  onClick={() => setForm(f => ({ ...f, in_stock: false }))}>❌ Out of Stock</button>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button className="btn btn-blue" onClick={saveProduct} disabled={saving}>
                {saving ? 'Saving…' : editProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
