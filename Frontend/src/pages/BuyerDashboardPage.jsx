function BuyerDashboardPage() {
  return (
    <div className="bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <div className="flex h-screen overflow-hidden">
        <aside className="flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 p-6">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined">shield_with_heart</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SafePay</span>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            <a
              className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 font-medium text-primary"
              href="#"
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </a>
            <a
              className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              href="/buyer-orders"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Orders
            </a>
            <a
              className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              href="/buyer-disputes"
            >
              <span className="material-symbols-outlined">gavel</span>
              Disputes
            </a>
            <a
              className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              href="#"
            >
              <span className="material-symbols-outlined">notifications</span>
              Notifications
            </a>
          </nav>

          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <a
              href="/"
              className="mb-2 flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-red-500 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Logout
            </a>
            <div className="flex items-center gap-3 p-2">
              <div className="size-10 rounded-full bg-slate-200">
                <img
                  className="rounded-full"
                  alt="User profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC109wMGX79gxyWClgHLYJJQ94Cn6ngTPDrO2CVnmgn2-vwhycgvvKOePS40-xWmHNcbXUtAh-PBR3oJYVZFyKgl50GsuTE-6OTf6EM4T5Gi8LSD4e0wSRdk3Bv_MZicd4uVKwyewTAcMB9-EC-DpaNCarNCKRrXsmaM4IKxl17UT7_1U0x7k1tykLPml5MmCaYqNLo3WpHZnwCVcsu1VNeFLYQ1zVLgssN3PDTYN7L9ke7UGf6i9DvEVgcXZCMGe79CtFg_XxTEZTp"
                />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-semibold">Alex Johnson</span>
                <span className="truncate text-xs text-slate-500">Buyer Account</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
            <h1 className="text-lg font-semibold">Overview</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  search
                </span>
                <input
                  className="w-64 rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 dark:bg-slate-800"
                  placeholder="Search orders..."
                  type="text"
                />
              </div>
              <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="relative overflow-hidden rounded-xl bg-primary p-8 text-white shadow-xl shadow-primary/20 lg:col-span-2">
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <p className="font-medium opacity-80">Total Wallet Balance</p>
                    <h2 className="mt-1 text-4xl font-bold">$12,450.00</h2>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <button className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 font-bold text-primary transition-colors hover:bg-slate-50">
                      <span className="material-symbols-outlined">add_circle</span>
                      Top Up Wallet
                    </button>
                    <a
                      href="/buyer-create-order"
                      className="flex items-center gap-2 rounded-lg border border-white/30 px-6 py-2.5 font-bold text-white transition-colors hover:bg-white/10"
                    >
                      <span className="material-symbols-outlined">payments</span>
                      Create Order
                    </a>
                  </div>
                </div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20">
                  <svg className="h-full w-full object-cover" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,77.3,-44.7C85.4,-31.3,90.5,-15.6,89.3,-0.7C88.1,14.3,80.6,28.6,71.2,40.8C61.8,53,50.6,63.1,37.5,70.6C24.4,78.2,9.4,83.1,-5.6,83.1C-20.6,83.1,-35.6,78.2,-48.7,70.6C-61.8,63.1,-73,53,-81.4,40.8C-89.8,28.6,-95.4,14.3,-95.4,-0.7C-95.4,-15.6,-89.8,-31.3,-81.4,-44.7C-73,-58.1,-61.8,-69.2,-48.7,-76.4C-35.6,-83.6,-20.6,-86.9,-5.6,-86.9C9.4,-86.9,24.4,-83.6,44.7,-76.4Z"
                      fill="currentColor"
                      transform="translate(100 100)"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <span className="material-symbols-outlined mb-2 text-primary">pending_actions</span>
                  <p className="text-sm font-medium text-slate-500">Active Orders</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">12</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <span className="material-symbols-outlined mb-2 text-green-500">
                    account_balance_wallet
                  </span>
                  <p className="text-sm font-medium text-slate-500">Funded</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">5</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <span className="material-symbols-outlined mb-2 text-amber-500">lock_open</span>
                  <p className="text-sm font-medium text-slate-500">Waiting OTP</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">3</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <span className="material-symbols-outlined mb-2 text-red-500">report</span>
                  <p className="text-sm font-medium text-slate-500">Disputed</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">1</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h3 className="mb-4 text-lg font-bold">Orders History</h3>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                  <button className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white">
                    All
                  </button>
                  <button className="rounded-full px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                    Created
                  </button>
                  <button className="rounded-full px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                    Funded
                  </button>
                  <button className="rounded-full px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                    Waiting OTP
                  </button>
                  <button className="rounded-full px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                    Completed
                  </button>
                  <button className="rounded-full px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                    Disputed
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                      <th className="px-6 py-4">Seller</th>
                      <th className="px-6 py-4">Item &amp; ID</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-slate-200">
                            <img
                              className="rounded-full"
                              alt="Seller"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuDZFEmT-kblcXLv1zdNYFSOfY6IWZWnYgZ2UMtsMU1Mj3SAEshhzn8t1JvGNqMF4IqUqdF77YUXmKX3tEudIdf-dld2UNoC1GdQlUWjrnfv41IYqnNDCqvpd1iqf4rDrEhvwS8J2Ow6Ecxa2IbwtOJYEcjzAV3fqZWjKl7du-c7aNAmTcOzSz16RiGmGBJGTXh5NlU2vp-UlkIU0yGVifSHSgPlb2JZAuj1dpOINSuBRuI-x84GGtI3DmCRNWRS1_363qYFymDdgR"
                            />
                          </div>
                          <span className="text-sm font-medium">TechStore Inc.</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">MacBook Pro 14&quot;</span>
                          <span className="text-xs text-slate-400">#ORD-99231</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">$1,999.00</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          Waiting OTP
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">Oct 24, 2023</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm font-semibold text-primary hover:underline">
                          View Details
                        </button>
                      </td>
                    </tr>

                    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-slate-200">
                            <img
                              className="rounded-full"
                              alt="Seller"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoJXrfmIIGEhG61rf2rDkkwYZjdgwl3DAh4dnWyF8Tr9OFcZ73y6sapiT2Mo94KnFUZ29jtvPy4giZtBXXs9d7h1uZq2rnOx_UqBt5vY6Kw_PxN8WWAVyNlUEXSGXUCTZV7aso_ZYC3L-AYmNb3cMshUlXHRWAgGg9wOYcRq2jR8HI4vwX1uageFWqFXnKxysfZFRYeK2vtfXWdHxKdUfdetD7wLt38Wos9LZ7xPcyf5JT7lD9ZFVEnMFkuj3iph-up_86kDlywNjy"
                            />
                          </div>
                          <span className="text-sm font-medium">DesignStudio</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Custom Logo Design</span>
                          <span className="text-xs text-slate-400">#ORD-99105</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">$450.00</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Funded
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">Oct 22, 2023</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm font-semibold text-primary hover:underline">
                          View Details
                        </button>
                      </td>
                    </tr>

                    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-slate-200">
                            <img
                              className="rounded-full"
                              alt="Seller"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFeoeFitVTPCr2Kel2NyRyyPN9_FxXGwSMSAk9KZhhA3nyK7rVIEL5EQJbgoO0YDRyGRWmpd5E315Hf0ta-xFXF8Jed5GK4w8mUOewDRFYDSHPOHn28llSk4hFCJgueL9OAI12iNF1W4FzjEfr1bCAj-xNnDcEVakfFsWlPxGqxqRs9OhqDgQQIbZekblq_qZP2DPBzmsd422D2N4WjxKwHsCn7J4JyEa_Mf1mEdMhJ3G34rpz_zVwh6UbSG6AzVsVcTMXVGzwHBha"
                            />
                          </div>
                          <span className="text-sm font-medium">GadgetHub</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Wireless Headphones</span>
                          <span className="text-xs text-slate-400">#ORD-98842</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">$299.00</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Disputed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">Oct 20, 2023</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm font-semibold text-primary hover:underline">
                          View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 p-4 dark:border-slate-800">
                <span className="text-sm text-slate-500">Showing 3 of 12 active orders</span>
                <div className="flex gap-2">
                  <button className="rounded-md border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50 dark:border-slate-800">
                    Previous
                  </button>
                  <button className="rounded-md border border-slate-200 px-3 py-1 text-sm font-bold hover:bg-slate-50 dark:border-slate-800">
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="border-b border-slate-200 p-8 dark:border-slate-800 lg:col-span-2 lg:border-b-0 lg:border-r">
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Order Details: #ORD-99231</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Purchased from <strong>TechStore Inc.</strong>
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
                      Waiting OTP
                    </span>
                  </div>

                  <div className="relative space-y-8">
                    <div className="absolute bottom-2 left-4 top-2 w-0.5 bg-slate-100 dark:bg-slate-800" />

                    <div className="relative flex gap-6">
                      <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                        <span className="material-symbols-outlined text-sm">check</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Order Created</p>
                        <p className="text-xs text-slate-500">Oct 24, 2023 • 10:30 AM</p>
                      </div>
                    </div>

                    <div className="relative flex gap-6">
                      <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                        <span className="material-symbols-outlined text-sm">check</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Payment Funded</p>
                        <p className="text-xs text-slate-500">Oct 24, 2023 • 10:45 AM</p>
                        <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                          Funds are held securely in escrow by SafePay.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex gap-6">
                      <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white ring-4 ring-primary/20">
                        <span className="material-symbols-outlined text-sm">local_shipping</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Waiting Delivery OTP</p>
                        <p className="text-xs text-slate-500">In Progress</p>
                        <p className="mt-1 text-sm">
                          Seller has marked item as shipped. Confirm delivery using your OTP when
                          item arrives.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex gap-6 opacity-40">
                      <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-700">
                        <span className="material-symbols-outlined text-sm">verified</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Completed</p>
                        <p className="text-xs text-slate-500">Pending confirmation</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-slate-50 p-8 dark:bg-slate-800/20">
                  <div>
                    <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                      Order Summary
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Item</span>
                        <span className="text-sm font-medium">MacBook Pro 14&quot;</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Subtotal</span>
                        <span className="text-sm font-medium">$1,999.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          SafePay Fee (1.5%)
                        </span>
                        <span className="text-sm font-medium">$29.98</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                        <span className="font-bold">Total Funded</span>
                        <span className="font-bold text-primary">$2,028.98</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white transition-colors hover:bg-primary/90">
                      <span className="material-symbols-outlined">qr_code</span>
                      Confirm Delivery (OTP)
                    </button>
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-3 font-bold text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                      <span className="material-symbols-outlined">warning</span>
                      Open Dispute
                    </button>
                    <button className="w-full py-2 text-sm font-semibold text-red-500 hover:underline">
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default BuyerDashboardPage;
