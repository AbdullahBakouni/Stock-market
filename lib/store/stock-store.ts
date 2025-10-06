import { create } from "zustand";
import { searchStocks } from "../actions/finnhup.actions";
import {
  createWatchList,
  deleteWatchLisForUser,
  fetchWatchListBerUser,
} from "../actions/watchlist.actions";
import { useWatchlistStore } from "./watchlist-store";
import { calculateChangePercent, formatMarketCap } from "../utils";
interface ChartData {
  open?: number | null;
  high?: number | null;
  low?: number | null;
  prevClose?: number | null;
}
interface StockWithWatchlistStatus {
  _id?: string;
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  isInWatchlist: boolean;
  price?: number | null;
  marketCap?: string | null;
  peRatio?: number | null;
  change?: number;
  chartData?: ChartData;
}

interface StockState {
  stocks: StockWithWatchlistStatus[];
  watchlistSymbols: string[];
  loading: boolean;
  loadingSymbol: null | string;
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
  loadingSymbol: null,
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
    set({ loadingSymbol: stock.symbol, error: null });
    try {
      const result = await createWatchList({
        userId,
        symbol: stock.symbol,
        company: stock.name,
      });

      if (!result.success || !result.stock) return;

      const enrichedItem = {
        ...result.stock,
        change:
          calculateChangePercent(
            result.stock.chartData ?? {},
            result.stock.price ?? null,
          ) ?? undefined,
        marketCap: formatMarketCap(result.stock.marketCap ?? null),
      };
      set((state) => ({
        watchlistSymbols: [
          ...state.watchlistSymbols,
          stock.symbol.toUpperCase(),
        ],
        stocks: state.stocks.map((s) =>
          s.symbol === stock.symbol ? { ...s, isInWatchlist: true } : s,
        ),
        loadingSymbol: null,
      }));
      const watchlistStore = useWatchlistStore.getState();
      watchlistStore.addItemToWatchlist(enrichedItem);
    } catch (err: any) {
      console.error("Error Add stocks:", err);
      set({
        error: err.message ?? "Something went wrong",
        stocks: [],
        loadingSymbol: null,
      });
    }
  },

  removeFromWatchlist: async (userId, symbol) => {
    set({ loadingSymbol: symbol, error: null });
    try {
      await deleteWatchLisForUser({ userId, symbol });
      set((state) => ({
        watchlistSymbols: state.watchlistSymbols.filter(
          (s) => s !== symbol.toUpperCase(),
        ),
        stocks: state.stocks.map((s) =>
          s.symbol === symbol ? { ...s, isInWatchlist: false } : s,
        ),
        loadingSymbol: null,
      }));
      const watchlistStore = useWatchlistStore.getState();
      watchlistStore.removeItemFromWatchlist(symbol);
    } catch (err: any) {
      console.error("Error delete stocks:", err);
      set({
        error: err.message ?? "Something went wrong",
        stocks: [],
        loadingSymbol: null,
      });
    }
  },
}));
