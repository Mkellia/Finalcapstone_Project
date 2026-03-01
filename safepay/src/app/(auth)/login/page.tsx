"use client";
import NextLink from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      toaster.create({ title: 'Invalid credentials', type: 'error', duration: 3000 });
    } else {
      router.push('/');
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:   #04080F;
          --panel:  #0D1526;
          --border: rgba(255,255,255,0.08);
          --accent: #3B82F6;
          --text:   #E8EDF5;
          --muted:  #7B8BAD;
          --green:  #10B981;
          --input-bg: #080D1A;
        }

        body { background: var(--navy); font-family: 'DM Sans', sans-serif; }

        .auth-wrap {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* ── LEFT PANEL ── */
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
          width: 400px; height: 400px;
          background: rgba(37,99,235,0.15);
          top: -100px; right: -100px;
        }
        .auth-left-glow2 {
          position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none;
          width: 300px; height: 300px;
          background: rgba(16,185,129,0.07);
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

        .perks { display: flex; flex-direction: column; gap: 14px; }
        .perk { display: flex; align-items: center; gap: 12px; }
        .perk-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .perk-text { font-size: 13px; color: var(--muted); }
        .perk-text strong { color: var(--text); display: block; font-size: 14px; margin-bottom: 1px; }

        .auth-left-foot { position: relative; font-size: 12px; color: rgba(123,139,173,0.5); }

        /* ── RIGHT PANEL ── */
        .auth-right {
          background: var(--navy);
          display: flex; align-items: center; justify-content: center;
          padding: 48px 32px;
        }
        .auth-card { width: 100%; max-width: 400px; }
        .auth-card-head { margin-bottom: 36px; }
        .auth-card-head h2 {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 26px; letter-spacing: -0.5px; color: var(--text); margin-bottom: 6px;
        }
        .auth-card-head p { font-size: 14px; color: var(--muted); }

        .field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; }
        .field label { font-size: 13px; font-weight: 500; color: var(--text); }
        .field input {
          background: var(--input-bg); border: 1px solid var(--border);
          border-radius: 9px; padding: 12px 14px;
          color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; transition: border-color .2s;
          width: 100%;
        }
        .field input::placeholder { color: var(--muted); }
        .field input:focus { border-color: var(--accent); }

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

        .auth-footer { margin-top: 24px; text-align: center; font-size: 13px; color: var(--muted); }
        .auth-footer a { color: var(--accent); text-decoration: none; font-weight: 500; }
        .auth-footer a:hover { text-decoration: underline; }

        .divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

        @media (max-width: 768px) {
          .auth-wrap { grid-template-columns: 1fr; }
          .auth-left  { display: none; }
          .auth-right { padding: 32px 24px; align-items: flex-start; padding-top: 60px; }
        }
      `}</style>

      <div className="auth-wrap">
        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-left-glow" />
          <div className="auth-left-glow2" />
          <NextLink href="/" className="auth-logo">Safe<span>Pay</span></NextLink>

          <div className="auth-left-body">
            <h1>Trade with <em>complete</em> confidence</h1>
            <p>Your payments are held in escrow until you confirm delivery. No risk, no fraud — just secure commerce.</p>

            <div className="perks">
              {[
                { icon: '🔐', title: 'Smart contract escrow', desc: 'Funds locked on-chain until you confirm' },
                { icon: '⚡', title: 'OTP-based release',      desc: 'You control when payments are released' },
                { icon: '🛡️', title: 'Dispute protection',     desc: 'Admin mediation for every conflict' },
              ].map(p => (
                <div className="perk" key={p.title}>
                  <div className="perk-icon">{p.icon}</div>
                  <div className="perk-text"><strong>{p.title}</strong>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-left-foot">© 2025 SafePay · Sepolia Testnet</div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-head">
              <h2>Welcome back</h2>
              <p>Sign in to your SafePay account</p>
            </div>

            <div className="field">
              <label>Email address</label>
              <input
                type="email" value={email} placeholder="you@example.com"
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password" value={password} placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <button className="btn-submit" onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>

            <hr className="divider" />

            <p className="auth-footer">
              No account?{' '}
              <NextLink href="/register">Create one for free</NextLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}