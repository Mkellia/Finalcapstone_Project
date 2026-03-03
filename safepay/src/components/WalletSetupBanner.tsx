"use client";
// components/WalletSetupBanner.tsx
// Drop this component at the TOP of your seller dashboard.
// It auto-detects if the seller has no wallet and shows a setup prompt.
// Once saved, the banner disappears permanently.

import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type WalletSetupBannerProps = {
  /** Called after wallet is successfully saved, so parent can refresh state */
  onWalletSaved?: (address: string) => void;
};

export default function WalletSetupBanner({ onWalletSaved }: WalletSetupBannerProps) {
  const [walletAddress, setWalletAddress]   = useState<string | null>(null);
  const [manualInput, setManualInput]       = useState("");
  const [mode, setMode]                     = useState<"idle" | "manual">("idle");
  const [saving, setSaving]                 = useState(false);
  const [loading, setLoading]               = useState(true);
  const [hasMetaMask, setHasMetaMask]       = useState(false);
  const [connecting, setConnecting]         = useState(false);

  // ── Load current wallet from DB ──────────────────────────
  useEffect(() => {
    fetch("/api/profile/wallet")
      .then(r => r.json())
      .then(d => { setWalletAddress(d.wallet_address ?? null); setLoading(false); })
      .catch(() => setLoading(false));

    setHasMetaMask(Boolean((window as unknown as { ethereum?: unknown }).ethereum));
  }, []);

  // ── If wallet already set, render nothing ─────────────────
  if (loading || walletAddress) return null;

  // ── Save wallet to DB ─────────────────────────────────────
  async function saveWallet(address: string) {
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
      toaster.create({ title: "Invalid wallet address format", type: "error", duration: 3000 });
      return;
    }
    setSaving(true);
    const res  = await fetch("/api/profile/wallet", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ wallet_address: address }),
    });
    setSaving(false);
    if (res.ok) {
      setWalletAddress(address);
      toaster.create({ title: "✅ Wallet saved! Buyers can now pay you with crypto.", type: "success", duration: 4000 });
      onWalletSaved?.(address);
    } else {
      const d = await res.json().catch(() => ({}));
      toaster.create({ title: d.error || "Failed to save wallet", type: "error", duration: 3000 });
    }
  }

  // ── Connect MetaMask and get address automatically ────────
  async function connectMetaMask() {
    const ethereum = (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
    if (!ethereum) return;
    setConnecting(true);
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" }) as string[];
      if (accounts[0]) await saveWallet(accounts[0]);
    } catch (err) {
      toaster.create({ title: "MetaMask connection cancelled", type: "warning", duration: 2000 });
    } finally {
      setConnecting(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.15); }
          50%       { box-shadow: 0 0 0 6px rgba(245,158,11,0.0); }
        }
        .wallet-banner {
          background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.05));
          border: 1px solid rgba(245,158,11,0.35);
          border-radius: 14px;
          padding: 20px 24px;
          margin-bottom: 24px;
          animation: pulse-border 2.5s ease infinite;
        }
        .wallet-banner-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .wallet-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(245,158,11,0.15);
          border: 1px solid rgba(245,158,11,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .wallet-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 15px; color: #fbbf24;
          margin-bottom: 2px;
        }
        .wallet-sub { font-size: 12px; color: #92400e; color: #fcd34d; opacity: 0.8; }
        .wallet-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .wallet-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 16px; border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all .15s; border: none; white-space: nowrap;
        }
        .wallet-btn-metamask {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff; box-shadow: 0 4px 14px rgba(249,115,22,0.3);
        }
        .wallet-btn-metamask:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(249,115,22,0.4); }
        .wallet-btn-manual {
          background: rgba(255,255,255,0.06); color: #fcd34d;
          border: 1px solid rgba(245,158,11,0.25);
        }
        .wallet-btn-manual:hover { background: rgba(245,158,11,0.1); }
        .wallet-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }
        .wallet-manual-wrap { margin-top: 12px; display: flex; gap: 8px; }
        .wallet-input {
          flex: 1; background: rgba(0,0,0,0.3);
          border: 1px solid rgba(245,158,11,0.3); border-radius: 9px;
          padding: 10px 14px; color: #fef3c7;
          font-family: monospace; font-size: 13px; outline: none;
          transition: border-color .2s;
        }
        .wallet-input:focus { border-color: rgba(245,158,11,0.7); }
        .wallet-input::placeholder { color: rgba(253,230,138,0.35); font-family: 'DM Sans', sans-serif; }
        .wallet-btn-save {
          background: rgba(245,158,11,0.2); color: #fbbf24;
          border: 1px solid rgba(245,158,11,0.35);
          padding: 10px 18px; border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all .15s; white-space: nowrap;
        }
        .wallet-btn-save:hover { background: rgba(245,158,11,0.3); }
        .wallet-btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
        .no-metamask-note {
          font-size: 11px; color: rgba(253,230,138,0.5);
          margin-top: 6px;
        }
      `}</style>

      <div className="wallet-banner">
        <div className="wallet-banner-head">
          <div className="wallet-icon">👛</div>
          <div>
            <div className="wallet-title">⚠️ Wallet Required for Crypto Payments</div>
            <div className="wallet-sub">
              Buyers cannot pay you with ETH until you add your wallet address
            </div>
          </div>
        </div>

        <div className="wallet-actions">
          {/* Auto-connect via MetaMask */}
          {hasMetaMask && (
            <button
              className="wallet-btn wallet-btn-metamask"
              onClick={connectMetaMask}
              disabled={connecting || saving}>
              {connecting ? "⏳ Connecting…" : "🦊 Connect MetaMask"}
            </button>
          )}

          {/* Manual entry toggle */}
          <button
            className="wallet-btn wallet-btn-manual"
            onClick={() => setMode(mode === "manual" ? "idle" : "manual")}
            disabled={saving}>
            ✏️ Enter Address Manually
          </button>
        </div>

        {/* No MetaMask note */}
        {!hasMetaMask && (
          <div className="no-metamask-note">
            MetaMask not detected. Install it from metamask.io or enter your address manually.
          </div>
        )}

        {/* Manual input */}
        {mode === "manual" && (
          <div className="wallet-manual-wrap">
            <input
              className="wallet-input"
              placeholder="0x... your Ethereum wallet address"
              value={manualInput}
              onChange={e => setManualInput(e.target.value.trim())}
              maxLength={42}
            />
            <button
              className="wallet-btn-save"
              onClick={() => saveWallet(manualInput)}
              disabled={saving || manualInput.length !== 42}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}