"use client";
import { useStockStore } from "@/lib/store/stock-store";
import { useUserStore } from "@/lib/store/user-store";
import { Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const WatchlistButton = ({
  symbol,
  company,
  type = "button",
}: WatchlistButtonProps) => {
  const session = useUserStore((state) => state.session);
  const [ShowTrashIcon, setShowTrashIcon] = useState(false);
  const {
    addToWatchlist,
    removeFromWatchlist,
    watchlistSymbols,
    loadingSymbol,
  } = useStockStore();
  const added = watchlistSymbols.includes(symbol.toUpperCase());
  const loading = loadingSymbol === symbol;
  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);
  useEffect(() => {
    setShowTrashIcon(added);
  }, [added]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user?.id) {
      toast.error("You must be logged in to use Watchlist");
      return;
    }

    try {
      if (added) {
        await removeFromWatchlist(session.user.id, symbol);
        toast.success(`${symbol} removed from Watchlist`);
      } else {
        await addToWatchlist(session.user.id, {
          symbol,
          name: company,
          exchange: "",
          type: "Stock",
          isInWatchlist: true,
        });
        toast.success(`${symbol} added to Watchlist`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Watchlist action failed", {
        description: e instanceof Error ? e.message : "Unknown error",
      });
    }
  };
  if (type === "icon") {
    return (
      <button
        title={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        aria-label={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
        onClick={handleClick}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={added ? "#FACC15" : "none"}
            stroke="#FACC15"
            strokeWidth="1.5"
            className="watchlist-star bg-gray-700 rounded-full p-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      className={`watchlist-btn flex items-center justify-center gap-1 ${added ? "watchlist-remove" : ""}`}
      onClick={handleClick}
      disabled={loading}
    >
      {ShowTrashIcon && added && !loading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6"
          />
        </svg>
      )}

      {loading ? (
        <span className="flex justify-center gap-1 items-center">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          Loading...
        </span>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
};

export default WatchlistButton;
