"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
}

export default function LandingPage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const orders   = useCountUp(12480, 1600, statsVisible);
  const sellers  = useCountUp(3200,  1400, statsVisible);
  const disputes = useCountUp(99,    1200, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:   #04080F;
          --deep:   #080D1A;
          --panel:  #0D1526;
          --border: rgba(255,255,255,0.08);
          --glow:   #2563EB;
          --accent: #3B82F6;
          --gold:   #F59E0B;
          --text:   #E8EDF5;
          --muted:  #7B8BAD;
          --green:  #10B981;
        }

        body { background: var(--navy); color: var(--text); font-family: 'DM Sans', sans-serif; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 48px;
          background: rgba(4,8,15,0.72);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; letter-spacing: -0.5px; }
        .nav-logo span { color: var(--accent); }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a { color: var(--muted); text-decoration: none; font-size: 14px; transition: color .2s; }
        .nav-links a:hover { color: var(--text); }
        .nav-actions { display: flex; gap: 12px; align-items: center; }
        .btn-ghost {
          background: transparent; border: 1px solid var(--border);
          color: var(--text); padding: 9px 22px; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer;
          text-decoration: none; transition: border-color .2s, background .2s;
          display: inline-block;
        }
        .btn-ghost:hover { border-color: var(--accent); background: rgba(37,99,235,0.1); }
        .btn-primary {
          background: var(--accent); color: #fff;
          padding: 9px 22px; border-radius: 8px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; text-decoration: none; transition: background .2s, transform .15s;
          box-shadow: 0 0 24px rgba(59,130,246,0.35);
          display: inline-block;
        }
        .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }

        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 24px 80px;
          position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 900px 500px at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 600px 400px at 80% 80%, rgba(245,158,11,0.06) 0%, transparent 60%);
        }
        .hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
        }
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(37,99,235,0.15); border: 1px solid rgba(59,130,246,0.3);
          padding: 6px 16px; border-radius: 100px;
          font-size: 12px; font-weight: 500; color: var(--accent);
          margin-bottom: 28px; letter-spacing: 0.5px;
        }
        .badge-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{ opacity:1; transform:scale(1);} 50%{ opacity:.5; transform:scale(1.4);} }

        .hero h1 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(40px, 7vw, 82px); line-height: 1.05;
          letter-spacing: -2px; max-width: 860px; position: relative;
        }
        .hero h1 .highlight { color: var(--accent); }
        .hero h1 .strike { position: relative; color: var(--muted); }
        .hero h1 .strike::after {
          content: ''; position: absolute; left: 0; right: 0; top: 52%;
          height: 3px; background: var(--gold); border-radius: 2px;
        }
        .hero-sub {
          font-size: 18px; color: var(--muted); max-width: 540px;
          line-height: 1.65; margin: 24px auto 40px; position: relative;
        }
        .hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; position: relative; }
        .btn-lg { padding: 15px 36px; font-size: 16px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-weight: 500; }

        .trust-row {
          display: flex; gap: 24px; margin-top: 64px; flex-wrap: wrap; justify-content: center;
          position: relative;
        }
        .trust-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); }

        .section { padding: 100px 24px; max-width: 1100px; margin: 0 auto; }
        .section-label {
          font-size: 11px; font-weight: 600; letter-spacing: 3px;
          color: var(--accent); text-transform: uppercase; margin-bottom: 14px;
        }
        .section-title {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: clamp(28px, 4vw, 46px); letter-spacing: -1px; line-height: 1.1;
          margin-bottom: 16px;
        }
        .section-sub { color: var(--muted); font-size: 16px; max-width: 500px; line-height: 1.65; margin-bottom: 60px; }

        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2px; }
        .step {
          background: var(--panel); padding: 36px 28px;
          position: relative; overflow: hidden; transition: background .2s;
        }
        .step:first-child { border-radius: 16px 0 0 16px; }
        .step:last-child  { border-radius: 0 16px 16px 0; }
        .step:hover { background: #111c33; }
        .step-num {
          font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800;
          color: rgba(59,130,246,0.12); position: absolute; top: 12px; right: 16px; line-height: 1;
        }
        .step-icon { font-size: 28px; margin-bottom: 16px; }
        .step h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 17px; margin-bottom: 8px; }
        .step p { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .connector { display: flex; align-items: center; justify-content: center; background: var(--panel); }
        .connector::after { content: '→'; color: var(--accent); font-size: 20px; }

        .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .feature-card {
          background: var(--panel); border: 1px solid var(--border);
          border-radius: 16px; padding: 28px; transition: border-color .2s, transform .2s;
        }
        .feature-card:hover { border-color: rgba(59,130,246,0.4); transform: translateY(-2px); }
        .feature-icon {
          width: 44px; height: 44px; border-radius: 10px;
          background: rgba(59,130,246,0.15); display: flex; align-items: center;
          justify-content: center; font-size: 22px; margin-bottom: 18px;
        }
        .feature-card h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; margin-bottom: 8px; }
        .feature-card p { font-size: 13px; color: var(--muted); line-height: 1.65; }

        .stats-strip {
          background: var(--panel); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          padding: 64px 24px;
        }
        .stats-inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 0; }
        .stat-item { text-align: center; padding: 0 32px; position: relative; }
        .stat-item:not(:last-child)::after {
          content: ''; position: absolute; right: 0; top: 10%; bottom: 10%;
          width: 1px; background: var(--border);
        }
        .stat-value { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(36px,5vw,56px); letter-spacing: -2px; }
        .stat-value.blue  { color: var(--accent); }
        .stat-value.gold  { color: var(--gold); }
        .stat-value.green { color: var(--green); }
        .stat-label { font-size: 13px; color: var(--muted); margin-top: 6px; }

        .seller-cta {
          max-width: 1100px; margin: 0 auto; padding: 0 24px 100px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: stretch;
        }
        .cta-card { border-radius: 20px; padding: 48px 40px; position: relative; overflow: hidden; }
        .cta-card.buyer  { background: var(--panel); border: 1px solid var(--border); }
        .cta-card.seller {
          background: linear-gradient(135deg, #1a3a7a 0%, #0f2257 100%);
          border: 1px solid rgba(59,130,246,0.4);
        }
        .cta-card h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 30px; letter-spacing: -0.5px; margin-bottom: 14px; }
        .cta-card p { color: var(--muted); font-size: 15px; line-height: 1.6; margin-bottom: 32px; }
        .cta-card.seller p { color: rgba(255,255,255,0.65); }
        .cta-perks { list-style: none; margin-bottom: 36px; display: flex; flex-direction: column; gap: 10px; }
        .cta-perks li { font-size: 14px; display: flex; align-items: center; gap: 10px; }
        .cta-perks li::before { content: '✓'; color: var(--green); font-weight: 700; font-size: 13px; flex-shrink: 0; }
        .cta-card.seller .cta-perks li::before { color: #60a5fa; }
        .blob {
          position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none;
          right: -60px; bottom: -60px; width: 200px; height: 200px;
          background: rgba(59,130,246,0.2);
        }

        .footer {
          border-top: 1px solid var(--border); padding: 40px 48px;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 13px; color: var(--muted); flex-wrap: wrap; gap: 16px;
        }
        .footer-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px; color: var(--text); }
        .footer-logo span { color: var(--accent); }

        @media (max-width: 768px) {
          .nav { padding: 16px 20px; }
          .nav-links { display: none; }
          .hero { padding: 100px 20px 60px; }
          .steps { grid-template-columns: 1fr; }
          .step { border-radius: 12px !important; }
          .connector { display: none; }
          .stats-inner { grid-template-columns: 1fr; gap: 32px; }
          .stat-item::after { display: none; }
          .seller-cta { grid-template-columns: 1fr; }
          .footer { flex-direction: column; text-align: center; padding: 32px 20px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">Safe<span>Pay</span></div>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#sellers">Sellers</a>
        </div>
        <div className="nav-actions">
          <Link href="/login" className="btn-ghost">Sign In</Link>
          <Link href="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="badge">
          <span className="badge-dot" /> Escrow-protected payments · Live on Sepolia
        </div>

        <h1>
          Buy & Sell with<br />
          <span className="highlight">Zero Risk</span> — Not <span className="strike">Blind</span> Trust
        </h1>

        <p className="hero-sub">
          SafePay holds payments in escrow until you confirm delivery.
          Crypto or cash — your money never moves until you say so.
        </p>

        <div className="hero-cta">
          <Link href="/register" className="btn-primary btn-lg">Start Buying or Selling →</Link>
          <Link href="#how-it-works" className="btn-ghost btn-lg">See how it works</Link>
        </div>

        <div className="trust-row">
          {[
            { icon: '🔒', label: 'Smart contract escrow' },
            { icon: '⛓️', label: 'Blockchain verified' },
            { icon: '🛡️', label: 'Dispute protection' },
            { icon: '⚡', label: 'Instant OTP release' },
          ].map(t => (
            <div className="trust-item" key={t.label}>
              <span>{t.icon}</span><span>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div id="how-it-works" style={{ background: 'var(--deep)', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="section-label">The process</p>
          <h2 className="section-title">Simple. Secure. Every time.</h2>
          <p className="section-sub">Four steps stand between you and a completely worry-free transaction.</p>

          <div className="steps">
            {[
              { icon: '🛒', title: 'Buyer places order',      desc: 'Browse products and checkout. Choose crypto (ETH) or mobile money.' },
              { icon: '🔐', title: 'Funds locked in escrow',  desc: "Your payment is held safely in a smart contract — the seller can't touch it yet." },
              { icon: '📦', title: 'Seller delivers',         desc: 'Seller ships the item and marks it as delivered in their dashboard.' },
              { icon: '✅', title: 'OTP confirms & releases', desc: 'You receive a one-time code. Enter it to release funds. Everyone wins.' },
            ].map((s, i, arr) => (
              <div key={s.title} style={{ display: 'contents' }}>
                <div className="step">
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="step-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                {i < arr.length - 1 && <div className="connector" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-strip" ref={statsRef}>
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-value blue">{orders.toLocaleString()}+</div>
            <div className="stat-label">Orders protected</div>
          </div>
          <div className="stat-item">
            <div className="stat-value gold">{sellers.toLocaleString()}+</div>
            <div className="stat-label">Active sellers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value green">{disputes}%</div>
            <div className="stat-label">Dispute resolution rate</div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section" id="features">
        <p className="section-label">Built different</p>
        <h2 className="section-title">Everything you need to trade safely</h2>
        <p className="section-sub">Whether you're buying rare items or running a shop, SafePay has you covered.</p>

        <div className="features-grid">
          {[
            { icon: '🔐', title: 'Smart Contract Escrow',  desc: 'Funds are locked on-chain using audited Solidity contracts. No middleman, no funny business.' },
            { icon: '💳', title: 'Crypto & Mobile Money',  desc: 'Pay with Sepolia ETH or mobile money. Sellers receive to their crypto wallet upon release.' },
            { icon: '📲', title: 'OTP Delivery Confirm',   desc: "Buyers confirm receipt with a one-time password. No OTP — no payout. Simple as that." },
            { icon: '⚖️', title: 'Admin Dispute Panel',    desc: 'If something goes wrong, admins review evidence and can issue a full refund or release funds.' },
            { icon: '🛍️', title: 'Seller Product Hub',     desc: 'List products with images, pricing, and categories. Manage your entire catalog in one place.' },
            { icon: '📊', title: 'Live Earnings Dashboard', desc: 'Track escrow, released funds, and completed orders in real-time with clear breakdowns.' },
          ].map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SELLER + BUYER CTA */}
      <div id="sellers" className="seller-cta">
        <div className="cta-card buyer">
          <h2>Shop with confidence</h2>
          <p>Browse thousands of products knowing your money is protected until you receive exactly what you ordered.</p>
          <ul className="cta-perks">
            <li>Escrow holds your money until delivery</li>
            <li>Open a dispute if something goes wrong</li>
            <li>Instant refunds on admin approval</li>
            <li>Full transaction history</li>
          </ul>
          <Link href="/register" className="btn-ghost btn-lg">Start Shopping →</Link>
        </div>

        <div className="cta-card seller">
          <div className="blob" />
          <h2>Grow your business</h2>
          <p>List your products and get paid securely. No chargeback fraud, no fake buyers — just real transactions.</p>
          <ul className="cta-perks">
            <li>Create & manage your product catalog</li>
            <li>Receive ETH directly to your wallet</li>
            <li>Real-time order notifications</li>
            <li>Built-in buyer trust signals</li>
          </ul>
          <Link href="/register" className="btn-primary btn-lg">Become a Seller →</Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">Safe<span>Pay</span></div>
        <div>Secure escrow payments · Built on Ethereum Sepolia</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/login"  style={{ color: 'var(--muted)', textDecoration: 'none' }}>Sign In</Link>
          <Link href="/register" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Register</Link>
          <Link href="/seller" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Seller Dashboard</Link>
        </div>
      </footer>
    </>
  );
}