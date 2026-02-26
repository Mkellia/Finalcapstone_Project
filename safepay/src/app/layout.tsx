import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: 'SafePay — Blockchain Escrow',
  description: 'Secure payments for online transactions in Rwanda',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}