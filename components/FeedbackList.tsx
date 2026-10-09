"use client";

import { useReadContract } from "wagmi";
import {
  BOT_FEEDBACK_ABI,
  BOT_FEEDBACK_ADDRESS,
  getExplorerAddressUrl,
  shortenAddress,
} from "@/lib/contract";
import {
  Star,
  MessageSquare,
  ExternalLink,
  Clock,
  RotateCw,
  Award,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";

interface FeedbackItem {
  sender: `0x${string}`;
  message: string;
  rating: number;
  timestamp: bigint;
}

interface FeedbackListProps {
  refreshTrigger?: number;
}

export function FeedbackList({ refreshTrigger }: FeedbackListProps) {
  // Read all feedback entries
  const {
    data: allFeedbackData,
    isLoading: isFeedbackLoading,
    refetch: refetchFeedback,
    isRefetching,
  } = useReadContract({
    address: BOT_FEEDBACK_ADDRESS,
    abi: BOT_FEEDBACK_ABI,
    functionName: "getAllFeedback",
    query: {
      enabled: !!BOT_FEEDBACK_ADDRESS,
      refetchInterval: 10000, // auto refetch every 10 seconds
    },
  });

  // Read average rating
  const { data: averageRatingData, refetch: refetchAverage } = useReadContract({
    address: BOT_FEEDBACK_ADDRESS,
    abi: BOT_FEEDBACK_ABI,
    functionName: "getAverageRating",
    query: {
      enabled: !!BOT_FEEDBACK_ADDRESS,
    },
  });

  // Parse feedback entries and reverse so newest feedback is first
  const feedbackList = useMemo(() => {
    if (!allFeedbackData || !Array.isArray(allFeedbackData)) return [];

    const items: FeedbackItem[] = allFeedbackData.map((item: any) => ({
      sender: item.sender,
      message: item.message,
      rating: Number(item.rating),
      timestamp: BigInt(item.timestamp),
    }));

    // Newest first
    return [...items].reverse();
  }, [allFeedbackData]);

  const totalCount = feedbackList.length;

  const averageRating = useMemo(() => {
    if (!averageRatingData || totalCount === 0) return 0;
    const raw = Number(averageRatingData);
    return (raw / 10).toFixed(1);
  }, [averageRatingData, totalCount]);

  const handleRefresh = () => {
    refetchFeedback();
    refetchAverage();
  };

  const formatTimestamp = (timestampBigInt: bigint) => {
    try {
      const ms = Number(timestampBigInt) * 1000;
      const date = new Date(ms);
      if (isNaN(date.getTime())) return "Unknown date";

      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="space-y-6">
      {/* List Header and Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>Community Feedback</span>
            <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 font-mono px-2 py-0.5 rounded-full">
              {totalCount} {totalCount === 1 ? "entry" : "entries"}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed recorded directly on the blockchain
          </p>
        </div>

        <div className="flex items-center gap-3">
          {totalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-medium text-amber-300">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Avg: {averageRating} / 5</span>
            </div>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefetching || !BOT_FEEDBACK_ADDRESS}
            title="Refresh Feedback"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-all disabled:opacity-50"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-emerald-400" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isFeedbackLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-28 bg-slate-900/40 border border-slate-800/60 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isFeedbackLoading && totalCount === 0 && (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-medium text-slate-200">
            No feedback yet. Be the first to share your thoughts!
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5">
            Submit a message using the form above to record the first piece of feedback on Botchain Testnet.
          </p>
        </div>
      )}

      {/* Feedback Items Feed */}
      {!isFeedbackLoading && totalCount > 0 && (
        <div className="space-y-4">
          {feedbackList.map((item, index) => (
            <div
              key={`${item.sender}-${item.timestamp.toString()}-${index}`}
              className="bg-slate-900/70 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md shadow-black/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <a
                    href={getExplorerAddressUrl(item.sender)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-300 hover:text-emerald-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
                  >
                    <span>{shortenAddress(item.sender)}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  {/* Star Rating Display */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= item.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-700"
                        }`}
                      />
                    ))}
                    <span className="text-slate-400 font-medium ml-1">
                      {item.rating}/5
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(item.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Feedback Message */}
              <p className="mt-3 text-sm text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
