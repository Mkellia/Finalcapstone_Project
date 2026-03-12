"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const ROLE_COLOR: Record<string, string> = {
  buyer: '#3B82F6', seller: '#10B981', admin: '#EF4444',
};

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers]         = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm]           = useState({ name: '', email: '', password: '', role: 'buyer' });

  async function fetchUsers() {
    const res  = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => { fetchUsers(); }, []);

  const set = (f: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [f]: e.target.value }));

  async function handleCreate() {
    setLoading(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      toaster.create({ title: 'User created successfully', type: 'success', duration: 3000 });
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', role: 'buyer' });
      fetchUsers();
    } else {
      const data = await res.json();
      toaster.create({ title: data.error || 'Failed to create user', type: 'error', duration: 3000 });
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toaster.create({ title: 'User deleted', type: 'info', duration: 2000 });
      fetchUsers();
    } else {
      const data = await res.json().catch(() => ({}));
      toaster.create({ title: data.error || 'Failed to delete user', type: 'error', duration: 3000 });
    }
  }

  const buyers  = users.filter(u => u.role === 'buyer').length;
  const sellers = users.filter(u => u.role === 'seller').length;
  const admins  = users.filter(u => u.role === 'admin').length;

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
        .btn-blue { background: var(--accent); color: #fff; box-shadow: 0 0 20px rgba(59,130,246,0.25); }
        .btn-blue:hover { background: var(--accent2); transform: translateY(-1px); }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        .btn-ghost-red { background: transparent; color: var(--muted); border: 1px solid var(--border); font-size: 12px; padding: 5px 10px; border-radius: 7px; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .15s; }
        .btn-ghost-red:hover { color: var(--red); border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.06); }
        .btn-full-blue { width: 100%; padding: 12px; border-radius: 9px; background: var(--accent); color: #fff; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .15s; }
        .btn-full-blue:hover { background: var(--accent2); transform: translateY(-1px); }
        .btn-full-blue:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .users-box { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .users-head { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .users-head-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
        .user-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--border); transition: background .15s; }
        .user-row:last-child { border-bottom: none; }
        .user-row:hover { background: rgba(255,255,255,0.02); }
        .user-avatar { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .user-details { display: flex; align-items: center; gap: 12px; }
        .user-row-name { font-size: 14px; font-weight: 500; }
        .user-row-email { font-size: 12px; color: var(--muted); }
        .user-row-right { display: flex; align-items: center; gap: 12px; }
        .user-date { font-size: 11px; color: var(--muted); }
        .pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

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
        .form-input, .form-select { background: var(--deep); border: 1px solid var(--border); border-radius: 9px; padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color .2s; width: 100%; }
        .form-input:focus, .form-select:focus { border-color: var(--accent); }
        .form-input::placeholder { color: var(--muted); }
        .form-select option { background: #0D1526; }

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
            <a href="/admin/disputes" className="nav-item">
              <span className="nav-icon">⚖️</span>
              <span className="nav-label">Disputes</span>
            </a>
            <a href="/admin/users" className="nav-item active">
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
              <div className="topbar-title">👥 User Management</div>
              <div className="topbar-sub">Create and manage platform users</div>
            </div>
            <button className="btn btn-blue btn-sm" onClick={() => setModalOpen(true)}>
              + Add User
            </button>
          </div>

          <div className="content">
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
                <div className="stat-value" style={{ color: 'var(--accent)' }}>{buyers}</div>
                <div className="stat-sub">Active buyers</div>
                <span className="stat-icon">🛒</span>
              </div>
              <div className="stat-card">
                <div className="stat-label">Sellers</div>
                <div className="stat-value" style={{ color: 'var(--green)' }}>{sellers}</div>
                <div className="stat-sub">Active sellers</div>
                <span className="stat-icon">🏪</span>
              </div>
              <div className="stat-card">
                <div className="stat-label">Admins</div>
                <div className="stat-value" style={{ color: 'var(--red)' }}>{admins}</div>
                <div className="stat-sub">Platform admins</div>
                <span className="stat-icon">🛡️</span>
              </div>
            </div>

            {/* Users table */}
            <div className="users-box">
              <div className="users-head">
                <div className="users-head-title">All Users ({users.length})</div>
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
                    <button className="btn-ghost-red" onClick={() => handleDelete(u.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {modalOpen && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-title">Create New User</div>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={set('name')} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={set('role')}>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn-full-blue" onClick={handleCreate} disabled={loading}>
              {loading ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
