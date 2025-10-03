import { create } from "zustand";
import { searchStocks } from "../actions/finnhup.actions";
import {
  createWatchList,
  deleteWatchLisForUser,
  fetchWatchListBerUser,
} from "../actions/watchlist.actions";

interface StockWithWatchlistStatus {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  isInWatchlist: boolean;
}

interface StockState {
  stocks: StockWithWatchlistStatus[];
  watchlistSymbols: string[];
  loading: boolean;
  error: string | null;
  fetchStocks: (params?: { query?: string; userId?: string }) => Promise<void>;
  addToWatchlist: (
    userId: string,
    stock: StockWithWatchlistStatus,
  ) => Promise<void>;
  removeFromWatchlist: (userId: string, symbol: string) => Promise<void>;
}

export const useStockStore = create<StockState>((set, get) => ({
  stocks: [],
  watchlistSymbols: [],
  loading: false,
  error: null,

  fetchStocks: async ({ query, userId } = {}) => {
    set({ loading: true, error: null });

    try {
      const stocks = await searchStocks(query);

      let watchlistSymbols: string[] = [];

      if (userId) {
        const watchlist = await fetchWatchListBerUser({ userId });
        watchlistSymbols = watchlist?.watchlistSymbols ?? [];
        set({ watchlistSymbols });
      }

      const stocksWithStatus = stocks.map((stock) => ({
        ...stock,
        isInWatchlist: watchlistSymbols.includes(stock.symbol.toUpperCase()),
      }));

      set({ stocks: stocksWithStatus, loading: false });
    } catch (err: any) {
      console.error("Error fetching stocks:", err);
      set({
        error: err.message ?? "Something went wrong",
        stocks: [],
        loading: false,
      });
    }
  },

  addToWatchlist: async (userId, stock) => {
    await createWatchList({
      userId,
      symbol: stock.symbol,
      company: stock.name,
    });
    set((state) => ({
      watchlistSymbols: [...state.watchlistSymbols, stock.symbol.toUpperCase()],
      stocks: state.stocks.map((s) =>
        s.symbol === stock.symbol ? { ...s, isInWatchlist: true } : s,
      ),
    }));
  },

  removeFromWatchlist: async (userId, symbol) => {
    await deleteWatchLisForUser({ userId, symbol });
    set((state) => ({
      watchlistSymbols: state.watchlistSymbols.filter(
        (s) => s !== symbol.toUpperCase(),
      ),
      stocks: state.stocks.map((s) =>
        s.symbol === symbol ? { ...s, isInWatchlist: false } : s,
      ),
    }));
  },
}));
