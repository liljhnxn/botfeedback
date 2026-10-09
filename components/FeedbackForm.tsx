"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BOT_FEEDBACK_ABI, BOT_FEEDBACK_ADDRESS, getExplorerTxUrl } from "@/lib/contract";
import { botchainTestnet } from "@/lib/botchain";
import { Star, Send, Loader2, CheckCircle2, AlertCircle, ExternalLink, Sparkles } from "lucide-react";

interface FeedbackFormProps {
  onSuccess?: () => void;
}

export function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { isConnected, chainId } = useAccount();

  const {
    data: hash,
    isPending: isWritePending,
    writeContract,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const MAX_CHARS = 280;

  // Handle successful submission
  useEffect(() => {
    if (isConfirmed) {
      setMessage("");
      setRating(5);
      setValidationError(null);
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isConfirmed, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!BOT_FEEDBACK_ADDRESS) {
      setValidationError("BotFeedback contract is not configured yet.");
      return;
    }

    if (!isConnected) {
      setValidationError("Please connect your wallet first.");
      return;
    }

    if (chainId !== botchainTestnet.id) {
      setValidationError("Please switch to Botchain Testnet to submit feedback.");
      return;
    }

    const trimmed = message.trim();
    if (!trimmed) {
      setValidationError("Please enter a feedback message.");
      return;
    }

    if (trimmed.length > MAX_CHARS) {
      setValidationError(`Message exceeds the maximum limit of ${MAX_CHARS} characters.`);
      return;
    }

    if (rating < 1 || rating > 5) {
      setValidationError("Please select a rating between 1 and 5 stars.");
      return;
    }

    resetWrite();

    writeContract({
      address: BOT_FEEDBACK_ADDRESS,
      abi: BOT_FEEDBACK_ABI,
      functionName: "submitFeedback",
      args: [trimmed, rating],
    });
  };

  const isSubmitting = isWritePending || isConfirming;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Submit Feedback
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Share your experience. Recorded permanently on Botchain Testnet.
          </p>
        </div>
      </div>

      {!BOT_FEEDBACK_ADDRESS && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-200">Contract Not Configured</p>
            <p className="mt-0.5">
              BotFeedback contract is not configured yet. Please deploy the contract and set{" "}
              <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                NEXT_PUBLIC_BOT_FEEDBACK_ADDRESS
              </code>{" "}
              in your environment.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating Selector */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating ?? rating) >= star;
              return (
                <button
                  type="button"
                  key={star}
                  id={`rating-star-${star}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  disabled={isSubmitting}
                  className="p-1 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform ${
                      active
                        ? "text-amber-400 fill-amber-400 scale-110"
                        : "text-slate-600 hover:text-slate-500"
                    }`}
                  />
                </button>
              );
            })}
            <span className="ml-3 text-sm font-medium text-slate-300">
              {rating} / 5 {rating === 5 ? "⭐⭐⭐⭐⭐" : ""}
            </span>
          </div>
        </div>

        {/* Feedback Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="feedback-message"
              className="block text-xs font-medium uppercase tracking-wider text-slate-400"
            >
              Message
            </label>
            <span
              className={`text-xs font-mono ${
                message.length > MAX_CHARS
                  ? "text-rose-400 font-bold"
                  : message.length >= MAX_CHARS - 20
                  ? "text-amber-400"
                  : "text-slate-500"
              }`}
            >
              {message.length} / {MAX_CHARS}
            </span>
          </div>
          <textarea
            id="feedback-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            placeholder="Write your feedback here... (Publicly readable and permanently stored on-chain)"
            maxLength={MAX_CHARS + 10}
            className="w-full bg-slate-950/70 border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 transition-all resize-none outline-none disabled:opacity-50"
          />
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submission Failure Banner */}
        {writeError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="overflow-hidden break-words">
              <p className="font-semibold text-rose-200">Transaction Failed</p>
              <p className="mt-0.5 line-clamp-2">
                {writeError.message.includes("User rejected")
                  ? "Transaction was cancelled in your wallet."
                  : writeError.message}
              </p>
            </div>
          </div>
        )}

        {/* Confirming Status */}
        {isWritePending && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-2.5 text-xs text-blue-300">
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
            <span>Confirm the transaction in your wallet...</span>
          </div>
        )}

        {isConfirming && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2.5 text-xs text-amber-300">
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
            <div>
              <span>Transaction submitted. Waiting for confirmation on Botchain...</span>
              {hash && (
                <a
                  href={getExplorerTxUrl(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:underline ml-2 font-mono"
                >
                  View on Explorer <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Success Banner with Explorer link */}
        {isConfirmed && hash && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-200 text-sm">
                Feedback Submitted Successfully!
              </p>
              <p className="mt-1 text-slate-300">
                Your feedback has been permanently recorded on Botchain Testnet.
              </p>
              <div className="mt-2">
                <a
                  href={getExplorerTxUrl(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono font-medium hover:underline"
                >
                  <span>Tx Hash: {hash.slice(0, 10)}...{hash.slice(-8)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            id="submit-feedback-btn"
            disabled={
              isSubmitting ||
              !message.trim() ||
              message.trim().length > MAX_CHARS ||
              !isConnected
            }
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isWritePending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirm in Wallet...</span>
              </>
            ) : isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Recording on Botchain...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isConnected ? "Submit Feedback" : "Connect Wallet to Submit"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
