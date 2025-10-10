import AddStockButton from "@/components/AddStockButton";
import { AlertsPanel } from "@/components/AlertPanel";
import NewsSection from "@/components/NewsSection";
import { WatchlistTable } from "@/components/WatchlistTable";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { use } from "react";

const WatchListPage = () => {
  const session = use(
    auth.api.getSession({ headers: headers() as unknown as Headers }),
  );
  const symbols = use(getWatchlistSymbolsByEmail(session?.user.email));
  return (
    <main className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Watchlist */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Watchlist</h1>
            <AddStockButton />
          </div>

          <WatchlistTable />
        </div>

        {/* Sidebar - Alerts */}
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
      </div>

      {/* News Section */}
      <div className="mt-12">
        <NewsSection symbols={symbols} limit={10} initialPage={1} />
      </div>
    </main>
  );
};

export default WatchListPage;
