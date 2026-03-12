"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { Dispute } from "@/types";

type DisputeExtended = Dispute & {
  item_name: string;
  amount: number;
  buyer_name: string;
  seller_name: string;
  payment_method?: string;
  tx_hash?: string;
  resolved_at?: string;
};


export default function AdminDisputesPage() {
  const { data: session } = useSession();
  const [disputes, setDisputes]     = useState<DisputeExtended[]>([]);
  const [selected, setSelected]     = useState<DisputeExtended | null>(null);
  const [resolution, setResolution] = useState("");
  const [modalOpen, setModalOpen]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(true);

  async function fetchDisputes() {
    setFetching(true);
    try {
      const res  = await fetch("/api/disputes");
      const data = await res.json();
      setDisputes(data.disputes || []);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => { fetchDisputes(); }, []);

  function openResolution(d: DisputeExtended) {
    setSelected(d);
    setResolution(d.resolution || "");
    setModalOpen(true);
  }

  function isCrypto(d: DisputeExtended) {
    return d.payment_method === "crypto" || d.payment_method === "eth";
  }

  async function handleResolveRefund() {
    if (!selected) return;
    setLoading(true);
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dispute_id: selected.id,
        order_id:   selected.order_id,
        resolution: resolution || "Refund approved by admin",
      }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      toaster.create({
        title: "✅ Dispute resolved",
        description: data.tx_hash ? `On-chain tx: ${data.tx_hash.slice(0, 18)}…` : "Fiat refund processed",
        type: "success", duration: 5000,
      });
      setModalOpen(false);
      setSelected(null);
      setResolution("");
      fetchDisputes();
    } else {
      const data = await res.json().catch(() => ({}));
      toaster.create({ title: data.error || "Failed to resolve dispute", type: "error", duration: 4000 });
    }
  }

  const openDisputes     = disputes.filter(d => d.status === "open");
  const resolvedDisputes = disputes.filter(d => d.status === "resolved");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #04080F; --deep: #060B17; --panel: #0D1526;
          --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
          --accent: #3B82F6; --accent2: #2563EB;
          --text: #E8EDF5; --muted: #7B8BAD;
          --green: #10B981; --gold: #F59E0B; --red: #EF4444;
        }
        body { background: var(--deep); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .dash-wrap { display: flex; min-height: 100vh; }
        .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .content { padding: 28px 32px; flex: 1; }

        .sidebar { width: 240px; flex-shrink: 0; background: var(--navy); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
        .sidebar-logo { padding: 28px 24px 20px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; border-bottom: 1px solid var(--border); color: var(--text); text-decoration: none; display: block; }
        .sidebar-logo span { color: var(--accent); }
        .sidebar-user { padding: 16px 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); }
        .avatar { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg,#EF4444,#9333EA); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .user-info { min-width: 0; }
        .user-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 11px; color: var(--red); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; cursor: pointer; font-size: 14px; color: var(--muted); transition: all .15s; border: 1px solid transparent; text-decoration: none; }
        .nav-item:hover { color: var(--text); background: rgba(255,255,255,0.04); }
        .nav-item.active { color: var(--text); background: rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.2); }
        .nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .nav-label { flex: 1; }
        .nav-badge-warn { background: rgba(239,68,68,0.2); color: var(--red); font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 100px; animation: warn-pulse 2s ease infinite; }
        @keyframes warn-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .sidebar-foot { padding: 16px 12px; border-top: 1px solid var(--border); }
        .sign-out { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; cursor: pointer; font-size: 13px; color: var(--muted); transition: all .15s; background: none; border: none; width: 100%; font-family: 'DM Sans', sans-serif; }
        .sign-out:hover { color: var(--red); background: rgba(239,68,68,0.07); }

        .topbar { padding: 20px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--navy); position: sticky; top: 0; z-index: 10; }
        .topbar-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.3px; }
        .topbar-sub { font-size: 13px; color: var(--muted); margin-top: 2px; }

        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
        .stat-card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 20px; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; inset: 0; opacity: 0; background: linear-gradient(135deg,rgba(59,130,246,0.08),transparent); transition: opacity .2s; }
        .stat-card:hover::before { opacity: 1; }
        .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .stat-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 26px; letter-spacing: -0.5px; }
        .stat-sub { font-size: 11px; color: var(--muted); margin-top: 4px; }
        .stat-icon { position: absolute; right: 16px; top: 16px; font-size: 20px; opacity: 0.4; }

        .btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; border: none; white-space: nowrap; }
        .btn-outline { background: transparent; color: var(--muted); border: 1px solid var(--border2); }
        .btn-outline:hover { color: var(--text); border-color: var(--accent); }
        .btn-red { background: rgba(239,68,68,0.12); color: var(--red); border: 1px solid rgba(239,68,68,0.25); }
        .btn-red:hover { background: rgba(239,68,68,0.2); }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        .btn-full-red { width: 100%; padding: 12px; border-radius: 9px; background: rgba(239,68,68,0.12); color: var(--red); border: 1px solid rgba(239,68,68,0.25); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .15s; }
        .btn-full-red:hover { background: rgba(239,68,68,0.2); }
        .btn-full-red:disabled { opacity: 0.5; cursor: not-allowed; }

        .section-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; }

        .dispute-list { display: flex; flex-direction: column; gap: 10px; }
        .dispute-card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; transition: border-color .2s; }
        .dispute-card.open { border-color: rgba(239,68,68,0.25); }
        .dispute-card.resolved { border-color: rgba(16,185,129,0.2); }
        .dispute-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px; }
        .dispute-name { font-weight: 600; font-size: 15px; }
        .dispute-meta { font-size: 13px; color: var(--muted); margin-bottom: 4px; }
        .dispute-reason { font-size: 13px; color: #fca5a5; margin-top: 4px; }
        .dispute-resolution { font-size: 13px; color: #6ee7b7; margin-top: 6px; }
        .tx-box { background: var(--deep); border-radius: 8px; padding: 8px 12px; margin-top: 8px; }
        .tx-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
        .tx-value { font-size: 11px; font-family: monospace; color: #a78bfa; word-break: break-all; }
        .tx-link { color: #a78bfa; text-decoration: underline; font-size: 11px; font-family: monospace; }

        .pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .pill-green { background: rgba(16,185,129,0.12); color: var(--green); }
        .pill-purple { background: rgba(139,92,246,0.12); color: #a78bfa; }
        .pill-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

        .crypto-note { background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2); border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #c4b5fd; margin-bottom: 16px; }

        .empty { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 60px 20px; text-align: center; color: var(--muted); }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 16px; color: var(--text); margin-bottom: 6px; }

        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .15s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal { background: var(--panel); border: 1px solid var(--border2); border-radius: 20px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; padding: 32px; animation: slideUp .2s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .modal-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.3px; }
        .modal-close { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
        .modal-close:hover { border-color: var(--border2); color: var(--text); }
        .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .form-label { font-size: 12px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }
        .form-textarea { background: var(--deep); border: 1px solid var(--border); border-radius: 9px; padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color .2s; width: 100%; resize: vertical; min-height: 100px; }
        .form-textarea:focus { border-color: var(--accent); }
        .form-textarea::placeholder { color: var(--muted); }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .stat-grid { grid-template-columns: repeat(2,1fr); }
          .content { padding: 20px 16px; }
        }
      `}</style>

      <div className="dash-wrap">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <a href="/admin" className="sidebar-logo">🔐 Safe<span>Pay</span></a>

          <div className="sidebar-user">
            <div className="avatar">{session?.user?.name?.[0]?.toUpperCase() ?? 'A'}</div>
            <div className="user-info">
              <div className="user-name">{session?.user?.name ?? 'Admin'}</div>
              <div className="user-role">Admin</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <a href="/admin/disputes" className="nav-item active">
              <span className="nav-icon">⚖️</span>
              <span className="nav-label">Disputes</span>
              {openDisputes.length > 0 && (
                <span className="nav-badge-warn">{openDisputes.length}</span>
              )}
            </a>
            <a href="/admin/users" className="nav-item">
              <span className="nav-icon">👥</span>
              <span className="nav-label">Users</span>
            </a>
          </nav>

          <div className="sidebar-foot">
            <button className="sign-out" onClick={() => signOut({ callbackUrl: '/login' })}>
              <span>🚪</span> Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div>
              <div className="topbar-title">⚖️ Dispute Management</div>
              <div className="topbar-sub">Review and resolve buyer disputes</div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={fetchDisputes} disabled={fetching}>
              {fetching ? 'Loading…' : '↻ Refresh'}
            </button>
          </div>

          <div className="content">
            {/* Stat cards */}
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-label">Total Disputes</div>
                <div className="stat-value">{disputes.length}</div>
                <div className="stat-sub">All time</div>
                <span className="stat-icon">📋</span>
              </div>
              <div className="stat-card">
                <div className="stat-label">Open</div>
                <div className="stat-value" style={{ color: 'var(--red)' }}>{openDisputes.length}</div>
                <div className="stat-sub">Needs attention</div>
                <span className="stat-icon">🔴</span>
              </div>
              <div className="stat-card">
                <div className="stat-label">Resolved</div>
                <div className="stat-value" style={{ color: 'var(--green)' }}>{resolvedDisputes.length}</div>
                <div className="stat-sub">Closed</div>
                <span className="stat-icon">✅</span>
              </div>
              <div className="stat-card">
                <div className="stat-label">Resolution Rate</div>
                <div className="stat-value" style={{ color: 'var(--accent)' }}>
                  {disputes.length > 0 ? Math.round((resolvedDisputes.length / disputes.length) * 100) : 0}%
                </div>
                <div className="stat-sub">Success rate</div>
                <span className="stat-icon">📈</span>
              </div>
            </div>

            {/* Open Disputes */}
            <div className="section-hd">
              <div className="section-title">Open Disputes</div>
            </div>
            <div className="dispute-list" style={{ marginBottom: 28 }}>
              {fetching ? (
                <div className="empty"><div className="empty-icon">⏳</div><div className="empty-title">Loading…</div></div>
              ) : openDisputes.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">🎉</div>
                  <div className="empty-title">No open disputes</div>
                  <div>Everything is running smoothly</div>
                </div>
              ) : openDisputes.map(d => (
                <div key={d.id} className="dispute-card open">
                  <div className="dispute-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="dispute-name">{d.item_name}</div>
                      {isCrypto(d) && <span className="pill pill-purple"><span className="pill-dot" />Crypto</span>}
                    </div>
                    <button className="btn btn-red btn-sm" onClick={() => openResolution(d)}>
                      {isCrypto(d) ? '⛓ Resolve On-Chain' : 'Resolve & Refund'}
                    </button>
                  </div>
                  <div className="dispute-meta">Buyer: <strong>{d.buyer_name}</strong> · Seller: <strong>{d.seller_name}</strong></div>
                  <div className="dispute-meta">Amount: <strong>{Number(d.amount).toLocaleString()} {isCrypto(d) ? 'ETH' : 'RWF'}</strong> · Method: <strong>{(d.payment_method || 'unknown').replace('_', ' ')}</strong></div>
                  <div className="dispute-reason">⚠️ {d.reason}</div>
                </div>
              ))}
            </div>

            {/* Resolved Disputes */}
            {resolvedDisputes.length > 0 && (
              <>
                <div className="section-hd">
                  <div className="section-title">Resolved Disputes</div>
                </div>
                <div className="dispute-list">
                  {resolvedDisputes.map(d => (
                    <div key={d.id} className="dispute-card resolved">
                      <div className="dispute-head">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="dispute-name">{d.item_name}</div>
                          {isCrypto(d) && <span className="pill pill-purple"><span className="pill-dot" />Crypto</span>}
                        </div>
                        <span className="pill pill-green"><span className="pill-dot" />Resolved</span>
                      </div>
                      <div className="dispute-meta">Buyer: <strong>{d.buyer_name}</strong> · Seller: <strong>{d.seller_name}</strong></div>
                      <div className="dispute-meta">Amount: <strong>{Number(d.amount).toLocaleString()} {isCrypto(d) ? 'ETH' : 'RWF'}</strong></div>
                      {d.resolution && <div className="dispute-resolution">↳ {d.resolution}</div>}
                      {d.tx_hash && (
                        <div className="tx-box">
                          <div className="tx-label">On-chain TX</div>
                          <a
                            href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL}/tx/${d.tx_hash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="tx-link"
                          >
                            {d.tx_hash.slice(0, 30)}…
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RESOLVE MODAL */}
      {modalOpen && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-title">
                {selected && isCrypto(selected) ? '⛓ On-Chain Refund' : 'Resolve Dispute'}
              </div>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            {selected && (
              <>
                {isCrypto(selected) && (
                  <div className="crypto-note">
                    ⛓ This will call <strong>refundBuyer()</strong> on the smart contract and return ETH directly to the buyer's wallet. This action is irreversible.
                  </div>
                )}
                <div className="dispute-card open" style={{ marginBottom: 20 }}>
                  <div className="dispute-name" style={{ marginBottom: 6 }}>{selected.item_name}</div>
                  <div className="dispute-meta">Buyer: <strong>{selected.buyer_name}</strong> · Amount: <strong>{Number(selected.amount).toLocaleString()} {isCrypto(selected) ? 'ETH' : 'RWF'}</strong></div>
                  <div className="dispute-reason">⚠️ {selected.reason}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Resolution Notes</label>
                  <textarea
                    className="form-textarea"
                    value={resolution}
                    onChange={e => setResolution(e.target.value)}
                    placeholder="Explain the resolution and reason for refund..."
                  />
                </div>
                <button className="btn-full-red" onClick={handleResolveRefund} disabled={loading}>
                  {loading
                    ? (selected && isCrypto(selected) ? 'Submitting on-chain…' : 'Processing…')
                    : (selected && isCrypto(selected) ? '⛓ Confirm On-Chain Refund' : 'Issue Refund & Close Dispute')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
