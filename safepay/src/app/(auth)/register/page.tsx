"use client";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    if (!form.name || !form.email || !form.password || !form.phone) {
      toaster.create({ title: 'All fields are required', type: 'error', duration: 3000 });
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (res.ok) {
      toaster.create({ title: '🎉 Account created! Please sign in.', type: 'success', duration: 3000 });
      router.push('/login');
    } else {
      const data = await res.json();
      toaster.create({ title: data.error || 'Registration failed', type: 'error', duration: 3000 });
    }
  }

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:     #04080F;
          --panel:    #0D1526;
          --border:   rgba(255,255,255,0.08);
          --accent:   #3B82F6;
          --text:     #E8EDF5;
          --muted:    #7B8BAD;
          --green:    #10B981;
          --input-bg: #080D1A;
        }

        body { background: var(--navy); font-family: 'DM Sans', sans-serif; }

        .auth-wrap {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .auth-left {
          background: linear-gradient(160deg, #0a1628 0%, #04080F 100%);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative; overflow: hidden;
        }
        .auth-left-glow {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
          width: 400px; height: 400px; background: rgba(37,99,235,0.15);
          top: -100px; right: -100px;
        }
        .auth-left-glow2 {
          position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none;
          width: 300px; height: 300px; background: rgba(16,185,129,0.07);
          bottom: 0; left: -80px;
        }
        .auth-logo {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 24px; color: var(--text); text-decoration: none;
          letter-spacing: -0.5px; position: relative;
        }
        .auth-logo span { color: var(--accent); }

        .auth-left-body { position: relative; }
        .auth-left-body h1 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 38px; line-height: 1.1; letter-spacing: -1.5px;
          color: var(--text); margin-bottom: 18px;
        }
        .auth-left-body h1 em { font-style: normal; color: var(--accent); }
        .auth-left-body p { font-size: 15px; color: var(--muted); line-height: 1.65; max-width: 340px; margin-bottom: 40px; }

        .role-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .role-card {
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          border-radius: 12px; padding: 18px 16px;
        }
        .role-card-icon { font-size: 24px; margin-bottom: 8px; }
        .role-card h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 4px; }
        .role-card p  { font-size: 12px; color: var(--muted); line-height: 1.5; }

        .auth-left-foot { position: relative; font-size: 12px; color: rgba(123,139,173,0.5); }

        .auth-right {
          background: var(--navy);
          display: flex; align-items: center; justify-content: center;
          padding: 48px 32px;
        }
        .auth-card { width: 100%; max-width: 420px; }
        .auth-card-head { margin-bottom: 30px; }
        .auth-card-head h2 {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 26px; letter-spacing: -0.5px; color: var(--text); margin-bottom: 6px;
        }
        .auth-card-head p { font-size: 14px; color: var(--muted); }

        .field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
        .field label { font-size: 13px; font-weight: 500; color: var(--text); }
        .field input, .field select {
          background: var(--input-bg); border: 1px solid var(--border);
          border-radius: 9px; padding: 12px 14px;
          color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; transition: border-color .2s; width: 100%;
        }
        .field input::placeholder { color: var(--muted); }
        .field input:focus, .field select:focus { border-color: var(--accent); }
        .field select option { background: #0D1526; }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .phone-wrap { display: flex; gap: 0; }
        .phone-prefix {
          background: var(--panel); border: 1px solid var(--border); border-right: none;
          border-radius: 9px 0 0 9px; padding: 12px 14px;
          font-size: 14px; color: var(--muted); white-space: nowrap;
          display: flex; align-items: center;
        }
        .phone-wrap input {
          border-radius: 0 9px 9px 0 !important;
          flex: 1;
        }

        /* role toggle */
        .role-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .role-btn {
          padding: 11px; border-radius: 9px; border: 1px solid var(--border);
          background: var(--input-bg); color: var(--muted);
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all .2s; text-align: center;
        }
        .role-btn.active {
          border-color: var(--accent); background: rgba(59,130,246,0.12);
          color: var(--text);
        }

        .btn-submit {
          width: 100%; padding: 13px;
          background: var(--accent); color: #fff; border: none;
          border-radius: 9px; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500; cursor: pointer;
          transition: background .2s, transform .15s, opacity .2s;
          box-shadow: 0 0 28px rgba(59,130,246,0.3);
          margin-top: 4px;
        }
        .btn-submit:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-footer { margin-top: 20px; text-align: center; font-size: 13px; color: var(--muted); }
        .auth-footer a { color: var(--accent); text-decoration: none; font-weight: 500; }
        .auth-footer a:hover { text-decoration: underline; }

        .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
        .field-label-sub { font-size: 11px; color: var(--muted); margin-top: -4px; }

        @media (max-width: 768px) {
          .auth-wrap { grid-template-columns: 1fr; }
          .auth-left  { display: none; }
          .auth-right { padding: 32px 24px; align-items: flex-start; padding-top: 60px; }
          .field-row  { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="auth-wrap">
        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-left-glow" />
          <div className="auth-left-glow2" />
          <NextLink href="/" className="auth-logo">Safe<span>Pay</span></NextLink>

          <div className="auth-left-body">
            <h1>Join <em>thousands</em> trading safely</h1>
            <p>Whether you're buying or selling, SafePay keeps every transaction protected from start to finish.</p>

            <div className="role-cards">
              <div className="role-card">
                <div className="role-card-icon">🛒</div>
                <h3>As a Buyer</h3>
                <p>Browse products and pay only when your item arrives safely.</p>
              </div>
              <div className="role-card">
                <div className="role-card-icon">🛍️</div>
                <h3>As a Seller</h3>
                <p>List products and get paid securely with zero chargeback risk.</p>
              </div>
            </div>
          </div>

          <div className="auth-left-foot">© 2025 SafePay · Sepolia Testnet</div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-head">
              <h2>Create your account</h2>
              <p>Get started with SafePay in seconds</p>
            </div>

            {/* Role toggle */}
            <p className="field-label-sub" style={{ marginBottom: 10, fontSize: 13, color: 'var(--text)' }}>I want to</p>
            <div className="role-toggle">
              <button
                className={`role-btn ${form.role === 'buyer' ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, role: 'buyer' }))}>
                🛒 Buy Products
              </button>
              <button
                className={`role-btn ${form.role === 'seller' ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, role: 'seller' }))}>
                🛍️ Sell Products
              </button>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Full Name</label>
                <input value={form.name} onChange={set('name')} placeholder="Kellia Muzira" />
              </div>
              <div className="field">
                <label>Email address</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
              </div>
            </div>

            <div className="field">
              <label>Phone number</label>
              <div className="phone-wrap">
                <span className="phone-prefix">🇷🇼 +250</span>
                <input
                  type="tel" value={form.phone} onChange={set('phone')}
                  placeholder="7XX XXX XXX"
                />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password" value={form.password} onChange={set('password')}
                placeholder="Min. 8 characters"
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
              />
            </div>

            <button className="btn-submit" onClick={handleRegister} disabled={loading}>
              {loading ? 'Creating account…' : `Create ${form.role === 'seller' ? 'Seller' : 'Buyer'} Account →`}
            </button>

            <hr className="divider" />

            <p className="auth-footer">
              Already have an account?{' '}
              <NextLink href="/login">Sign in</NextLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}