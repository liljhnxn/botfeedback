import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BotFeedback — On-Chain Feedback on Botchain Testnet",
  description:
    "A clean, minimal Web3 dApp to permanently record and read feedback directly on Botchain Testnet (Chain ID 968).",
  keywords: ["Botchain", "Testnet", "Web3", "dApp", "Feedback", "Smart Contract"],
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080c14] text-slate-100 antialiased min-h-screen selection:bg-emerald-500/30 selection:text-emerald-300">
        <Providers>
          <div className="relative min-h-screen bg-mesh bg-grid-pattern">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
