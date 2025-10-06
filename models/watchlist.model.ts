import { Schema, model, models, type Document, type Model } from "mongoose";

export interface WatchlistItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
  price: number | null;
  marketCap: string | null;
  peRatio: number | null;
  chartData?: {
    open?: number | null;
    high?: number | null;
    low?: number | null;
    prevClose?: number | null;
  };
}

const WatchlistSchema = new Schema<WatchlistItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
    price: { type: Number, default: null },
    marketCap: { type: String, default: null },
    peRatio: { type: Number, default: null },
    chartData: {
      open: { type: Number, default: null },
      high: { type: Number, default: null },
      low: { type: Number, default: null },
      prevClose: { type: Number, default: null },
    },
  },
  { timestamps: false },
);

// Prevent duplicate symbols per user
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Watchlist: Model<WatchlistItem> =
  (models?.Watchlist as Model<WatchlistItem>) ||
  model<WatchlistItem>("Watchlist", WatchlistSchema);
