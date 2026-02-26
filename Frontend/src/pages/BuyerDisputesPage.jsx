function BuyerDisputesPage() {
  return (
    <div className="min-h-screen bg-background-light text-[#111418] dark:bg-background-dark dark:text-white">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] bg-white px-10 py-3 dark:border-[#2d3748] dark:bg-[#1a2634]">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-primary">
              <div className="size-8">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_330)">
                    <path
                      clipRule="evenodd"
                      d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6_330">
                      <rect width="48" height="48" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white">
                SafePay Escrow
              </h2>
            </div>
            <label className="flex h-10 min-w-40 max-w-64 flex-col">
              <div className="flex h-full w-full flex-1 items-stretch overflow-hidden rounded-lg">
                <div className="flex items-center justify-center bg-background-light pl-4 text-[#617589] dark:bg-[#2d3748]">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  className="form-input h-full w-full min-w-0 flex-1 border-none bg-background-light px-4 text-base font-normal leading-normal placeholder:text-[#617589] focus:ring-0 dark:bg-[#2d3748] dark:text-white"
                  placeholder="Search orders..."
                  type="text"
                />
              </div>
            </label>
          </div>

          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
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
              <a className="text-sm font-bold leading-normal text-primary" href="/buyer-disputes">
                Disputes
              </a>
              <a
                className="text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
                href="#"
              >
                Wallet
              </a>
            </div>
            <div className="flex gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-light text-[#111418] transition-colors hover:bg-gray-200 dark:bg-[#2d3748] dark:text-white">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-light text-[#111418] transition-colors hover:bg-gray-200 dark:bg-[#2d3748] dark:text-white">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
            <div
              className="aspect-square size-10 rounded-full border-2 border-primary bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC3k4GFx9-3ZL-gPIhJAi33El3QPTTXLim7lg_EFbqH4FlA0FoxXIAcq1saV1KUkbAvEMNcmXEBxTkaj0F8JCwznS7ayO7Dr0RL1wUfgPb4_cLGn36DsOt36sMe4Pgw0oPvVjHfx9CO5uTAm7jGrOrU_TcrtJJagW7sLS2oqnnbXXLIVvLpWscLi0rO88FyPPOtDG13FuVvsPjqSB6IXGo4q-2OxQ9AS_Owz11tkXcY_OjdISwFVJq8AEbfJV1MwL8Scr0-B5XoZ5c")',
              }}
            />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 py-8">
          <div className="mb-6 flex items-center gap-2">
            <a className="text-sm text-[#617589] hover:text-primary" href="/buyer-dashboard">
              Dashboard
            </a>
            <span className="text-sm text-[#617589]">/</span>
            <span className="text-sm font-semibold text-primary">Disputes</span>
          </div>

          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111418] dark:text-white">
              Buyer Disputes
            </h1>
            <p className="text-lg font-normal text-[#617589]">
              Manage and submit dispute requests for your escrow transactions securely on-chain.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2d3748] dark:bg-[#1a2634]">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#111418] dark:text-white">
                  <span className="material-symbols-outlined text-primary">gavel</span>
                  Submit New Dispute
                </h2>
                <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#111418] dark:text-gray-300">
                      Order ID
                    </label>
                    <input
                      className="w-full rounded-lg border-[#e5e7eb] px-4 py-2.5 focus:border-primary focus:ring-primary dark:border-[#2d3748] dark:bg-[#101922]"
                      placeholder="#SP-99210"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#111418] dark:text-gray-300">
                      Dispute Reason
                    </label>
                    <select className="w-full rounded-lg border-[#e5e7eb] px-4 py-2.5 focus:border-primary focus:ring-primary dark:border-[#2d3748] dark:bg-[#101922]">
                      <option value="">Select a reason</option>
                      <option value="not-delivered">Item not delivered</option>
                      <option value="not-as-described">Item not as described</option>
                      <option value="damaged">Damaged upon arrival</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#111418] dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      className="w-full rounded-lg border-[#e5e7eb] px-4 py-2.5 focus:border-primary focus:ring-primary dark:border-[#2d3748] dark:bg-[#101922]"
                      placeholder="Describe the issue in detail..."
                      rows="4"
                    />
                  </div>
                  <button
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    File Dispute
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#2d3748] dark:bg-[#1a2634]">
                <div className="flex items-center justify-between border-b border-[#e5e7eb] p-6 dark:border-[#2d3748]">
                  <h3 className="text-xl font-bold text-[#111418] dark:text-white">
                    Existing Disputes
                  </h3>
                  <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    <span className="material-symbols-outlined text-sm">filter_list</span> Filter
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-background-light dark:bg-[#101922]">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617589]">
                          Date
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617589]">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617589]">
                          Reason
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617589]">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617589]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e7eb] dark:divide-[#2d3748]">
                      {[
                        ['Oct 24, 2023', '#SP-99201', 'Not as described', 'Open', 'View Details'],
                        ['Oct 20, 2023', '#SP-98115', 'Item not delivered', 'Resolved', 'View Result'],
                        ['Oct 15, 2023', '#SP-98002', 'Damaged on arrival', 'Resolved', 'View Result'],
                        ['Oct 08, 2023', '#SP-97554', 'Shipping fraud', 'Resolved', 'View Result'],
                      ].map((row) => (
                        <tr
                          key={row[1]}
                          className="transition-colors hover:bg-gray-50 dark:hover:bg-[#2d3748]/30"
                        >
                          <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">{row[0]}</td>
                          <td className="px-6 py-4 text-sm font-mono text-primary">{row[1]}</td>
                          <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">{row[2]}</td>
                          <td className="px-6 py-4">
                            {row[3] === 'Open' ? (
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                <span className="mr-2 size-1.5 rounded-full bg-yellow-400" />
                                Open
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <span className="mr-2 size-1.5 rounded-full bg-green-400" />
                                Resolved
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-sm font-semibold text-primary hover:text-blue-700">
                              {row[4]}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-[#e5e7eb] px-6 py-4 dark:border-[#2d3748]">
                  <span className="text-sm text-[#617589]">Showing 4 of 4 results</span>
                  <div className="flex gap-2">
                    <button
                      className="rounded border border-[#e5e7eb] p-2 opacity-50 dark:border-[#2d3748]"
                      disabled
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="rounded border border-[#e5e7eb] p-2 hover:bg-gray-50 dark:border-[#2d3748] dark:hover:bg-[#2d3748]">
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-auto border-t border-[#e5e7eb] bg-white py-8 dark:border-[#2d3748] dark:bg-[#1a2634]">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="size-6 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-bold text-[#111418] dark:text-white">SafePay</span>
              <span className="text-sm text-[#617589]">© 2023 Blockchain Escrow System</span>
            </div>
            <div className="flex gap-6">
              <a className="text-sm text-[#617589] hover:text-primary" href="#">
                Terms
              </a>
              <a className="text-sm text-[#617589] hover:text-primary" href="#">
                Privacy
              </a>
              <a className="text-sm text-[#617589] hover:text-primary" href="#">
                Documentation
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default BuyerDisputesPage;
