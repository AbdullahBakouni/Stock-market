import { create } from "zustand";
import { searchStocks } from "../actions/finnhup.actions";
interface StockWithWatchlistStatus {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  isInWatchlist: boolean;
}

interface StockState {
  stocks: StockWithWatchlistStatus[];
  loading: boolean;
  error: string | null;
  fetchStocks: (query?: string) => Promise<void>;
}

export const useStockStore = create<StockState>((set) => ({
  stocks: [],
  loading: false,
  error: null,

  fetchStocks: async (query?: string) => {
    try {
      set({ loading: true, error: null });
      const data = await searchStocks(query);
      set({ stocks: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message ?? "Something went wrong",
        loading: false,
        stocks: [],
      });
    }
  },
}));
