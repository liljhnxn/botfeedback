"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/lib/botchain";
import { shortenAddress } from "@/lib/contract";
import { Wallet, LogOut, AlertTriangle, ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-36 bg-slate-800/60 rounded-xl animate-pulse border border-slate-700/50" />
    );
  }

  // If connected, check if on the correct chain
  if (isConnected && address) {
    const isWrongNetwork = chainId !== botchainTestnet.id;

    if (isWrongNetwork) {
      return (
        <div className="flex items-center gap-2">
          <button
            id="switch-network-btn"
            onClick={() => switchChain({ chainId: botchainTestnet.id })}
            disabled={isSwitching}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/25 transition-all shadow-sm shadow-amber-500/10"
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{isSwitching ? "Switching..." : "Switch to Botchain (968)"}</span>
            <ArrowRightLeft className="w-3 h-3 ml-1" />
          </button>
          <button
            id="disconnect-wallet-btn"
            onClick={() => disconnect()}
            title="Disconnect Wallet"
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 border border-emerald-500/30 rounded-xl text-xs font-medium text-slate-200 shadow-sm shadow-emerald-500/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-300">{shortenAddress(address)}</span>
        </div>
        <button
          id="disconnect-wallet-btn"
          onClick={() => disconnect()}
          title="Disconnect Wallet"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10 border border-slate-700/60 hover:border-rose-500/30 rounded-xl transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  // Not connected state
  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.type === "injected") || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <button
      id="connect-wallet-btn"
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="w-4 h-4" />
      <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
    </button>
  );
}
