function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-[#111418] dark:bg-background-dark dark:text-white">
      <header className="z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbe0e6] bg-white px-6 py-3 dark:border-gray-800 dark:bg-background-dark md:px-10">
        <a href="/" className="flex items-center gap-4 text-primary">
          <div className="size-8">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_535)">
                <path
                  clipRule="evenodd"
                  d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </g>
              <defs>
                <clipPath id="clip0_6_535">
                  <rect fill="white" height="48" width="48" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white">
            SafePay
          </h2>
        </a>
        <div className="hidden flex-1 justify-end gap-8 md:flex">
          <div className="flex items-center gap-9">
            <a
              className="text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
              href="#"
            >
              How it Works
            </a>
            <a
              className="text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
              href="#"
            >
              Security
            </a>
            <a
              className="text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
              href="#"
            >
              Support
            </a>
          </div>
          <a
            href="/login"
            className="flex h-10 min-w-[100px] items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white hover:bg-primary/90"
          >
            <span className="truncate">Get Started</span>
          </a>
        </div>
      </header>

      <main className="flex flex-1 flex-col md:flex-row">
        <div className="hidden flex-1 flex-col items-center justify-center bg-primary/5 p-12 dark:bg-primary/10 md:flex lg:p-24">
          <div className="max-w-[540px] space-y-8">
            <div className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <img
                alt="Blockchain visualization"
                className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU5WkAAfxkH9GtjkBLSsxKfNr-sTaI92ugsczMq7evxraR8E5miFaKbQxNojNmQ3Cyrak4_cuoVKZq1v2cZHIdVIDRCgS4SSmU-qADhYxckKUMzDQPzBONnB7HC4uiNA_0ZFKdHhWCq4twznhtfe_DJjMN1HqRss-taGjtHpdpbkwwwEfUNEQet28KLMXYPRhAZlDOBd04JqUfr2PtFZpG_wWgK5PtIzaGwhCT7idtcO-0uxYzxlv_YhnNdq0Dk2JJ9e7IG8wJ2qFE"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111418] dark:text-white lg:text-5xl">
                Secure Blockchain Escrow for Peace of Mind
              </h1>
              <p className="text-lg leading-relaxed text-[#617589] dark:text-gray-400">
                SafePay ensures your funds are protected using smart contract technology.
                Eliminate counterparty risk and trade with confidence globally.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                  Fully Decentralized
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <span className="material-symbols-outlined text-lg">lock</span>
                  Encrypted Transactions
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center bg-white p-6 dark:bg-background-dark md:p-12 lg:p-24">
          <div className="mx-auto w-full max-w-[420px] space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-[#111418] dark:text-white">Welcome Back</h2>
              <p className="text-[#617589] dark:text-gray-400">
                Log in to manage your escrow accounts and active trades.
              </p>
            </div>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111418] dark:text-gray-200" htmlFor="email">
                  Phone or Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    mail
                  </span>
                  <input
                    className="w-full rounded-xl border border-[#dbe0e6] bg-white py-3.5 pl-12 pr-4 text-[#111418] transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                    id="email"
                    placeholder="Enter your phone or email"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label
                    className="text-sm font-medium text-[#111418] dark:text-gray-200"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a className="text-sm font-semibold text-primary hover:underline" href="#">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    lock
                  </span>
                  <input
                    className="w-full rounded-xl border border-[#dbe0e6] bg-white py-3.5 pl-12 pr-12 text-[#111418] transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-primary">
                    visibility
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  id="remember"
                  type="checkbox"
                />
                <label className="text-sm text-[#617589] dark:text-gray-400" htmlFor="remember">
                  Remember me for 30 days
                </label>
              </div>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                type="submit"
              >
                <span>Log In</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#dbe0e6] dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 dark:bg-background-dark">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#dbe0e6] py-2.5 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  type="button"
                >
                  <img
                    alt="Google"
                    className="h-5 w-5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl7ylXYp5zCttaaPM0nYIwUiqBFYtfJIaPxnhHrGtSgJhD9GW12QRkObhQ9MoFEtd1nKe9UQDBKBoyksPlrvgnVWAlbhsbcAStmhE4LutxYOMMBVCOw-y3fL6NqE6HFZmHlqCSTbiDWy-tH22ic8WyaOgE1G69-4IY77cbdp10o5JsPDS4uif25Ked6i4VeSvpMHMoQWxg1-QXEM9SosoWFcaG_ucqaiqeCqishp7GNeS1qKlcdpn94YqgbOcdZxrkM1d9UIUm0ipW"
                  />
                  <span className="text-sm font-medium text-[#111418] dark:text-white">Google</span>
                </button>
                <button
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#dbe0e6] py-2.5 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                  <span className="text-sm font-medium text-[#111418] dark:text-white">Wallet</span>
                </button>
              </div>
            </form>
            <p className="text-center text-sm text-[#617589] dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <a className="font-bold text-primary hover:underline" href="/register">
                Create an account
              </a>
            </p>
          </div>
          <div className="mt-auto pt-10 text-center text-xs text-gray-400">
            <p>© 2024 SafePay Escrow Solutions. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
