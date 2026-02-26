function BuyerConfirmDeliveryPage() {
  return (
    <div className="bg-background-light font-display text-[#111418] transition-colors duration-200 dark:bg-background-dark dark:text-white">
      <div className="group/design-root relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbe0e6] bg-white px-6 py-3 dark:border-gray-800 dark:bg-[#1a2632] md:px-10">
            <div className="flex items-center gap-4 text-primary">
              <div className="size-6">
                <span className="material-symbols-outlined text-3xl font-bold">shield_with_heart</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white">
                SafePay
              </h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
              <div className="hidden items-center gap-9 md:flex">
                <a className="text-sm font-medium leading-normal text-[#111418] hover:text-primary dark:text-gray-300" href="/buyer-dashboard">
                  Dashboard
                </a>
                <a className="border-b-2 border-primary pb-1 text-sm font-bold leading-normal text-primary" href="#">
                  Escrow
                </a>
                <a className="text-sm font-medium leading-normal text-[#111418] hover:text-primary dark:text-gray-300" href="/buyer-disputes">
                  Disputes
                </a>
                <a className="text-sm font-medium leading-normal text-[#111418] hover:text-primary dark:text-gray-300" href="#">
                  Profile
                </a>
              </div>
              <div className="flex gap-2">
                <button className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-[#f0f2f4] text-[#111418] transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-[#f0f2f4] text-[#111418] transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                  <span className="material-symbols-outlined">account_circle</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex flex-1 justify-center px-4 py-10">
            <div className="layout-content-container flex max-w-[560px] flex-1 flex-col">
              <div className="mb-8 flex items-center justify-between px-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Deposit</span>
                </div>
                <div className="mx-2 mb-6 h-0.5 flex-1 bg-primary" />
                <div className="flex flex-col items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Shipping</span>
                </div>
                <div className="mx-2 mb-6 h-0.5 flex-1 bg-primary/30" />
                <div className="flex flex-col items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white ring-4 ring-primary/20">3</div>
                  <span className="text-xs font-bold text-primary">Delivery</span>
                </div>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-[#dbe0e6] bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#1a2632]">
                <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="material-symbols-outlined text-4xl text-primary">local_shipping</span>
                </div>
                <h1 className="pb-2 text-center text-[28px] font-bold tracking-light text-[#111418] dark:text-white md:text-[32px]">
                  Confirm Delivery
                </h1>
                <p className="max-w-[400px] pb-8 text-center text-base font-normal leading-normal text-[#64748b] dark:text-gray-400">
                  Please enter the 6-digit confirmation code provided by the seller to release the{' '}
                  <span className="font-semibold text-primary">0.45 ETH</span> from escrow.
                </p>

                <div className="mb-8 flex w-full justify-center">
                  <fieldset className="relative flex gap-3 md:gap-4">
                    {['·', '·', '·', '-', '·', '·', '·'].map((char, i) =>
                      char === '-' ? (
                        <div key={i} className="mx-1 flex items-center font-bold text-gray-400">
                          -
                        </div>
                      ) : (
                        <input
                          key={i}
                          maxLength={1}
                          placeholder={char}
                          type="text"
                          className="flex h-14 w-10 appearance-none items-center border-0 border-b-2 border-[#dbe0e6] bg-transparent text-center text-xl font-bold leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-gray-700 dark:text-white md:w-14"
                        />
                      )
                    )}
                  </fieldset>
                </div>

                <div className="flex w-full max-w-[400px] flex-col gap-4">
                  <button className="flex h-14 w-full items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
                    <span className="truncate">Confirm Delivery</span>
                  </button>
                  <div className="flex items-center gap-2 py-2">
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                    <span className="px-2 text-xs font-medium text-gray-400">HAVING ISSUES?</span>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <a
                    href="/buyer-disputes"
                    className="flex h-12 w-full items-center justify-center overflow-hidden rounded-lg border border-red-100 bg-[#fef2f2] px-5 text-base font-bold text-[#ef4444] transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                  >
                    <span className="material-symbols-outlined mr-2">gavel</span>
                    <span className="truncate">Open Dispute</span>
                  </a>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-6">
                <div className="flex items-start gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <div>
                    <p className="text-sm font-semibold text-[#111418] dark:text-white">
                      What happens next?
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Once confirmed, the smart contract will immediately release the funds to the
                      seller. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Secure Blockchain Transaction
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className="mt-auto border-t border-[#dbe0e6] py-8 text-center text-sm text-gray-400 dark:border-gray-800">
            <p>© 2024 SafePay Blockchain Escrow. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default BuyerConfirmDeliveryPage;
