function AdminDashboardPage() {
  return (
    <div className="bg-background-light font-display text-[#111418] transition-colors duration-200 dark:bg-background-dark dark:text-gray-100">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 bg-white px-10 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-primary">
              <div className="flex size-6 items-center justify-center">
                <span className="material-symbols-outlined text-3xl">shield_with_heart</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white">
                SafePay Admin
              </h2>
            </div>
            <label className="flex h-10 min-w-40 max-w-64 flex-col">
              <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
                <div className="flex items-center justify-center rounded-l-lg border-r-0 border-none bg-gray-100 pl-4 text-[#617589] dark:bg-gray-800 dark:text-gray-400">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none border-none border-l-0 bg-gray-100 px-4 pl-2 text-base font-normal text-[#111418] placeholder:text-[#617589] focus:border-none focus:outline-0 focus:ring-0 dark:bg-gray-800 dark:text-white"
                  placeholder="Search disputes..."
                  type="text"
                />
              </div>
            </label>
          </div>

          <div className="flex flex-1 items-center justify-end gap-6">
            <nav className="hidden items-center gap-6 md:flex">
              <a className="text-sm font-semibold leading-normal text-primary" href="#">
                Dashboard
              </a>
              <a
                className="text-sm font-medium leading-normal text-[#111418] hover:text-primary dark:text-gray-300"
                href="#"
              >
                Escrows
              </a>
              <a
                className="text-sm font-medium leading-normal text-[#111418] hover:text-primary dark:text-gray-300"
                href="#"
              >
                Disputes
              </a>
              <a
                className="text-sm font-medium leading-normal text-[#111418] hover:text-primary dark:text-gray-300"
                href="#"
              >
                Users
              </a>
            </nav>
            <div className="flex gap-2 border-l border-gray-200 pl-6 dark:border-gray-800">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[#111418] dark:bg-gray-800 dark:text-white">
                <span className="material-symbols-outlined text-xl">notifications</span>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[#111418] dark:bg-gray-800 dark:text-white">
                <span className="material-symbols-outlined text-xl">settings</span>
              </button>
              <a
                href="/"
                className="flex h-10 items-center justify-center gap-1 rounded-lg bg-gray-100 px-3 text-sm font-semibold text-[#111418] transition-colors hover:text-red-500 dark:bg-gray-800 dark:text-white"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                Logout
              </a>
            </div>
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-primary/20">
              <img
                alt="Admin profile"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUlqOPjcN7ctsFfPQpz8MFaoZAT8qck0z_0g9_mIJoilCBGdRsg18TUBDcYuYBIZdtL-2MaK48_MwiIv4d0QQr0QKcfCLi1yxjyVm4u3yU9xWH6jSjamrdJ9fy5-9M07Sei-MXErVK9fgTeWDZzqmy5wEPY5bdzUDmrq2jq6qZe8EldEWaQE36OflsYA8189drl86G8gYRSucAHOcfphpPZG6AD1ZXMhiDRouaA9nT0cDQFGANFs-as3rXPAojv8B-57wIdgPCFfbC"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          <aside className="hidden min-h-[calc(100vh-64px)] w-64 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 lg:block">
            <div className="flex flex-col gap-1">
              <div className="mb-2 px-3 py-2">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Main Menu
                </p>
              </div>
              <a className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 font-medium text-white" href="#">
                <span className="material-symbols-outlined">dashboard</span>
                <span>Overview</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                href="#"
              >
                <span className="material-symbols-outlined">gavel</span>
                <span>Disputes</span>
                <span className="ml-auto rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  24
                </span>
              </a>
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                href="#"
              >
                <span className="material-symbols-outlined">swap_horiz</span>
                <span>Transactions</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                href="#"
              >
                <span className="material-symbols-outlined">history_edu</span>
                <span>Audit Logs</span>
              </a>
              <div className="mb-2 mt-6 px-3 py-2">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  System
                </p>
              </div>
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                href="#"
              >
                <span className="material-symbols-outlined">group</span>
                <span>Users</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                href="#"
              >
                <span className="material-symbols-outlined">security</span>
                <span>Permissions</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                href="#"
              >
                <span className="material-symbols-outlined">help</span>
                <span>Support</span>
              </a>
            </div>
          </aside>

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1200px] p-8">
              <div className="mb-8 flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight text-[#111418] dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Monitoring blockchain escrow disputes and network liquidity.
                </p>
              </div>

              <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Open Disputes
                    </p>
                    <span className="material-symbols-outlined rounded-lg bg-orange-50 p-2 text-orange-500 dark:bg-orange-900/20">
                      error
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold leading-tight text-[#111418] dark:text-white">24</p>
                    <p className="mb-1 text-sm font-bold text-emerald-500">+5.2%</p>
                  </div>
                  <p className="text-xs text-gray-400">8 requires immediate attention</p>
                </div>

                <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Refunded Orders
                    </p>
                    <span className="material-symbols-outlined rounded-lg bg-blue-50 p-2 text-blue-500 dark:bg-blue-900/20">
                      replay
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold leading-tight text-[#111418] dark:text-white">142</p>
                    <p className="mb-1 text-sm font-bold text-red-500">-2.1%</p>
                  </div>
                  <p className="text-xs text-gray-400">Totaling $12,450.00 this month</p>
                </div>

                <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Transactions
                    </p>
                    <span className="material-symbols-outlined rounded-lg bg-emerald-50 p-2 text-emerald-500 dark:bg-emerald-900/20">
                      currency_bitcoin
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold leading-tight text-[#111418] dark:text-white">
                      12,850
                    </p>
                    <p className="mb-1 text-sm font-bold text-emerald-500">+12.5%</p>
                  </div>
                  <p className="text-xs text-gray-400">Processed through smart contracts</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-6 dark:border-gray-800">
                  <div>
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">
                      Active Escrow Disputes
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Review and moderate user conflicts
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <span className="material-symbols-outlined text-base">filter_list</span>
                      <span>Filter</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600">
                      <span className="material-symbols-outlined text-base">export_notes</span>
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Transaction ID
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Buyer
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Seller
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Amount (ETH)
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {[
                        {
                          id: '#tx_0x98f...2e1',
                          buyer: ['AM', 'Alex Morgan', 'emerald'],
                          seller: ['SK', 'Sarah King', 'blue'],
                          eth: '1.250 ETH',
                          usd: '$3,125.40',
                          status: ['Under Review', 'amber'],
                        },
                        {
                          id: '#tx_0x44d...8a3',
                          buyer: ['JD', 'John Doe', 'purple'],
                          seller: ['BM', 'BitMarket Ltd.', 'gray'],
                          eth: '0.450 ETH',
                          usd: '$1,125.10',
                          status: ['High Priority', 'red'],
                        },
                        {
                          id: '#tx_0x77c...b11',
                          buyer: ['RH', 'Robert Hunt', 'blue'],
                          seller: ['EL', 'Elena Lane', 'amber'],
                          eth: '4.800 ETH',
                          usd: '$12,001.92',
                          status: ['Awaiting Evidence', 'blue'],
                        },
                        {
                          id: '#tx_0x12a...0ff',
                          buyer: ['WL', 'Wilson Low', 'gray'],
                          seller: ['KG', 'Kelly Green', 'pink'],
                          eth: '0.090 ETH',
                          usd: '$225.10',
                          status: ['Pending Escalation', 'gray'],
                        },
                      ].map((row) => (
                        <tr
                          key={row.id}
                          className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                        >
                          <td className="px-6 py-4 font-mono text-xs text-primary">{row.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
                                  row.buyer[2] === 'emerald'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : row.buyer[2] === 'purple'
                                      ? 'bg-purple-100 text-purple-700'
                                      : row.buyer[2] === 'blue'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {row.buyer[0]}
                              </div>
                              <span className="text-sm font-medium">{row.buyer[1]}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
                                  row.seller[2] === 'blue'
                                    ? 'bg-blue-100 text-blue-700'
                                    : row.seller[2] === 'amber'
                                      ? 'bg-amber-100 text-amber-700'
                                      : row.seller[2] === 'pink'
                                        ? 'bg-pink-100 text-pink-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {row.seller[0]}
                              </div>
                              <span className="text-sm font-medium">{row.seller[1]}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{row.eth}</span>
                              <span className="text-xs text-gray-400">{row.usd}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                row.status[1] === 'amber'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                  : row.status[1] === 'red'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : row.status[1] === 'blue'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                              }`}
                            >
                              {row.status[0]}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white">
                                Approve Refund
                              </button>
                              <button className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/20 dark:text-emerald-400">
                                Mark Resolved
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <span className="text-sm text-gray-500">Showing 4 of 24 open disputes</span>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 opacity-50" disabled>
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button className="h-8 w-8 rounded-lg bg-primary text-sm font-bold text-white">
                      1
                    </button>
                    <button className="h-8 w-8 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                      2
                    </button>
                    <button className="h-8 w-8 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                      3
                    </button>
                    <button className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="mb-4 flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    Resolution Time Distribution
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Under 24h</span>
                        <span>65%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-full w-[65%] bg-emerald-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>24h - 72h</span>
                        <span>25%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-full w-[25%] bg-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Over 72h</span>
                        <span>10%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-full w-[10%] bg-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-800 dark:text-white">Admin Health Report</h3>
                    <p className="max-w-[200px] text-sm text-gray-500 dark:text-gray-400">
                      System integrity is stable. All smart contracts are responding within normal
                      parameters.
                    </p>
                    <button className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                      View full status{' '}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                  <div className="relative size-24">
                    <svg className="size-full" viewBox="0 0 36 36">
                      <path
                        className="stroke-gray-100 dark:stroke-gray-800"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="3"
                      />
                      <path
                        className="stroke-primary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="90, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-primary">90%</span>
                      <span className="text-[8px] font-bold uppercase text-gray-400">Score</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
