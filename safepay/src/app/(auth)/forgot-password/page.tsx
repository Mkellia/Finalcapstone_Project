"use client";
import NextLink from "next/link";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  async function handleSubmit() {
    if (!email) {
      toaster.create({ title: 'Please enter your email address', type: 'error', duration: 3000 });
      return;
    }
    setLoading(true);
    await fetch('/api/auth/forgot-password', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

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
        .auth-left-body p { font-size: 15px; color: var(--muted); line-height: 1.65; max-width: 340px; }

        .auth-left-foot { position: relative; font-size: 12px; color: rgba(123,139,173,0.5); }

        .auth-right {
          background: var(--navy);
          display: flex; align-items: center; justify-content: center;
          padding: 48px 32px;
        }
        .auth-card { width: 100%; max-width: 400px; }
        .auth-card-head { margin-bottom: 30px; }
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
          outline: none; transition: border-color .2s; width: 100%;
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
        }
        .btn-submit:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-footer { margin-top: 20px; text-align: center; font-size: 13px; color: var(--muted); }
        .auth-footer a { color: var(--accent); text-decoration: none; font-weight: 500; }
        .auth-footer a:hover { text-decoration: underline; }

        .success-box {
          background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25);
          border-radius: 12px; padding: 24px; text-align: center;
        }
        .success-icon { font-size: 40px; margin-bottom: 12px; }
        .success-box h3 {
          font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700;
          color: var(--green); margin-bottom: 8px;
        }
        .success-box p { font-size: 14px; color: var(--muted); line-height: 1.6; }

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
            <h1>Reset your <em>password</em></h1>
            <p>Enter the email address linked to your SafePay account. We&apos;ll send you a secure link to choose a new password.</p>
          </div>

          <div className="auth-left-foot">© 2026 SafePay · Sepolia Testnet</div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-card">
            {sent ? (
              <div className="success-box">
                <div className="success-icon">📧</div>
                <h3>Check your inbox</h3>
                <p>
                  If <strong style={{ color: 'var(--text)' }}>{email}</strong> is registered,
                  you&apos;ll receive a reset link shortly. The link expires in 1 hour.
                </p>
                <p style={{ marginTop: 12 }}>
                  Didn&apos;t get it? Check your spam folder or{' '}
                  <button
                    onClick={() => setSent(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: 0 }}>
                    try again
                  </button>.
                </p>
              </div>
            ) : (
              <>
                <div className="auth-card-head">
                  <h2>Forgot password?</h2>
                  <p>We&apos;ll email you a secure reset link</p>
                </div>

                <div className="field">
                  <label>Email address</label>
                  <input
                    type="email" value={email} placeholder="you@example.com"
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  />
                </div>

                <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Sending…' : 'Send Reset Link →'}
                </button>
              </>
            )}

            <p className="auth-footer">
              Remembered it?{' '}
              <NextLink href="/login">Back to Sign In</NextLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
