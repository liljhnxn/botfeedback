"use client";

import { useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { FeedbackForm } from "@/components/FeedbackForm";
import { FeedbackList } from "@/components/FeedbackList";
import { BOT_FEEDBACK_ADDRESS, getExplorerAddressUrl, shortenAddress } from "@/lib/contract";
import {
  MessageSquareHeart,
  Globe2,
  ExternalLink,
  ShieldAlert,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFeedbackSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navigation / Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  BotFeedback
                </h1>
                {/* Botchain Testnet Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Botchain Testnet
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Share your feedback. Recorded on Botchain.
              </p>
            </div>
          </div>

          {/* Right Header: Wallet Button & Explorer link */}
          <div className="flex items-center gap-3">
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Explorer</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-4 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Immutable & Decentralized Feedback Log</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Permanent Community Feedback
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Submit ratings and reviews stored directly on Botchain Testnet. Transparent, public, and tamper-proof.
          </p>
        </div>

        {/* Contract Info Banner */}
        <div className="max-w-4xl mx-auto mb-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-slate-300">
              <span className="font-semibold text-white">Botchain Testnet:</span> Chain ID <span className="font-mono text-emerald-300">968</span> • RPC: <span className="font-mono text-slate-400">https://rpc.bohr.life</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Contract:</span>
            {BOT_FEEDBACK_ADDRESS ? (
              <a
                href={getExplorerAddressUrl(BOT_FEEDBACK_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 hover:underline font-medium"
              >
                <span>{shortenAddress(BOT_FEEDBACK_ADDRESS)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-amber-400 font-medium">Not configured</span>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Layout for Form and List */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
          {/* Submission Form */}
          <FeedbackForm onSuccess={handleFeedbackSuccess} />

          {/* Feedback List */}
          <FeedbackList refreshTrigger={refreshTrigger} />
        </div>

        {/* Public Warning & Transparency Notice */}
        <div className="max-w-4xl mx-auto mt-10 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-400 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Public & Permanent: </span>
            All feedback submitted through this dApp is recorded directly onto the Botchain Testnet blockchain. 
            Entries cannot be edited or deleted once confirmed. Never submit sensitive personal details, passwords, or confidential private keys.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            BotFeedback © 2026 • Powered by Botchain Testnet (Chain ID 968)
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors inline-flex items-center gap-1"
            >
              <span>Botchain Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://rpc.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              RPC Endpoint
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
