import { create } from "zustand";
import { getWatchlistByEmail } from "../actions/watchlist.actions";
import { calculateChangePercent, formatMarketCap } from "../utils";

interface ChartData {
  open?: number | null;
  high?: number | null;
  low?: number | null;
  prevClose?: number | null;
}

interface WatchlistItem {
  _id: string;
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
  price?: number | null;
  marketCap?: string | null;
  peRatio?: number | null;
  chartData?: ChartData;
  change?: number;
}

interface WatchlistStore {
  watchlist: WatchlistItem[];
  loading: boolean;
  error: string | null;
  fetchWatchlistByEmail: (email: string | undefined) => Promise<void>;
  addItemToWatchlist: (item: WatchlistItem) => void;
  removeItemFromWatchlist: (symbol: string) => void;
}

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  watchlist: [],
  loading: false,
  error: null,

  fetchWatchlistByEmail: async (email) => {
    if (!email) {
      set({ watchlist: [], error: "Email is required" });
      return;
    }

    set({ loading: true, error: null });

    try {
      const items = await getWatchlistByEmail(email);
      const enrichedItems = items.map((item) => ({
        ...item,
        change: calculateChangePercent(
          item.chartData ?? {},
          item.price ?? null,
        ),
        marketCap: formatMarketCap(item.marketCap ?? null),
      }));
      set({ watchlist: enrichedItems, loading: false });
    } catch (err: any) {
      console.error("fetchWatchlistByEmail error:", err);
      set({
        watchlist: [],
        loading: false,
        error: err.message || "Failed to fetch watchlist",
      });
    }
  },
  addItemToWatchlist: (item: WatchlistItem) => {
    const { watchlist } = get();
    if (!watchlist.find((w) => w.symbol === item.symbol)) {
      set({ watchlist: [item, ...watchlist] });
    }
  },

  removeItemFromWatchlist: (symbol: string) => {
    const { watchlist } = get();
    set({ watchlist: watchlist.filter((w) => w.symbol !== symbol) });
  },
}));
