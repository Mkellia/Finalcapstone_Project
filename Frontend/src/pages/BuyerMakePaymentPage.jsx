import { useState } from 'react';

function BuyerMakePaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('mobile-money');

  return (
    <div className="bg-background-light font-display text-[#111418] transition-colors duration-200 dark:bg-background-dark dark:text-white">
      <div className="group/design-root relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f2f4] bg-white px-10 py-3 dark:border-gray-800 dark:bg-background-dark">
            <div className="flex items-center gap-4">
              <div className="size-6 text-primary">
                <span className="material-symbols-outlined text-3xl">shield_with_heart</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white">
                SafePay
              </h2>
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
                  Settings
                </a>
              </div>
              <div
                className="aspect-square size-10 rounded-full border border-gray-200 bg-cover bg-center bg-no-repeat dark:border-gray-700"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCrHQzZ-v0R3RsNQBgU5vlfK577AX5DbeMdsMhBoZG7kAhZhg-eUAXfCnk0jLx16m7N2rjUhjRLhATQ3V0idmvM2wiUrrdInzFzcK18lyIT_WEwJnqG_CGo6WpTMjeNEthkNlLHrW5yam3evi3n5d09NlDk7GS0SM6w0ISQ4IW8r2u_CSYS9HyULTELCMjZnzuu2wN5pCqq6ij7hEWu7iFwvaYrIalwaqrtMBB5v0CDFdVgsMv0FPUbahT-xmY7fu2wsE0mReQtscQY")',
                }}
              />
            </div>
          </header>

          <div className="flex flex-1 justify-center px-4 py-10 md:px-40">
            <div className="layout-content-container flex max-w-[800px] flex-1 flex-col">
              <div className="mb-8 flex flex-col gap-3">
                <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111418] dark:text-white">
                  Make Payment
                </p>
                <p className="text-base font-normal leading-normal text-[#617589] dark:text-gray-400">
                  Secure your transaction with our smart contract blockchain escrow
                </p>
              </div>

              <div className="mb-8 overflow-hidden rounded-xl border border-[#f0f2f4] bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-[#f0f2f4] bg-gray-50 px-6 py-5 dark:border-gray-800 dark:bg-gray-800/50">
                  <h2 className="text-lg font-bold text-[#111418] dark:text-white">Order Details</h2>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    Secure Escrow Active
                  </span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
                    <div className="flex items-center justify-between py-1">
                      <p className="text-sm font-normal text-[#617589] dark:text-gray-400">Order ID</p>
                      <p className="text-sm font-semibold text-[#111418] dark:text-white">#SP-99284</p>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <p className="text-sm font-normal text-[#617589] dark:text-gray-400">Seller</p>
                      <p className="text-sm font-semibold text-[#111418] dark:text-white">
                        CryptoGlobal Solutions
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <p className="text-sm font-normal text-[#617589] dark:text-gray-400">Network</p>
                      <p className="text-sm font-semibold text-[#111418] dark:text-white">
                        Polygon (MATIC)
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <p className="text-sm font-normal text-[#617589] dark:text-gray-400">Status</p>
                      <p className="text-sm font-semibold text-orange-500">Awaiting Payment</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-end justify-between border-t border-[#f0f2f4] pt-6 dark:border-gray-800">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase text-[#617589] dark:text-gray-400">
                        Total Amount Due
                      </p>
                      <p className="text-3xl font-black text-[#111418] dark:text-white">
                        4,500.00 <span className="text-primary">USDT</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="max-w-[200px] text-[10px] leading-tight text-[#617589] dark:text-gray-400">
                        Funds will be held in escrow until you confirm receipt of goods or
                        services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="mb-6 text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white">
                Select Payment Method
              </h2>
              <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                <label
                  className={`relative flex cursor-pointer rounded-xl border-2 p-6 shadow-sm transition-all ${
                    paymentMethod === 'mobile-money'
                      ? 'border-primary bg-primary/5 hover:bg-primary/10'
                      : 'border-gray-200 bg-white hover:border-primary/50 dark:border-gray-800 dark:bg-gray-900'
                  }`}
                >
                  <input
                    checked={paymentMethod === 'mobile-money'}
                    onChange={() => setPaymentMethod('mobile-money')}
                    className="sr-only"
                    name="payment-method"
                    type="radio"
                    value="mobile-money"
                  />
                  <div className="flex w-full items-start justify-between">
                    <div className="flex flex-col">
                      <div className="mb-3 flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined text-3xl ${
                            paymentMethod === 'mobile-money'
                              ? 'text-primary'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          smartphone
                        </span>
                        <span className="font-bold text-[#111418] dark:text-white">Mobile Money</span>
                      </div>
                      <p className="text-sm text-[#617589] dark:text-gray-400">
                        Instant transfer via M-Pesa, MTN, or Airtel Money. Best for local
                        payments.
                      </p>
                    </div>
                    <span
                      className={`material-symbols-outlined ${
                        paymentMethod === 'mobile-money'
                          ? 'text-primary'
                          : 'text-gray-200 dark:text-gray-700'
                      }`}
                    >
                      {paymentMethod === 'mobile-money' ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                </label>

                <label
                  className={`relative flex cursor-pointer rounded-xl border-2 p-6 shadow-sm transition-all ${
                    paymentMethod === 'bank-transfer'
                      ? 'border-primary bg-primary/5 hover:bg-primary/10'
                      : 'border-gray-200 bg-white hover:border-primary/50 dark:border-gray-800 dark:bg-gray-900'
                  }`}
                >
                  <input
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={() => setPaymentMethod('bank-transfer')}
                    className="sr-only"
                    name="payment-method"
                    type="radio"
                    value="bank-transfer"
                  />
                  <div className="flex w-full items-start justify-between">
                    <div className="flex flex-col">
                      <div className="mb-3 flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined text-3xl ${
                            paymentMethod === 'bank-transfer'
                              ? 'text-primary'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          account_balance
                        </span>
                        <span className="font-bold text-[#111418] dark:text-white">Bank Transfer</span>
                      </div>
                      <p className="text-sm text-[#617589] dark:text-gray-400">
                        Direct wire transfer from your bank account. May take up to 24 hours to
                        clear.
                      </p>
                    </div>
                    <span
                      className={`material-symbols-outlined ${
                        paymentMethod === 'bank-transfer'
                          ? 'text-primary'
                          : 'text-gray-200 dark:text-gray-700'
                      }`}
                    >
                      {paymentMethod === 'bank-transfer'
                        ? 'check_circle'
                        : 'radio_button_unchecked'}
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:bg-primary/90 active:scale-[0.98]"
                  onClick={() => {
                    window.location.pathname = '/buyer-confirm-delivery';
                  }}
                >
                  <span className="material-symbols-outlined">lock</span>
                  Pay 4,500.00 USDT Now
                </button>
                <p className="flex items-center justify-center gap-1 text-center text-xs text-[#617589] dark:text-gray-400">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  Payments are secured by 256-bit encryption and blockchain verification
                </p>
              </div>

              <div className="mt-16 flex flex-col items-center gap-4 border-t border-gray-200 pt-8 dark:border-gray-800">
                <p className="text-sm text-[#617589] dark:text-gray-500">Need help with your payment?</p>
                <div className="flex gap-4">
                  <a className="flex items-center gap-1 text-sm font-semibold text-primary" href="#">
                    <span className="material-symbols-outlined text-sm">contact_support</span>
                    Contact Support
                  </a>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <a className="flex items-center gap-1 text-sm font-semibold text-primary" href="#">
                    <span className="material-symbols-outlined text-sm">description</span>
                    Payment FAQ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerMakePaymentPage;
