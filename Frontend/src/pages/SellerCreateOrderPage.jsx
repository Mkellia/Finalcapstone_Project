function SellerCreateOrderPage() {
  return (
    <div className="min-h-screen bg-background-light font-display text-[#111418] dark:bg-background-dark dark:text-white">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbe0e6] bg-white px-10 py-3 dark:border-[#2d3748] dark:bg-[#1a222c]">
          <a href="/" className="flex items-center gap-4 text-primary">
            <div className="size-8">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white">
              SafePay
            </h2>
          </a>
          <div className="flex flex-1 justify-end gap-8">
            <nav className="flex items-center gap-9">
              <a
                className="text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
                href="/buyer-dashboard"
              >
                Dashboard
              </a>
              <a
                className="text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
                href="/buyer-orders"
              >
                Orders
              </a>
              <a
                className="text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
                href="#"
              >
                Transactions
              </a>
              <a
                className="text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
                href="#"
              >
                Support
              </a>
            </nav>
            <div
              className="size-10 rounded-full border border-gray-200 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIiFKAX-2vZs3bfvBNUpxZvao1JByjsONE4UwjlBOERMsx2AAX_U0rAzai89SoswM02MySC2A0Jlj9byt_yd0wUAFJs1Ag7GfIuJIXi_kbrfSs9ZSjWOZVQ3oAm7c2s7dIvbYeq66GrL1TytGINh0xs7xW_UZ08vnwpV-YviKWDkHYeVy5rmlYTrVj5ZabBkAMcUQ3ad6Y0n2J8bpEzLOKfoowdBRF1nkOord9F2DoCusQhtdnoMG6dD-EGW4M4sCU9C7943v-JfiJ")',
              }}
            />
          </div>
        </header>

        <main className="flex flex-1 justify-center px-4 py-10">
          <div className="layout-content-container flex max-w-[560px] flex-1 flex-col">
            <div className="rounded-xl border border-[#dbe0e6] bg-white p-8 shadow-sm dark:border-[#2d3748] dark:bg-[#1a222c]">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#111418] dark:text-white">
                  Create New Order
                </h1>
                <p className="mt-2 text-[#617589] dark:text-gray-400">
                  Secure your transaction with blockchain escrow
                </p>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.pathname = '/buyer-make-payment';
                }}
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold leading-normal text-[#111418] dark:text-gray-200">
                    Seller Phone or Wallet ID
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589]">
                      person
                    </span>
                    <input
                      className="form-input h-12 w-full rounded-lg border border-[#dbe0e6] bg-white pl-10 text-base font-normal text-[#111418] transition-all placeholder:text-[#617589] focus:ring-2 focus:ring-primary/50 dark:border-[#2d3748] dark:bg-[#101922] dark:text-white"
                      placeholder="Enter seller's identifier"
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold leading-normal text-[#111418] dark:text-gray-200">
                    Item Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589]">
                      shopping_bag
                    </span>
                    <input
                      className="form-input h-12 w-full rounded-lg border border-[#dbe0e6] bg-white pl-10 text-base font-normal text-[#111418] transition-all placeholder:text-[#617589] focus:ring-2 focus:ring-primary/50 dark:border-[#2d3748] dark:bg-[#101922] dark:text-white"
                      placeholder="What are you buying?"
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold leading-normal text-[#111418] dark:text-gray-200">
                    Amount
                  </label>
                  <div className="flex w-full items-stretch rounded-lg">
                    <div className="relative flex-1">
                      <input
                        className="form-input h-12 w-full rounded-l-lg border border-r-0 border-[#dbe0e6] bg-white px-4 text-base font-normal text-[#111418] transition-all placeholder:text-[#617589] focus:ring-2 focus:ring-primary/50 dark:border-[#2d3748] dark:bg-[#101922] dark:text-white"
                        placeholder="0.00"
                        type="text"
                      />
                    </div>
                    <div className="flex items-center rounded-r-lg border border-l-0 border-[#dbe0e6] bg-gray-50 px-4 font-medium text-[#617589] dark:border-[#2d3748] dark:bg-[#2d3748] dark:text-gray-300">
                      <span className="mr-2">USDT</span>
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#dbe0e6] pt-8 dark:border-[#2d3748]">
                  <div className="mb-4 flex items-center justify-between">
                    <label className="text-sm font-semibold leading-normal text-[#111418] dark:text-gray-200">
                      Security Verification
                    </label>
                    <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline" type="button">
                      <span className="material-symbols-outlined text-sm">refresh</span>
                      Generate OTP
                    </button>
                  </div>

                  <div className="flex flex-col items-center rounded-xl border border-primary/20 bg-primary/5 p-6 dark:bg-primary/10">
                    <div className="mb-3 flex gap-2">
                      {['8', '4', '2', '9', '0', '1'].map((d) => (
                        <div
                          key={d}
                          className="flex h-12 w-10 items-center justify-center rounded-lg border-2 border-primary/30 bg-white text-xl font-bold text-primary dark:bg-[#101922]"
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                    <button className="flex items-center gap-2 text-xs text-[#617589] transition-colors hover:text-primary dark:text-gray-400" type="button">
                      <span className="material-symbols-outlined text-base">content_copy</span>
                      Click to copy OTP
                    </button>
                  </div>
                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90" type="submit">
                  <span>Create Escrow Order</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>

                <p className="px-4 text-center text-xs text-[#617589] dark:text-gray-500">
                  By creating this order, you agree to SafePay&apos;s terms of service. Funds will
                  be held in a secure smart contract until delivery is confirmed.
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SellerCreateOrderPage;
