function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-[#111418] transition-colors duration-200 dark:bg-background-dark dark:text-white">
      <div className="layout-container flex h-full grow flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f2f4] bg-white px-6 py-3 dark:border-gray-800 dark:bg-background-dark md:px-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">SafePay</h2>
          </div>
          <div className="flex flex-1 items-center justify-end gap-6">
            <nav className="hidden items-center gap-7 md:flex">
              <a className="text-sm font-medium transition-colors hover:text-primary" href="#">
                About
              </a>
              <a className="text-sm font-medium transition-colors hover:text-primary" href="#">
                How It Works
              </a>
              <a className="text-sm font-medium transition-colors hover:text-primary" href="#">
                Contact
              </a>
            </nav>
            <div className="flex gap-2">
              <a
                href="/login"
                className="hidden h-9 min-w-[72px] items-center justify-center rounded-lg bg-gray-100 px-4 text-xs font-bold text-[#111418] transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:flex"
              >
                <span>Login</span>
              </a>
              <a
                href="/login"
                className="flex h-9 min-w-[90px] items-center justify-center rounded-lg bg-primary px-4 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <span>Get Started</span>
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div className="flex flex-col gap-6 py-10 md:py-14 lg:flex-row lg:items-center">
              <div className="flex flex-col gap-6 lg:w-3/5">
                <div className="flex flex-col gap-3">
                  <h1 className="text-3xl font-black leading-tight tracking-tight text-[#111418] dark:text-white md:text-5xl">
                    Pay safely. Release only after delivery.
                  </h1>
                  <p className="max-w-[480px] text-base font-normal text-gray-600 dark:text-gray-400 md:text-lg">
                    Secure blockchain escrow for modern commerce. Simple, transparent, and
                    protected transactions for everyone.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/login"
                    className="flex h-12 min-w-[140px] items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-md transition-opacity hover:opacity-90"
                  >
                    Get Started
                  </a>
                  <button className="flex h-12 min-w-[140px] items-center justify-center rounded-lg border border-primary/20 bg-primary/5 px-6 text-base font-bold text-primary transition-colors hover:bg-primary/10">
                    View Demo
                  </button>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex -space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-100 dark:border-background-dark">
                      <img
                        className="h-full w-full object-cover"
                        alt="User"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCejz0_1gpe3sLrk_lgoVikBz5ZBW5JIkJ66O-lmpuS6bivgZxS099Mu_B79Dnu_hOnlghoDVtknCO_tGIRDvLr8ptfK9phwkhz0cVT4BPc-RaUe8FxnvMOcWFN3JsDnapGJJuSgz-4N8u9Z2-TsNWmS9zjyefMjaWjOfwqPu1IWx-MczYRXhxmidDCZH--Gqd9okUja-uPk_y8_IRtl9dODJrPqfChkxxFuNn0dkrOYgajRSTr4unc7BMzpmm_hnjci0M9HGq2Fg93"
                      />
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-green-100 dark:border-background-dark">
                      <img
                        className="h-full w-full object-cover"
                        alt="User"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDATAs5RFZVmKaLQFpmCQrT6mVjRH1re2LcwL7FvonX52Zw__4T-7zdlJNprTt4vcWa4wiF3fCEtdvEhvuRxKiLHdqETYB8yNxPVkElXIFqAkb4V6vGGyH8tYzycTtsmtOW8lt0GPbYYfCjRGlGcKYiPyRi7JCG8nhxcpaoRfJDZd-hX6VMIVYI5JZtCgA9D_jYxAmQOG5unCcsopvvzyElQLt8kpC8kFimqKs72KQM4jY5OvUa27R0dGeEspFkusm4WGjnbqqVdtcI"
                      />
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-yellow-100 dark:border-background-dark">
                      <img
                        className="h-full w-full object-cover"
                        alt="User"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCASuk2b9kGFfcVPd3TeXlh9kVxAluA7NPI2MApt0eZMWCCRiSxgy7pxQATd8G5O_yJ9CyEGL-GqZxhyqK2k4GmHW8TwYVMdb5xuIX5JpeKvEl3_dD2gUZWlhbdS_gufq8dG9HZ_UuqCeGZsfxrx3JWcrfYtaTUwxwcXzkh2kq4VmdAeOVFWntribSWTB66wOwumNLxRfnnCxASirA_RtTEN5yZdtF1Dxunr3vd9jkpAgQ0OAJylOmUFjr8F_U0IUTOwmmulMlo0ZdK"
                      />
                    </div>
                  </div>
                  <span>10,000+ users trust SafePay</span>
                </div>
              </div>

            </div>
          </div>

          <section className="border-y border-gray-100 bg-white py-12 dark:border-gray-800 dark:bg-background-dark/50">
            <div className="mx-auto max-w-[1200px] px-6 md:px-10">
              <div className="mb-10 flex flex-col gap-2 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white md:text-3xl">
                  Secure Escrow Protection
                </h2>
                <p className="max-w-[600px] text-sm font-normal text-gray-600 dark:text-gray-400 md:text-base">
                  Blockchain-backed transparency for every transaction.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="group flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <span className="material-symbols-outlined text-2xl">shield_person</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold leading-tight">Escrow Safety</h3>
                    <p className="text-sm leading-snug text-gray-600 dark:text-gray-400">
                      Smart contracts hold funds until transaction terms are fully met.
                    </p>
                  </div>
                </div>
                <div className="group flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <span className="material-symbols-outlined text-2xl">lock_open</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold leading-tight">OTP Verification</h3>
                    <p className="text-sm leading-snug text-gray-600 dark:text-gray-400">
                      Release payments instantly via secure one-time delivery codes.
                    </p>
                  </div>
                </div>
                <div className="group flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <span className="material-symbols-outlined text-2xl">replay</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold leading-tight">Refund Support</h3>
                    <p className="text-sm leading-snug text-gray-600 dark:text-gray-400">
                      Fast dispute resolution via decentralized arbitration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="mx-auto max-w-[1200px] px-6 md:px-10">
              <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-center shadow-xl md:p-14">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-black/10 blur-3xl" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <h2 className="max-w-[600px] text-2xl font-black leading-tight text-white md:text-4xl">
                    Secure your first transaction today
                  </h2>
                  <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
                    <a
                      href="/login"
                      className="flex h-12 min-w-[180px] items-center justify-center rounded-lg bg-white px-6 text-base font-bold text-primary shadow-lg transition-colors hover:bg-gray-100"
                    >
                      Get Started Now
                    </a>
                    <button className="flex h-12 min-w-[180px] items-center justify-center rounded-lg border-2 border-white/30 px-6 text-base font-bold text-white transition-colors hover:bg-white/10">
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-background-dark">
          <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-10">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
                </div>
                <h2 className="text-lg font-bold">SafePay</h2>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a className="text-xs font-medium text-gray-500 transition-colors hover:text-primary" href="#">
                  Privacy
                </a>
                <a className="text-xs font-medium text-gray-500 transition-colors hover:text-primary" href="#">
                  Terms
                </a>
                <a className="text-xs font-medium text-gray-500 transition-colors hover:text-primary" href="#">
                  Support
                </a>
                <a className="text-xs font-medium text-gray-500 transition-colors hover:text-primary" href="#">
                  API
                </a>
              </div>
              <div className="flex gap-4">
                <a className="text-gray-400 transition-colors hover:text-primary" href="#">
                  <span className="material-symbols-outlined text-xl">share</span>
                </a>
                <a className="text-gray-400 transition-colors hover:text-primary" href="#">
                  <span className="material-symbols-outlined text-xl">public</span>
                </a>
              </div>
            </div>
            <div className="mt-6 border-t border-gray-50 pt-6 text-center dark:border-gray-800">
              <p className="text-[10px] text-gray-400">
                © 2023 SafePay Blockchain Escrow. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
