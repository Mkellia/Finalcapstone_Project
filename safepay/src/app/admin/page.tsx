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
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const ROLE_COLOR: Record<string, string> = {
  buyer:  '#3B82F6',
  seller: '#10B981',
  admin:  '#EF4444',
};

export default function AdminDashboard() {
  const { data: session } = useSession();

  // disputes state
  const [disputes, setDisputes]     = useState<DisputeExtended[]>([]);
  const [selected, setSelected]     = useState<DisputeExtended | null>(null);
  const [resolution, setResolution] = useState('');
  const [disputeOpen, setDisputeOpen] = useState(false);

  // users state
  const [users, setUsers]           = useState<User[]>([]);
  const [userOpen, setUserOpen]     = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userForm, setUserForm]     = useState({ name: '', email: '', password: '', role: 'buyer' });

  // active tab
  const [tab, setTab] = useState<'disputes' | 'users'>('disputes');

  async function fetchDisputes() {
    const res  = await fetch('/api/disputes');
    const data = await res.json();
    setDisputes(data.disputes || []);
  }

  async function fetchUsers() {
    const res  = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => {
    fetchDisputes();
    fetchUsers();
  }, []);

  // ── Disputes ──────────────────────────────────────────────
  function openResolution(d: DisputeExtended) {
    setSelected(d);
    setDisputeOpen(true);
  }

  async function handleRefund() {
    if (!selected) return;
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dispute_id: selected.id,
        order_id: selected.order_id,
        resolution,
      }),
    });
    if (res.ok) {
      toaster.create({ title: '✅ Refund issued and dispute resolved', type: 'success', duration: 3000 });
      setDisputeOpen(false);
      setResolution('');
      fetchDisputes();
    } else {
      toaster.create({ title: 'Failed to process refund', type: 'error', duration: 3000 });
    }
  }

  // ── Users ─────────────────────────────────────────────────
  const setU = (f: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setUserForm(prev => ({ ...prev, [f]: e.target.value }));

  async function handleCreateUser() {
    setUserLoading(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm),
    });
    setUserLoading(false);

    if (res.ok) {
      toaster.create({ title: 'User created successfully', type: 'success', duration: 3000 });
      setUserOpen(false);
      setUserForm({ name: '', email: '', password: '', role: 'buyer' });
      fetchUsers();
    } else {
      const data = await res.json();
      toaster.create({ title: data.error || 'Failed to create user', type: 'error', duration: 3000 });
    }
  }

  async function handleDeleteUser(id: string) {
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toaster.create({ title: 'User removed', type: 'info', duration: 2000 });
      fetchUsers();
    }
  }

  // ── Stats ─────────────────────────────────────────────────
  const openDisputes     = disputes.filter(d => d.status === 'open');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy:   #04080F; --deep: #060B17; --panel: #0D1526; --card: #0F1A2E;
          --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
          --accent: #3B82F6; --accent2: #2563EB;
          --text: #E8EDF5; --muted: #7B8BAD;
          --green: #10B981; --gold: #F59E0B; --red: #EF4444;
        }
        body { background: var(--deep); color: var(--text); font-family: 'DM Sans', sans-serif; }

        /* LAYOUT */
        .dash-wrap  { display: flex; min-height: 100vh; }
        .main       { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .content    { padding: 28px 32px; flex: 1; }

        /* SIDEBAR */
        .sidebar { width: 240px; flex-shrink: 0; background: var(--navy); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
        .sidebar-logo { padding: 28px 24px 20px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; border-bottom: 1px solid var(--border); }
        .sidebar-logo span { color: var(--accent); }
        .sidebar-user { padding: 16px 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); }
        .avatar { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg,#EF4444,#9333EA); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .user-info  { min-width: 0; }
        .user-name  { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role  { font-size: 11px; color: var(--red); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; cursor: pointer; font-size: 14px; color: var(--muted); transition: all .15s; border: 1px solid transparent; user-select: none; }
        .nav-item:hover { color: var(--text); background: rgba(255,255,255,0.04); }
        .nav-item.active { color: var(--text); background: rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.2); }
        .nav-icon  { font-size: 16px; width: 20px; text-align: center; }
        .nav-label { flex: 1; }
        .nav-badge-warn { background: rgba(239,68,68,0.2); color: var(--red); font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 100px; animation: warn-pulse 2s ease infinite; }
        @keyframes warn-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .sidebar-foot { padding: 16px 12px; border-top: 1px solid var(--border); }
        .sign-out { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; cursor: pointer; font-size: 13px; color: var(--muted); transition: all .15s; background: none; border: none; width: 100%; font-family: 'DM Sans', sans-serif; }
        .sign-out:hover { color: var(--red); background: rgba(239,68,68,0.07); }

        /* TOPBAR */
        .topbar { padding: 20px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--navy); position: sticky; top: 0; z-index: 10; }
        .topbar-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.3px; }
        .topbar-sub   { font-size: 13px; color: var(--muted); margin-top: 2px; }

        /* STAT CARDS */
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
        .stat-card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 20px; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; inset: 0; opacity: 0; background: linear-gradient(135deg,rgba(59,130,246,0.08),transparent); transition: opacity .2s; }
        .stat-card:hover::before { opacity: 1; }
        .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .stat-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 26px; letter-spacing: -0.5px; }
        .stat-sub   { font-size: 11px; color: var(--muted); margin-top: 4px; }
        .stat-icon  { position: absolute; right: 16px; top: 16px; font-size: 20px; opacity: 0.4; }

        /* BUTTONS */
        .btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; border: none; white-space: nowrap; }
        .btn-blue   { background: var(--accent); color: #fff; box-shadow: 0 0 20px rgba(59,130,246,0.25); }
        .btn-blue:hover   { background: var(--accent2); transform: translateY(-1px); }
        .btn-red    { background: rgba(239,68,68,0.12); color: var(--red); border: 1px solid rgba(239,68,68,0.25); }
        .btn-red:hover    { background: rgba(239,68,68,0.2); }
        .btn-outline { background: transparent; color: var(--muted); border: 1px solid var(--border2); }
        .btn-outline:hover { color: var(--text); border-color: var(--accent); }
        .btn-ghost-red { background: transparent; color: var(--muted); border: 1px solid var(--border); font-size: 12px; padding: 5px 10px; border-radius: 7px; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .15s; }
        .btn-ghost-red:hover { color: var(--red); border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.06); }
        .btn-full-red { width: 100%; padding: 12px; border-radius: 9px; background: rgba(239,68,68,0.12); color: var(--red); border: 1px solid rgba(239,68,68,0.25); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .15s; }
        .btn-full-red:hover { background: rgba(239,68,68,0.2); }
        .btn-full-blue { width: 100%; padding: 12px; border-radius: 9px; background: var(--accent); color: #fff; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .15s; }
        .btn-full-blue:hover { background: var(--accent2); transform: translateY(-1px); }
        .btn-full-blue:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-sm { padding: 6px 12px; font-size: 12px; }

        /* DISPUTE CARDS */
        .dispute-list { display: flex; flex-direction: column; gap: 10px; }
        .dispute-card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; transition: border-color .2s; }
        .dispute-card.open     { border-color: rgba(239,68,68,0.25); }
        .dispute-card.resolved { border-color: rgba(16,185,129,0.2); }
        .dispute-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .dispute-name { font-weight: 600; font-size: 15px; }
        .dispute-meta { font-size: 13px; color: var(--muted); margin-bottom: 6px; }
        .dispute-reason { font-size: 13px; color: #fca5a5; }
        .dispute-resolution { font-size: 13px; color: #6ee7b7; margin-top: 6px; }

        /* STATUS PILL */
        .pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .pill-red   { background: rgba(239,68,68,0.12);  color: var(--red); }
        .pill-green { background: rgba(16,185,129,0.12); color: var(--green); }
        .pill-blue  { background: rgba(59,130,246,0.12); color: var(--accent); }
        .pill-gold  { background: rgba(245,158,11,0.12); color: var(--gold); }
        .pill-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

        /* USERS TABLE */
        .users-box { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .users-head { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .users-head-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
        .user-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--border); transition: background .15s; }
        .user-row:last-child { border-bottom: none; }
        .user-row:hover { background: rgba(255,255,255,0.02); }
        .user-avatar { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .user-details { display: flex; align-items: center; gap: 12px; }
        .user-row-name  { font-size: 14px; font-weight: 500; }
        .user-row-email { font-size: 12px; color: var(--muted); }
        .user-row-right { display: flex; align-items: center; gap: 12px; }
        .user-date { font-size: 11px; color: var(--muted); }

        /* EMPTY */
        .empty { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 60px 20px; text-align: center; color: var(--muted); }
        .empty-icon  { font-size: 40px; margin-bottom: 12px; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 16px; color: var(--text); margin-bottom: 6px; }

        /* SECTION HEADER */
        .section-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; }

        /* MODAL */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .15s ease; }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        .modal { background: var(--panel); border: 1px solid var(--border2); border-radius: 20px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; padding: 32px; animation: slideUp .2s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .modal-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.3px; }
        .modal-close { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
        .modal-close:hover { border-color: var(--border2); color: var(--text); }
        .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .form-label { font-size: 12px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }
        .form-input, .form-select, .form-textarea { background: var(--deep); border: 1px solid var(--border); border-radius: 9px; padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color .2s; width: 100%; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
        .form-select option { background: #0D1526; }
        .form-textarea { resize: vertical; min-height: 100px; }

        /* DIVIDER */
        .divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .stat-grid { grid-template-columns: repeat(2,1fr); }
          .content { padding: 20px 16px; }
        }
      `}</style>

      <div className="dash-wrap">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">🔐 Safe<span>Pay</span></div>

          <div className="sidebar-user">
            <div className="avatar">{session?.user?.name?.[0]?.toUpperCase() ?? 'A'}</div>
            <div className="user-info">
              <div className="user-name">{session?.user?.name ?? 'Admin'}</div>
              <div className="user-role">Admin</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <a href="/admin/disputes" className={`nav-item ${tab === 'disputes' ? 'active' : ''}`} style={{ textDecoration: 'none' }} onClick={e => { e.preventDefault(); setTab('disputes'); }}>
              <span className="nav-icon">⚖️</span>
              <span className="nav-label">Disputes</span>
              {openDisputes.length > 0 && (
                <span className="nav-badge-warn">{openDisputes.length}</span>
              )}
            </a>
            <a href="/admin/users" className={`nav-item ${tab === 'users' ? 'active' : ''}`} style={{ textDecoration: 'none' }} onClick={e => { e.preventDefault(); setTab('users'); }}>
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

        {/* ── MAIN ── */}
        <div className="main">

          {/* TOPBAR */}
          <div className="topbar">
            {tab === 'disputes' ? (
              <div>
                <div className="topbar-title">🛡️ Dispute Management</div>
                <div className="topbar-sub">Review and resolve buyer disputes</div>
              </div>
            ) : (
              <div>
                <div className="topbar-title">👥 User Management</div>
                <div className="topbar-sub">Create and manage platform users</div>
              </div>
            )}
          </div>

          <div className="content">

            {/* ── DISPUTES TAB ── */}
            {tab === 'disputes' && (
              <>
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

                {/* Open disputes */}
                <div className="section-hd">
                  <div className="section-title">Open Disputes</div>
                </div>
                <div className="dispute-list" style={{ marginBottom: 28 }}>
                  {openDisputes.length === 0 ? (
                    <div className="empty">
                      <div className="empty-icon">🎉</div>
                      <div className="empty-title">No open disputes</div>
                      <div>Everything is running smoothly</div>
                    </div>
                  ) : openDisputes.map(d => (
                    <div key={d.id} className="dispute-card open">
                      <div className="dispute-head">
                        <div className="dispute-name">{d.item_name}</div>
                        <button className="btn btn-red btn-sm" onClick={() => openResolution(d)}>
                          Resolve &amp; Refund
                        </button>
                      </div>
                      <div className="dispute-meta">
                        Buyer: <strong>{d.buyer_name}</strong> · Seller: <strong>{d.seller_name}</strong> · Amount: <strong>{d.amount?.toLocaleString()} RWF</strong>
                      </div>
                      <div className="dispute-reason">⚠️ {d.reason}</div>
                    </div>
                  ))}
                </div>

                {/* Resolved disputes */}
                {resolvedDisputes.length > 0 && (
                  <>
                    <div className="section-hd">
                      <div className="section-title">Resolved Disputes</div>
                    </div>
                    <div className="dispute-list">
                      {resolvedDisputes.map(d => (
                        <div key={d.id} className="dispute-card resolved">
                          <div className="dispute-head">
                            <div className="dispute-name">{d.item_name}</div>
                            <span className="pill pill-green"><span className="pill-dot" />Resolved</span>
                          </div>
                          <div className="dispute-meta">
                            Buyer: <strong>{d.buyer_name}</strong> · Amount: <strong>{d.amount?.toLocaleString()} RWF</strong>
                          </div>
                          {d.resolution && (
                            <div className="dispute-resolution">↳ {d.resolution}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── USERS TAB ── */}
            {tab === 'users' && (
              <>
                {/* Stat cards */}
                <div className="stat-grid">
                  <div className="stat-card">
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">{users.length}</div>
                    <div className="stat-sub">Registered</div>
                    <span className="stat-icon">👤</span>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Buyers</div>
                    <div className="stat-value" style={{ color: 'var(--accent)' }}>
                      {users.filter(u => u.role === 'buyer').length}
                    </div>
                    <div className="stat-sub">Active buyers</div>
                    <span className="stat-icon">🛒</span>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Sellers</div>
                    <div className="stat-value" style={{ color: 'var(--green)' }}>
                      {users.filter(u => u.role === 'seller').length}
                    </div>
                    <div className="stat-sub">Active sellers</div>
                    <span className="stat-icon">🏪</span>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Admins</div>
                    <div className="stat-value" style={{ color: 'var(--red)' }}>
                      {users.filter(u => u.role === 'admin').length}
                    </div>
                    <div className="stat-sub">Platform admins</div>
                    <span className="stat-icon">🛡️</span>
                  </div>
                </div>

                {/* Users table */}
                <div className="users-box">
                  <div className="users-head">
                    <div className="users-head-title">All Users ({users.length})</div>
                    <button className="btn btn-blue btn-sm" onClick={() => setUserOpen(true)}>
                      + Add User
                    </button>
                  </div>
                  {users.length === 0 ? (
                    <div className="empty" style={{ borderRadius: 0 }}>
                      <div className="empty-icon">👤</div>
                      <div className="empty-title">No users found</div>
                    </div>
                  ) : users.map(u => (
                    <div key={u.id} className="user-row">
                      <div className="user-details">
                        <div className="user-avatar" style={{
                          background: `linear-gradient(135deg, ${ROLE_COLOR[u.role] ?? '#3B82F6'}44, ${ROLE_COLOR[u.role] ?? '#3B82F6'}22)`,
                          border: `1px solid ${ROLE_COLOR[u.role] ?? '#3B82F6'}33`,
                          color: ROLE_COLOR[u.role] ?? '#3B82F6',
                        }}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="user-row-name">{u.name}</div>
                          <div className="user-row-email">{u.email}</div>
                        </div>
                      </div>
                      <div className="user-row-right">
                        <span className="pill" style={{
                          background: `${ROLE_COLOR[u.role] ?? '#3B82F6'}18`,
                          color: ROLE_COLOR[u.role] ?? '#3B82F6',
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                        <span className="user-date">{new Date(u.created_at).toLocaleDateString()}</span>
                        <button className="btn-ghost-red" onClick={() => handleDeleteUser(u.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* ── RESOLVE DISPUTE MODAL ── */}
      {disputeOpen && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setDisputeOpen(false); }}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-title">Resolve Dispute</div>
              <button className="modal-close" onClick={() => setDisputeOpen(false)}>✕</button>
            </div>
            {selected && (
              <>
                <div className="dispute-card open" style={{ marginBottom: 20 }}>
                  <div className="dispute-name" style={{ marginBottom: 6 }}>{selected.item_name}</div>
                  <div className="dispute-meta">
                    Buyer: <strong>{selected.buyer_name}</strong> · Amount: <strong>{selected.amount?.toLocaleString()} RWF</strong>
                  </div>
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
                <button className="btn-full-red" onClick={handleRefund}>
                  Issue Refund &amp; Close Dispute
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── CREATE USER MODAL ── */}
      {userOpen && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setUserOpen(false); }}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-title">Create New User</div>
              <button className="modal-close" onClick={() => setUserOpen(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={userForm.name} onChange={setU('name')} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={userForm.email} onChange={setU('email')} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={userForm.password} onChange={setU('password')} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={userForm.role} onChange={setU('role')}>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn-full-blue" onClick={handleCreateUser} disabled={userLoading}>
              {userLoading ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}