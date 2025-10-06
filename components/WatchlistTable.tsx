"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlistStore } from "@/lib/store/watchlist-store";
import { useEffect } from "react";
import { useUserStore } from "@/lib/store/user-store";

export function WatchlistTable() {
  const session = useUserStore((state) => state.session);
  const { watchlist, loading, error, fetchWatchlistByEmail } =
    useWatchlistStore();
  useEffect(() => {
    fetchWatchlistByEmail(session?.user?.email);
  }, [session?.user?.email, fetchWatchlistByEmail]);
  if (loading)
    return (
      <p className="text-sm font-semibold text-yellow-500">
        Loading watchlist...
      </p>
    );
  return watchlist && watchlist.length > 0 ? (
    <div className="rounded-lg border border-[#212328] overflow-hidden bg-[#141414]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className=" bg-[#212328] text-[#CCDADC]">
              <th className="text-left px-6 py-4 text-sm font-medium">
                Company
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium">
                Symbol
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium">Price</th>
              <th className="text-left px-6 py-4 text-sm font-medium">
                Change
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium">
                Market Cap
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium">
                P/E Ratio
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium">Alert</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((w) => (
              <tr
                key={w._id}
                className="border-b border-[#212328] transition-colors text-white"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button className="text-[#FACC15] hover:opacity-80 transition-opacity bg-gray-700 rounded-full p-2">
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <span className="text-sm">{w.company}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">{w.symbol}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">
                    ${w.price?.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-medium ${
                      (w.change ?? 0) >= 0 ? "text-[#0FEDBE]" : "text-[#FF495B]"
                    }`}
                  >
                    {(w.change ?? 0) >= 0 ? "+" : ""}
                    {(w.change ?? 0).toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm">{w.marketCap}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm">{w.peRatio}</span>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#FF824333] text-[#FF8243]  font-medium p-3 border-0 hover:bg-[#FF824333]/90 hover:text-[#FF8243] cursor-pointer"
                  >
                    Add Alert
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <p className="text-[#CCDADC] text-center py-8">
      No Stock In Your Watchlist
    </p>
  );
}
