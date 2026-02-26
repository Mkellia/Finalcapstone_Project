function SellerOrderDetailsPage() {
  const isBuyerView = window.location.pathname.startsWith('/buyer-');
  const dashboardHref = isBuyerView ? '/buyer-dashboard' : '/seller-dashboard';
  const ordersHref = isBuyerView ? '/buyer-orders' : '/seller-orders';
  const disputesHref = isBuyerView ? '/buyer-disputes' : '#';

  return (
    <div className="bg-background-light font-display text-[#111418] transition-colors duration-200 dark:bg-background-dark dark:text-white">
      <div className="group/design-root relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] bg-white px-10 py-3 dark:border-[#2d3748] dark:bg-[#1a202c]">
            <div className="flex items-center gap-4 text-[#111418] dark:text-white">
              <div className="size-6 text-primary">
                <span className="material-symbols-outlined text-3xl">shield_with_heart</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white">
                SafePay
              </h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
              <nav className="flex items-center gap-9">
                <a
                  className="text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
                  href={dashboardHref}
                >
                  Dashboard
                </a>
                <a
                  className="border-b-2 border-primary text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
                  href={ordersHref}
                >
                  Orders
                </a>
                <a
                  className="text-sm font-medium leading-normal text-[#111418] transition-colors hover:text-primary dark:text-gray-300"
                  href={disputesHref}
                >
                  Disputes
                </a>
              </nav>
              <div className="flex gap-2">
                <button className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-[#f0f2f4] text-[#111418] transition-colors hover:bg-gray-200 dark:bg-[#2d3748] dark:text-white dark:hover:bg-gray-700">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-[#f0f2f4] text-[#111418] transition-colors hover:bg-gray-200 dark:bg-[#2d3748] dark:text-white dark:hover:bg-gray-700">
                  <span className="material-symbols-outlined">account_circle</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex flex-1 justify-center px-4 py-8 md:px-40">
            <div className="layout-content-container flex max-w-[1024px] flex-1 flex-col gap-6">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  className="text-sm font-medium leading-normal text-[#617589] transition-colors hover:text-primary dark:text-gray-400"
                  href={dashboardHref}
                >
                  Dashboard
                </a>
                <span className="material-symbols-outlined text-sm text-[#617589]">chevron_right</span>
                <a
                  className="text-sm font-medium leading-normal text-[#617589] transition-colors hover:text-primary dark:text-gray-400"
                  href={ordersHref}
                >
                  Orders
                </a>
                <span className="material-symbols-outlined text-sm text-[#617589]">chevron_right</span>
                <span className="text-sm font-semibold leading-normal text-[#111418] dark:text-white">
                  Order #SP-82931
                </span>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111418] dark:text-white">
                    Order #82931
                  </h1>
                  <p className="text-base font-normal leading-normal text-[#617589] dark:text-gray-400">
                    Secured by Blockchain Escrow Protocol
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex h-10 min-w-[84px] items-center justify-center overflow-hidden rounded-lg bg-[#f0f2f4] px-4 text-sm font-bold leading-normal text-[#111418] transition-all hover:opacity-80 dark:bg-[#2d3748] dark:text-white">
                    <span className="material-symbols-outlined mr-2 text-lg">download</span>
                    <span className="truncate">Invoice</span>
                  </button>
                  <button className="flex h-10 min-w-[84px] items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110">
                    <span className="material-symbols-outlined mr-2 text-lg">local_shipping</span>
                    <span className="truncate">Mark as Shipped</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 shadow-sm dark:border-[#2d3748] dark:bg-[#1a202c]">
                <div className="flex w-full items-center">
                  <div className="relative flex flex-1 flex-col items-center">
                    <div className="z-10 flex size-10 items-center justify-center rounded-full bg-primary text-white">
                      <span className="material-symbols-outlined">check</span>
                    </div>
                    <div className="absolute left-1/2 top-5 h-[2px] w-full bg-primary" />
                    <p className="mt-3 text-sm font-bold text-[#111418] dark:text-white">Created</p>
                    <p className="text-xs text-[#617589] dark:text-gray-400">Oct 24, 2023</p>
                  </div>

                  <div className="relative flex flex-1 flex-col items-center">
                    <div className="z-10 flex size-10 items-center justify-center rounded-full bg-primary text-white">
                      <span className="material-symbols-outlined">check</span>
                    </div>
                    <div className="absolute left-1/2 top-5 h-[2px] w-full bg-[#dbe0e6] dark:bg-[#2d3748]" />
                    <p className="mt-3 text-sm font-bold text-[#111418] dark:text-white">Paid</p>
                    <p className="text-xs text-[#617589] dark:text-gray-400">Oct 25, 2023</p>
                  </div>

                  <div className="relative flex flex-1 flex-col items-center">
                    <div className="z-10 flex size-10 items-center justify-center rounded-full border-2 border-primary bg-white text-primary dark:bg-[#1a202c]">
                      <span className="material-symbols-outlined">pending</span>
                    </div>
                    <div className="absolute left-1/2 top-5 h-[2px] w-full bg-[#dbe0e6] dark:bg-[#2d3748]" />
                    <p className="mt-3 text-sm font-bold text-primary">Delivered</p>
                    <p className="text-xs text-[#617589] dark:text-gray-400">Awaiting tracking</p>
                  </div>

                  <div className="flex flex-1 flex-col items-center">
                    <div className="z-10 flex size-10 items-center justify-center rounded-full border-2 border-transparent bg-[#f0f2f4] text-[#617589] dark:bg-[#2d3748] dark:text-gray-500">
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    <p className="mt-3 text-sm font-bold text-[#617589] dark:text-gray-500">Released</p>
                    <p className="text-xs text-[#617589] dark:text-gray-500">Pending</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-primary/20 bg-primary/10 p-4">
                <span className="material-symbols-outlined mt-0.5 text-primary">info</span>
                <div>
                  <p className="text-sm font-bold text-primary">Security Policy</p>
                  <p className="text-sm text-[#111418] dark:text-gray-200">
                    Funds are securely held in the escrow contract. Payment will be released to
                    your wallet immediately after the buyer confirms the receipt with the unique
                    One-Time Password (OTP) or upon expiration of the dispute window.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-2 flex flex-col items-stretch justify-start overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#2d3748] dark:bg-[#1a202c]">
                  <div className="flex items-center justify-between border-b border-[#e5e7eb] p-6 dark:border-[#2d3748]">
                    <p className="text-lg font-bold text-[#111418] dark:text-white">
                      Order Information
                    </p>
                    <span className="rounded px-2 py-1 text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                      In Progress
                    </span>
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="size-16 shrink-0 rounded-lg bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAvv6Rw9SoRita-gEB3fyRH6_fwGVtb2QIx7xWY2db7aMjmhJddfNGFVgQJS0udJfEFVzjU0iufePBixwdHBfS_gsH67h8yWYfW45hKuoZ0lU_hl9IMeTiBlqKCl04Y2UqtRcBwNA4sKQN3kH1atU4Bkw3uofPlYYlUA50ToyWou3qBOppgZAm1lbl7UzbAjfcEII51KzMw7xvROGyhZXpDVnrZKKhTjlGeVpdhnyR16XhU8dNCOQIZ49LwINjVyTK_8brGOwguygJv")',
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#617589] dark:text-gray-400">
                          Product/Service
                        </p>
                        <p className="text-base font-bold text-[#111418] dark:text-white">
                          Professional Graphic Design - Corporate Branding Package
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#617589] dark:text-gray-400">
                          Total Price
                        </p>
                        <p className="text-lg font-black text-primary">1.25 ETH</p>
                      </div>
                    </div>

                    <hr className="border-[#e5e7eb] dark:border-[#2d3748]" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase text-[#617589] dark:text-gray-400">
                          Buyer Address
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono text-[#111418] dark:text-white">
                            0x71C...392b
                          </p>
                          <button className="material-symbols-outlined text-xs text-[#617589] hover:text-primary">
                            content_copy
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase text-[#617589] dark:text-gray-400">
                          Escrow Smart Contract
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono text-primary underline">0x892...f71a</p>
                          <span className="material-symbols-outlined text-xs text-primary">
                            open_in_new
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between bg-[#f8fafc] px-6 py-4 dark:bg-[#2d3748]/30">
                    <button className="flex items-center gap-2 text-sm font-bold text-primary transition-all hover:underline">
                      <span className="material-symbols-outlined text-lg">chat_bubble</span>
                      Contact Buyer
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold text-[#617589] transition-all hover:text-[#111418] dark:text-gray-400 dark:hover:text-white">
                      <span className="material-symbols-outlined text-lg">report</span>
                      Report Issue
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2d3748] dark:bg-[#1a202c]">
                    <h3 className="mb-4 font-bold text-[#111418] dark:text-white">
                      Transaction Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#617589] dark:text-gray-400">Subtotal</span>
                        <span className="text-[#111418] dark:text-white">1.2500 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#617589] dark:text-gray-400">
                          Escrow Fee (0.5%)
                        </span>
                        <span className="text-[#111418] dark:text-white">-0.0062 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#617589] dark:text-gray-400">Network Gas (est.)</span>
                        <span className="text-[#111418] dark:text-white">0.0021 ETH</span>
                      </div>
                      <hr className="border-[#e5e7eb] dark:border-[#2d3748]" />
                      <div className="flex justify-between text-base font-bold">
                        <span className="text-[#111418] dark:text-white">Earnings</span>
                        <span className="text-green-600">~1.2438 ETH</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2d3748] dark:bg-[#1a202c]">
                    <h3 className="mb-4 font-bold text-[#111418] dark:text-white">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="size-2 rounded-full bg-primary" />
                          <div className="h-full w-[1px] bg-[#e5e7eb] dark:border-[#2d3748]" />
                        </div>
                        <div className="pb-4">
                          <p className="text-xs font-bold text-[#111418] dark:text-white">
                            Payment Received
                          </p>
                          <p className="text-[10px] text-[#617589] dark:text-gray-400">
                            Oct 25, 2023 - 09:12 AM
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="size-2 rounded-full bg-[#dbe0e6] dark:bg-gray-600" />
                          <div className="h-full w-[1px] border-l border-dashed border-[#e5e7eb] dark:border-[#2d3748]" />
                        </div>
                        <div className="pb-4">
                          <p className="text-xs font-bold text-[#617589] dark:text-gray-400">
                            Awaiting Shipment
                          </p>
                          <p className="text-[10px] text-[#617589] dark:text-gray-400">
                            Pending your action
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className="border-t border-[#e5e7eb] bg-white py-8 dark:border-[#2d3748] dark:bg-[#1a202c]">
            <div className="mx-auto flex max-w-[1024px] flex-col items-center justify-between gap-4 px-10 md:flex-row">
              <div className="flex items-center gap-2 text-[#617589] dark:text-gray-400">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span className="text-xs">Blockchain Secured Transaction Protocol v2.4</span>
              </div>
              <div className="flex gap-6">
                <a
                  className="text-xs text-[#617589] transition-colors hover:text-primary dark:text-gray-400"
                  href="#"
                >
                  Terms of Service
                </a>
                <a
                  className="text-xs text-[#617589] transition-colors hover:text-primary dark:text-gray-400"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-xs text-[#617589] transition-colors hover:text-primary dark:text-gray-400"
                  href="#"
                >
                  Escrow Rules
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default SellerOrderDetailsPage;
