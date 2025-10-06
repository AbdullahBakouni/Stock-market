"use server";

import { Watchlist } from "@/models/watchlist.model";
import { connectToDatabase } from "../mongodb";
import { ObjectId } from "mongodb";
import { fetchStockData } from "./finnhup.actions";
import { revalidatePath } from "next/cache";

export async function getWatchlistSymbolsByEmail(
  email: string | undefined,
): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    // Better Auth stores users in the "user" collection
    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}

export const createWatchList = async ({
  userId,
  symbol,
  company,
}: {
  userId: string | undefined;
  symbol: string;
  company: string;
}) => {
  try {
    const mongoose = await connectToDatabase(); // Assuming connectToDatabase is defined elsewhere
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db
      .collection("user")
      .findOne<{ _id: ObjectId; name: string; email: string }>({
        _id: new ObjectId(userId),
      });
    if (!user) return { success: false, message: "User not found" }; // Consistent return

    const existsWatchList = await db
      .collection("watchlists")
      .findOne({ userId: userId, symbol: symbol });
    if (existsWatchList)
      return { success: false, message: "Stock already added" };
    const stockData = await fetchStockData(symbol);
    if (!stockData)
      return { success: false, message: "Error Fetching Stock Metrics Data" };
    const newWatchlist = await db.collection("watchlists").insertOne({
      userId: userId,
      symbol: symbol,
      company: company,
      ...stockData,
      addedAt: new Date(),
    });

    if (newWatchlist.acknowledged) {
      return {
        success: true,
        message: "Successfully created a new watchlist",
        stock: {
          _id: newWatchlist.insertedId.toString(),
          userId,
          symbol,
          company,
          ...stockData,
          addedAt: new Date(),
        },
      };
    } else {
      return { success: false, message: "Failed to create new watchlist" };
    } // Handle unacknowledged write
  } catch (err: any) {
    // Type 'any' for err for flexibility in error handling
    console.error("Create a Watchlist error:", err);
    return {
      success: false,
      message: `An error occurred: ${err.message || err}`,
    }; // Return error object
  }
};

export const fetchWatchListBerUser = async ({ userId }: { userId: string }) => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");
    const watchlist = await db
      .collection("watchlists")
      .find({ userId: userId })
      .toArray();

    const watchlistSymbols = watchlist.map((w: any) => w.symbol);
    if (watchlist) return { success: true, watchlistSymbols: watchlistSymbols };
  } catch (err: any) {
    console.error("Fetching Watchlist is Field:", err);
    return {
      success: false,
      message: `An error occurred: ${err.message || err}`,
    }; // Return error object
  }
};

export const deleteWatchLisForUser = async ({
  userId,
  symbol,
}: {
  userId: string;
  symbol: string;
}) => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");
    const result = await db
      .collection("watchlists")
      .deleteOne({ userId, symbol: symbol.toUpperCase() });
    if (result) return { success: true, message: "Deleting Success" };
  } catch (err: any) {
    console.error("Error Deleting a WatchList:", err);
    return {
      success: false,
      message: `An error occurred: ${err.message || err}`,
    }; // Return error object
  }
};
export async function getWatchlistByEmail(email: string | undefined) {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");
    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];
    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();

    const formattedItems = items.map((item) => ({
      ...item,
      _id: String(item._id),
    }));

    return formattedItems;
  } catch (err) {
    console.error("getWatchlistByEmail error:", err);
    return [];
  }
}
