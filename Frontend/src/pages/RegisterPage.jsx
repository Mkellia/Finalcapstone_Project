function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 bg-white px-6 py-3 dark:bg-background-dark md:px-10">
        <a href="/" className="flex items-center gap-4 text-primary">
          <div className="size-8">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_register)">
                <path
                  clipRule="evenodd"
                  d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </g>
              <defs>
                <clipPath id="clip0_register">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-slate-100">
            SafePay
          </h2>
        </a>
        <div className="flex items-center gap-4">
          <button className="hidden h-10 min-w-[84px] items-center justify-center rounded-lg bg-primary/10 px-4 text-sm font-bold text-primary md:flex">
            <span>Help Center</span>
          </button>
        </div>
      </header>

      <main className="flex flex-grow items-center justify-center p-4 md:p-8">
        <div className="flex min-h-[600px] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-900 md:flex-row">
          <div className="relative flex flex-col justify-end overflow-hidden p-8 md:w-1/2 md:p-12">
            <div className="absolute inset-0 z-0">
              <img
                alt="Blockchain connectivity"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU5WkAAfxkH9GtjkBLSsxKfNr-sTaI92ugsczMq7evxraR8E5miFaKbQxNojNmQ3Cyrak4_cuoVKZq1v2cZHIdVIDRCgS4SSmU-qADhYxckKUMzDQPzBONnB7HC4uiNA_0ZFKdHhWCq4twznhtfe_DJjMN1HqRss-taGjtHpdpbkwwwEfUNEQet28KLMXYPRhAZlDOBd04JqUfr2PtFZpG_wWgK5PtIzaGwhCT7idtcO-0uxYzxlv_YhnNdq0Dk2JJ9e7IG8wJ2qFE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            </div>
            <div className="relative z-10 text-white">
              <span className="material-symbols-outlined mb-6 text-6xl text-white">
                shield_with_heart
              </span>
              <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
                Securing the future of digital transactions
              </h1>
              <p className="max-w-md text-lg text-white/80">
                The most trusted blockchain escrow system for secure, transparent, and instant
                peer-to-peer payments.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                Create Account
              </h2>
              <p className="mt-2 font-medium text-slate-500 dark:text-slate-400">
                Join SafePay Blockchain Escrow System
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                    person
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="Enter your full name"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                    call
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex justify-between text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Email <span className="font-normal italic text-slate-400">Optional</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                    mail
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="name@company.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="mb-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Register as:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="relative flex cursor-pointer">
                    <input defaultChecked className="peer sr-only" name="role" type="radio" value="buyer" />
                    <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-bold text-slate-500 transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      Buyer
                    </div>
                  </label>
                  <label className="relative flex cursor-pointer">
                    <input className="peer sr-only" name="role" type="radio" value="seller" />
                    <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-bold text-slate-500 transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      Seller
                    </div>
                  </label>
                  <label className="relative flex cursor-pointer">
                    <input className="peer sr-only" name="role" type="radio" value="admin" />
                    <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-bold text-slate-500 transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      Admin
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                    lock
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="Create a strong password"
                    type="password"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                    lock
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="Confirm your password"
                    type="password"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                type="submit"
              >
                Create Account
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">
                Already have an account?
                <a className="ml-1 font-bold text-primary hover:underline" href="/login">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-slate-400">
        <p>© 2024 SafePay Blockchain Escrow System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default RegisterPage;
