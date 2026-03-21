import Link from "next/link";

export const metadata = { title: "Legal & Privacy — SafePay" };

export default function LegalPage() {
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
        }

        body { background: var(--navy); font-family: 'DM Sans', sans-serif; color: var(--text); }

        .legal-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(4,8,15,0.92); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 48px;
        }
        .legal-nav-logo {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px;
          color: var(--text); text-decoration: none; letter-spacing: -0.5px;
        }
        .legal-nav-logo span { color: var(--accent); }
        .legal-nav-links { display: flex; gap: 24px; }
        .legal-nav-links a {
          font-size: 13px; color: var(--muted); text-decoration: none;
          transition: color .2s;
        }
        .legal-nav-links a:hover { color: var(--accent); }

        .legal-wrap {
          max-width: 820px; margin: 0 auto; padding: 64px 32px 96px;
        }

        .legal-header { margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
        .legal-header h1 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 42px; letter-spacing: -1.5px; margin-bottom: 12px;
        }
        .legal-header h1 span { color: var(--accent); }
        .legal-meta { font-size: 13px; color: var(--muted); line-height: 1.8; }

        .legal-toc {
          background: rgba(13,21,38,0.6); border: 1px solid var(--border);
          border-radius: 12px; padding: 24px 28px; margin-bottom: 56px;
        }
        .legal-toc p { font-size: 11px; font-weight: 500; letter-spacing: 1px;
          text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
        .legal-toc ul { list-style: none; display: flex; flex-wrap: wrap; gap: 10px; }
        .legal-toc a {
          font-size: 13px; color: var(--accent); text-decoration: none;
          background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2);
          border-radius: 6px; padding: 5px 12px; transition: background .2s;
        }
        .legal-toc a:hover { background: rgba(59,130,246,0.18); }

        .legal-section { margin-bottom: 64px; }
        .section-badge {
          display: inline-block; font-size: 11px; font-weight: 500;
          letter-spacing: 1px; text-transform: uppercase;
          color: var(--accent); background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 4px; padding: 3px 10px; margin-bottom: 16px;
        }
        .legal-section > h2 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 30px; letter-spacing: -0.8px; margin-bottom: 28px;
          padding-bottom: 16px; border-bottom: 1px solid var(--border);
        }

        .clause { margin-bottom: 28px; }
        .clause h3 {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 15px; color: var(--text); margin-bottom: 8px;
        }
        .clause p, .clause li {
          font-size: 14px; color: var(--muted); line-height: 1.75;
        }
        .clause ul { padding-left: 0; list-style: none; margin-top: 8px; }
        .clause ul li {
          padding: 6px 0 6px 20px; position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .clause ul li:last-child { border-bottom: none; }
        .clause ul li::before {
          content: "→"; position: absolute; left: 0;
          color: var(--accent); font-size: 12px;
        }
        .clause strong { color: var(--text); font-weight: 500; }

        .highlight-box {
          background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.15);
          border-radius: 10px; padding: 16px 20px; margin: 12px 0;
          font-size: 14px; color: var(--muted); line-height: 1.7;
        }
        .warning-box {
          background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2);
          border-radius: 10px; padding: 16px 20px; margin: 12px 0;
          font-size: 14px; color: #d4a017; line-height: 1.7;
        }

        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
        .contact-card {
          background: var(--panel); border: 1px solid var(--border);
          border-radius: 12px; padding: 20px 24px;
        }
        .contact-card p { font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
          color: var(--muted); margin-bottom: 8px; }
        .contact-card h4 { font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 14px; color: var(--text); margin-bottom: 4px; }
        .contact-card a { font-size: 13px; color: var(--accent); text-decoration: none; }
        .contact-card a:hover { text-decoration: underline; }
        .rec-badge {
          display: inline-block; margin-top: 8px;
          font-size: 11px; background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.25); color: var(--green);
          border-radius: 4px; padding: 2px 8px;
        }

        .legal-footer {
          border-top: 1px solid var(--border); padding-top: 32px; margin-top: 64px;
          font-size: 12px; color: rgba(123,139,173,0.5); text-align: center;
          line-height: 1.8;
        }

        @media (max-width: 640px) {
          .legal-nav { padding: 14px 20px; }
          .legal-wrap { padding: 40px 20px 64px; }
          .legal-header h1 { font-size: 30px; }
          .contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav className="legal-nav">
        <Link href="/" className="legal-nav-logo">Safe<span>Pay</span></Link>
        <div className="legal-nav-links">
          <a href="#eula">EULA</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <div className="legal-wrap">

        {/* HEADER */}
        <div className="legal-header">
          <h1>Legal &amp; <span>Privacy</span></h1>
          <div className="legal-meta">
            <strong style={{ color: 'var(--text)' }}>Effective Date:</strong> March 2026<br />
            <strong style={{ color: 'var(--text)' }}>Platform:</strong> SafePay — Blockchain-Based Escrow Payment System<br />
            <strong style={{ color: 'var(--text)' }}>Developer:</strong> Kellia MUZIRA | African Leadership University, Kigali, Rwanda
          </div>
        </div>

        {/* TABLE OF CONTENTS */}
        <div className="legal-toc">
          <p>On this page</p>
          <ul>
            <li><a href="#eula">End-User Licence Agreement</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* ─── EULA ─── */}
        <section id="eula" className="legal-section">
          <div className="section-badge">Legal Agreement</div>
          <h2>End-User Licence Agreement (EULA)</h2>

          <div className="clause">
            <h3>1. Acceptance of Terms</h3>
            <p>By creating an account and using SafePay, you agree to be bound by this Agreement. If you do not agree, you must not register or use the platform. SafePay is an academic Capstone project developed at African Leadership University. It is not a licensed financial service provider and is not regulated by the National Bank of Rwanda.</p>
          </div>

          <div className="clause">
            <h3>2. Platform Status — Testnet Deployment</h3>
            <div className="warning-box">
              SafePay is currently deployed on the <strong>Ethereum Sepolia test network</strong>. This is a blockchain testing environment. Any Ethereum (ETH) used on this platform is <strong>test Ether with no real monetary value</strong>. Mobile Money payments are processed through the <strong>MTN MoMo sandbox</strong>, which simulates transactions and does not move real funds. You must not treat any transaction on this platform as a real financial transaction.
            </div>
          </div>

          <div className="clause">
            <h3>3. How the Escrow Works</h3>
            <p>When you place an order and make a payment as a buyer:</p>
            <ul>
              <li>Your payment is <strong>locked inside the SafePayEscrow smart contract</strong> on the blockchain</li>
              <li>The seller does <strong>not</strong> receive any funds until you confirm delivery</li>
              <li>Delivery confirmation requires you to enter a valid <strong>One-Time Password (OTP)</strong> sent to you by the system</li>
              <li>If you confirm delivery, the smart contract <strong>automatically releases</strong> funds to the seller</li>
              <li>If you raise a dispute, funds remain <strong>locked in escrow</strong> until an administrator reviews and resolves the case</li>
            </ul>
          </div>

          <div className="clause">
            <h3>4. Blockchain Irreversibility</h3>
            <div className="warning-box">
              Transactions recorded on the Ethereum Sepolia blockchain <strong>cannot be reversed, cancelled, or modified</strong> once confirmed. Before confirming any payment, verify all details — wallet address, amount, and order information. SafePay and its developer accept no responsibility for losses caused by user error during transaction confirmation.
            </div>
          </div>

          <div className="clause">
            <h3>5. Dispute Resolution</h3>
            <p>If you believe a delivery has not occurred or a transaction was processed incorrectly, you may raise a dispute through your buyer dashboard. Once raised:</p>
            <ul>
              <li>Payment remains locked in escrow</li>
              <li>A SafePay administrator will review the transaction</li>
              <li>The administrator will either release funds to the seller or refund them to the buyer</li>
              <li>The administrator&apos;s decision is final within the current platform design</li>
              <li>SafePay does not currently provide an appeals mechanism</li>
            </ul>
          </div>

          <div className="clause">
            <h3>6. Acceptable Use</h3>
            <p>You agree to use SafePay only for lawful purposes. You must not attempt to bypass the escrow mechanism, manipulate OTP verification, impersonate another user, or use the platform to facilitate fraud. Violations may result in account suspension and referral to the appropriate authorities.</p>
          </div>

          <div className="clause">
            <h3>7. Limitation of Liability</h3>
            <p>SafePay is provided <strong>&quot;as is&quot;</strong> for academic research and demonstration purposes. The developer makes no warranties regarding uninterrupted service, commercial fitness, or freedom from errors. To the maximum extent permitted by law, the developer is not liable for any direct, indirect, incidental, or consequential damages arising from use of the platform.</p>
          </div>

          <div className="clause">
            <h3>8. Intellectual Property</h3>
            <p>All code, design, and content on SafePay is the original work of Kellia MUZIRA, developed as part of the BSc Software Engineering Capstone at ALU. Open-source libraries are used under their respective licences (MIT, Apache 2.0). Unauthorised commercial use or reproduction of the platform&apos;s code is not permitted.</p>
          </div>
        </section>

        {/* ─── PRIVACY POLICY ─── */}
        <section id="privacy" className="legal-section">
          <div className="section-badge">Data &amp; Privacy</div>
          <h2>Privacy Policy</h2>

          <div className="clause">
            <h3>1. What Data We Collect</h3>
            <p>When you register and use SafePay, we collect:</p>
            <ul>
              <li><strong>Account data:</strong> full name, email address, encrypted password</li>
              <li><strong>Transaction data:</strong> order details, payment amounts, payment method, transaction status</li>
              <li><strong>Wallet data:</strong> Ethereum wallet addresses linked to crypto payments</li>
              <li><strong>Delivery data:</strong> OTP timestamps and confirmation records</li>
              <li><strong>Dispute data:</strong> dispute details and admin resolution decisions</li>
            </ul>
          </div>

          <div className="clause">
            <h3>2. How We Use Your Data</h3>
            <p>Your data is used only to operate SafePay:</p>
            <ul>
              <li>Account data authenticates your identity and gives you role-based access (buyer, seller, or admin)</li>
              <li>Transaction data processes payments, manages escrow, and shows your order history</li>
              <li>Wallet addresses record and process cryptocurrency payments on the blockchain</li>
            </ul>
            <div className="highlight-box">
              We do <strong>not</strong> sell your data, share it with third parties, or use it for advertising.
            </div>
          </div>

          <div className="clause">
            <h3>3. How We Protect Your Data</h3>
            <ul>
              <li>Passwords are <strong>hashed using bcrypt</strong> before storage — never stored in plain text</li>
              <li>All data transmission is encrypted via <strong>HTTPS</strong></li>
              <li>Personal data is stored in a <strong>PostgreSQL database</strong> with role-based access controls</li>
              <li>Buyers can only see their own orders</li>
              <li>Sellers can only see orders placed for their products</li>
              <li>Admins access transaction data only for dispute resolution purposes</li>
            </ul>
          </div>

          <div className="clause">
            <h3>4. Blockchain Data and Public Visibility</h3>
            <div className="warning-box">
              When you pay using cryptocurrency, your <strong>wallet address and transaction details are recorded permanently on the Ethereum Sepolia blockchain</strong>. Blockchain records are public and cannot be deleted. SafePay stores only pseudonymised identifiers on-chain — your name and email are stored off-chain in the SafePay database and are not publicly visible. Be aware that wallet addresses, while pseudonymous, may be linkable to personal identity through external means.
            </div>
          </div>

          <div className="clause">
            <h3>5. Your Rights</h3>
            <p>Under Rwanda&apos;s <strong>Law No. 058/2021 on the Protection of Personal Data and Privacy</strong>, you have the right to:</p>
            <ul>
              <li><strong>Access</strong> the personal data SafePay holds about you</li>
              <li><strong>Correct</strong> inaccurate data</li>
              <li><strong>Request deletion</strong> of your off-chain account data</li>
            </ul>
            <p style={{ marginTop: 10 }}>To exercise these rights, contact us at the address below. Please note: transaction records on the Ethereum blockchain are <strong>immutable and cannot be deleted</strong>. We will inform you of this at the time of any deletion request.</p>
          </div>

          <div className="clause">
            <h3>6. Data Retention</h3>
            <ul>
              <li>Account and transaction data is retained for the duration of your registration</li>
              <li>If you deactivate your account, off-chain personal data is deleted within <strong>30 days</strong></li>
              <li>Blockchain records are permanent and cannot be removed</li>
              <li>Dispute records are retained until the dispute is fully resolved</li>
            </ul>
          </div>

          <div className="clause">
            <h3>7. Consent</h3>
            <p>By registering on SafePay, you consent to the collection and use of your data as described in this Privacy Policy. You may withdraw consent at any time by deactivating your account and requesting data deletion.</p>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" className="legal-section">
          <div className="section-badge">Get in Touch</div>
          <h2>Contact</h2>

          <div className="contact-grid">
            <div className="contact-card">
              <p>Developer</p>
              <h4>Kellia MUZIRA</h4>
              <a href="mailto:k.muzira@alustudent.com">k.muzira@alustudent.com</a>
              <br />
              <small style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, display: 'block' }}>
                For data requests or privacy concerns
              </small>
            </div>
            <div className="contact-card">
              <p>Research Ethics</p>
              <h4>ALU Research Ethics Committee</h4>
              <a href="mailto:researchethics@alueducation.com">researchethics@alueducation.com</a>
              <div className="rec-badge">REC Approval Code: J26BSE041</div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="legal-footer">
          © 2026 SafePay · African Leadership University Capstone Project · Ethereum Sepolia Testnet<br />
          <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to SafePay</Link>
        </div>

      </div>
    </>
  );
}
