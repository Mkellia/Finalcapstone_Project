function SellerDashboardPage() {
  return (
    <div className="bg-background-light font-display text-[#111418] transition-colors duration-200 dark:bg-background-dark dark:text-white">
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-[#dbe0e6] bg-white p-4 dark:border-[#2d3a4b] dark:bg-[#16222e]">
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1 px-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl font-bold text-primary">
                    shield
                  </span>
                  <h1 className="text-xl font-extrabold tracking-tight text-[#111418] dark:text-white">
                    SafePay
                  </h1>
                </div>
                <p className="pl-8 text-[10px] font-bold uppercase tracking-widest text-[#617589] dark:text-[#94a3b8]">
                  Seller Portal
                </p>
              </div>

              <nav className="flex flex-col gap-1">
                <a className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 text-white" href="#">
                  <span className="material-symbols-outlined">dashboard</span>
                  <span className="text-sm font-medium">Dashboard</span>
                </a>
                <a
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors hover:bg-background-light dark:text-[#94a3b8] dark:hover:bg-[#1e2d3d]"
                  href="/seller-orders"
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  <span className="text-sm font-medium">My Orders</span>
                </a>
                <a
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors hover:bg-background-light dark:text-[#94a3b8] dark:hover:bg-[#1e2d3d]"
                  href="#"
                >
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                  <span className="text-sm font-medium">Wallet</span>
                </a>
                <a
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors hover:bg-background-light dark:text-[#94a3b8] dark:hover:bg-[#1e2d3d]"
                  href="#"
                >
                  <span className="material-symbols-outlined">gavel</span>
                  <span className="text-sm font-medium">Disputes</span>
                </a>
                <a
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors hover:bg-background-light dark:text-[#94a3b8] dark:hover:bg-[#1e2d3d]"
                  href="#"
                >
                  <span className="material-symbols-outlined">settings</span>
                  <span className="text-sm font-medium">Settings</span>
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#dbe0e6] py-2.5 text-sm font-bold text-[#617589] transition-all hover:bg-background-light hover:text-red-500 dark:border-[#2d3a4b] dark:text-[#94a3b8] dark:hover:bg-[#1e2d3d]"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </a>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-[18px]">add_link</span>
                New Payment Link
              </button>
              <div className="flex items-center gap-3 border-t border-[#dbe0e6] p-2 pt-4 dark:border-[#2d3a4b]">
                <div
                  className="size-9 rounded-full border border-gray-200 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDbMkZ5R1JNU8bc0UgssKCRfCdAeq0p3ClMQ9BrXbRtwMMPp-Wi3_0cKIiEYoxC3BQUDoQTO_EIvVM8AECqb7AIld0zSNAcnFmdslpATVFlbKJ88xh-HZX8Q_WZPP5VUydVGeUGYY2GQBXTUaMvd7ZZW4sA1TGHnyUMZmGhXjzxehrJUpvecFVw8idbK-btPjjtE6gpfCSnbIO7rrhIynof18ZaKUJ4MoYqfXuALbB1WCjPBukKt1QtOO6r-Ncp6819djszsYC5NXrB")',
                  }}
                />
                <div className="min-w-0 flex-col">
                  <p className="truncate text-sm font-bold">Alex Rivard</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#617589]">Pro Seller</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex flex-1 flex-col overflow-y-auto">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#dbe0e6] bg-white px-8 dark:border-[#2d3a4b] dark:bg-[#16222e]">
            <div className="flex items-center gap-6">
              <h2 className="text-lg font-bold">Overview</h2>
              <div className="relative w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#617589]">
                  search
                </span>
                <input
                  className="w-full rounded-lg border-none bg-background-light py-1.5 pl-10 pr-4 text-sm transition-all focus:ring-1 focus:ring-primary dark:bg-[#1e2d3d]"
                  placeholder="Search orders..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative flex size-9 items-center justify-center rounded-lg bg-background-light text-[#617589] dark:bg-[#1e2d3d] dark:text-[#94a3b8]">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-red-500 dark:border-[#16222e]" />
              </button>
              <button className="flex size-9 items-center justify-center rounded-lg bg-background-light text-[#617589] dark:bg-[#1e2d3d] dark:text-[#94a3b8]">
                <span className="material-symbols-outlined">chat_bubble</span>
              </button>
              <div className="mx-2 h-8 w-px bg-[#dbe0e6] dark:border-[#2d3a4b]" />
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-500 dark:bg-emerald-500/10">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Network: Mainnet
                </span>
              </div>
            </div>
          </header>

          <div className="flex flex-col gap-8 p-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black tracking-tight">Seller Dashboard</h1>
              <p className="text-[#617589] dark:text-[#94a3b8]">
                Real-time tracking for your blockchain escrow transactions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="material-symbols-outlined mb-2 text-primary">pending_actions</span>
                <p className="text-sm font-medium text-slate-500">New Orders</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">24</p>
                  <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-500 dark:bg-emerald-500/10">
                    +12%
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="material-symbols-outlined mb-2 text-amber-500">account_balance</span>
                <p className="text-sm font-medium text-slate-500">Paid (Escrow)</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">12.85 ETH</p>
                <p className="text-xs text-slate-500">≈ $28,450.21 • Locked Funds</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="material-symbols-outlined mb-2 text-emerald-500">payments</span>
                <p className="text-sm font-medium text-slate-500">Released Payments</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">$142,800.00</p>
                  <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-500 dark:bg-emerald-500/10">
                    +18%
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#dbe0e6] bg-white shadow-sm dark:border-[#2d3a4b] dark:bg-[#16222e]">
              <div className="flex items-center justify-between border-b border-[#dbe0e6] p-6 dark:border-[#2d3a4b]">
                <h3 className="text-lg font-bold">Recent Orders</h3>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-[#dbe0e6] px-3 py-1.5 text-xs font-bold hover:bg-background-light dark:border-[#2d3a4b] dark:hover:bg-[#1e2d3d]">
                    Filter
                  </button>
                  <button className="rounded-lg border border-[#dbe0e6] px-3 py-1.5 text-xs font-bold hover:bg-background-light dark:border-[#2d3a4b] dark:hover:bg-[#1e2d3d]">
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-background-light/50 text-xs font-bold uppercase tracking-wider text-[#617589] dark:bg-[#1e2d3d]/50 dark:text-[#94a3b8]">
                      <th className="px-6 py-4">Buyer Address</th>
                      <th className="px-6 py-4">Item / Service</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Escrow Hash</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dbe0e6] text-sm dark:divide-[#2d3a4b]">
                    <tr className="transition-colors hover:bg-background-light/30 dark:hover:bg-[#1e2d3d]/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-gradient-to-tr from-primary to-blue-300" />
                          <span className="font-mono text-xs">0x71C...492d</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">Cloud Hosting (12 mo)</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">2.45 ETH</span>
                          <span className="text-[10px] text-[#617589]">$5,120.00</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                          <span className="size-1.5 rounded-full bg-amber-500" />
                          Escrowed
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-[#617589]">0x8a2...f31e</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a href="/seller-order-details" className="text-xs font-bold text-primary hover:underline">
                            View Order
                          </a>
                          <button className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-white">
                            Mark Delivered
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="transition-colors hover:bg-background-light/30 dark:hover:bg-[#1e2d3d]/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-300" />
                          <span className="font-mono text-xs">0x4a2...99bc</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">UI/UX Design Kit</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">0.85 ETH</span>
                          <span className="text-[10px] text-[#617589]">$1,780.00</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Released
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-[#617589]">0x12c...456d</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a href="/seller-order-details" className="text-xs font-bold text-primary hover:underline">
                            View Order
                          </a>
                          <button className="cursor-not-allowed rounded-lg bg-[#f0f2f4] px-3 py-1 text-xs font-bold text-[#111418] opacity-60 dark:bg-[#1e2d3d] dark:text-white">
                            Delivered
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="transition-colors hover:bg-background-light/30 dark:hover:bg-[#1e2d3d]/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-200" />
                          <span className="font-mono text-xs">0xfe2...128a</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">Smart Contract Audit</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">5.00 ETH</span>
                          <span className="text-[10px] text-[#617589]">$10,450.00</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                          <span className="size-1.5 rounded-full bg-blue-500" />
                          Delivered
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-[#617589]">0x992...31ac</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a href="/seller-order-details" className="text-xs font-bold text-primary hover:underline">
                            View Order
                          </a>
                          <button className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-white">
                            Remind Buyer
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="transition-colors hover:bg-background-light/30 dark:hover:bg-[#1e2d3d]/30">
                      <td className="border-b-0 px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-gradient-to-tr from-red-500 to-red-200" />
                          <span className="font-mono text-xs">0xbb2...31cc</span>
                        </div>
                      </td>
                      <td className="border-b-0 px-6 py-4 font-medium">Domain Name Sale</td>
                      <td className="border-b-0 px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">1.20 ETH</span>
                          <span className="text-[10px] text-[#617589]">$2,510.00</span>
                        </div>
                      </td>
                      <td className="border-b-0 px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-500/20 dark:text-red-400">
                          <span className="size-1.5 rounded-full bg-red-500" />
                          Disputed
                        </span>
                      </td>
                      <td className="border-b-0 px-6 py-4">
                        <span className="font-mono text-xs text-[#617589]">0x332...11ac</span>
                      </td>
                      <td className="border-b-0 px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-xs font-bold text-red-500 hover:underline">
                            Join Chat
                          </button>
                          <button className="rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white">
                            Resolution Center
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-[#dbe0e6] bg-background-light/20 p-4 dark:border-[#2d3a4b] dark:bg-[#1e2d3d]/20">
                <p className="text-xs text-[#617589] dark:text-[#94a3b8]">Showing 4 of 24 active orders</p>
                <div className="flex gap-1">
                  <button className="flex size-8 items-center justify-center rounded border border-[#dbe0e6] hover:bg-white dark:border-[#2d3a4b] dark:hover:bg-[#16222e]">
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button className="flex size-8 items-center justify-center rounded border border-primary bg-primary text-xs font-bold text-white">
                    1
                  </button>
                  <button className="flex size-8 items-center justify-center rounded border border-[#dbe0e6] text-xs font-bold hover:bg-white dark:border-[#2d3a4b] dark:hover:bg-[#16222e]">
                    2
                  </button>
                  <button className="flex size-8 items-center justify-center rounded border border-[#dbe0e6] text-xs font-bold hover:bg-white dark:border-[#2d3a4b] dark:hover:bg-[#16222e]">
                    3
                  </button>
                  <button className="flex size-8 items-center justify-center rounded border border-[#dbe0e6] hover:bg-white dark:border-[#2d3a4b] dark:hover:bg-[#16222e]">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-2">
              <div className="rounded-xl border border-[#dbe0e6] bg-white p-6 dark:border-[#2d3a4b] dark:bg-[#16222e]">
                <h3 className="mb-4 font-bold">Payout Schedule</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-background-light p-3 dark:bg-[#1e2d3d]">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">schedule</span>
                      <div>
                        <p className="text-sm font-bold">Next Automatic Release</p>
                        <p className="text-[10px] text-[#617589]">Project: UI Design Kit</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold">In 4h 12m</p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-background-light p-3 dark:bg-[#1e2d3d]">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">event_available</span>
                      <div>
                        <p className="text-sm font-bold">Batch Disbursement</p>
                        <p className="text-[10px] text-[#617589]">All cleared funds to wallet</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold">Monday, 09:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#dbe0e6] bg-white p-6 dark:border-[#2d3a4b] dark:bg-[#16222e]">
                <h3 className="mb-4 font-bold">Security Overview</h3>
                <div className="flex items-center gap-4">
                  <div className="relative size-16">
                    <svg className="size-full" viewBox="0 0 36 36">
                      <circle
                        className="stroke-gray-200 dark:stroke-gray-700"
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        strokeWidth="3"
                      />
                      <circle
                        className="stroke-primary"
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="85, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                      85%
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Wallet Security: Strong</p>
                    <p className="mt-1 text-xs text-[#617589] dark:text-[#94a3b8]">
                      Multi-sig is active. 2 of 3 confirmations required for manual withdrawals.
                    </p>
                  </div>
                  <button className="text-xs font-bold text-primary hover:underline">Manage</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SellerDashboardPage;
