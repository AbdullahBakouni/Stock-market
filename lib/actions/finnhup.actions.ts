"use server";

import {
  getDateRange,
  validateArticle,
  formatArticle,
  timeAgoFromUnix,
} from "../utils.ts";
import { POPULAR_STOCK_SYMBOLS } from "../constants.ts";
import { cache } from "react";
import redis from "../redis/redis.ts";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
async function fetchJSON<T>(
  url: string,
  revalidateSeconds?: number,
): Promise<T> {
  const options: RequestInit & { next?: { revalidate?: number } } =
    revalidateSeconds
      ? { cache: "force-cache", next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" };

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export { fetchJSON };

export async function getNews(
  symbols?: string[],
): Promise<MarketNewsArticle[]> {
  try {
    const range = getDateRange(5);

    if (!process.env.NEXT_PUBLIC_FINNHUB_API_KEY) {
      throw new Error("FINNHUB API key is not configured");
    }
    const cleanSymbols = (symbols || [])
      .map((s) => s?.trim().toUpperCase())
      .filter((s): s is string => Boolean(s));

    const maxArticles = 6;

    // If we have symbols, try to fetch company news per symbol and round-robin select
    if (cleanSymbols.length > 0) {
      const perSymbolArticles: Record<string, RawNewsArticle[]> = {};

      await Promise.all(
        cleanSymbols.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(sym)}&from=${range.from}&to=${range.to}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;
            const articles = await fetchJSON<RawNewsArticle[]>(url, 300);
            perSymbolArticles[sym] = (articles || []).filter(validateArticle);
          } catch (e) {
            console.error("Error fetching company news for", sym, e);
            perSymbolArticles[sym] = [];
          }
        }),
      );

      const collected: MarketNewsArticle[] = [];
      // Round-robin up to 6 picks
      for (let round = 0; round < maxArticles; round++) {
        for (let i = 0; i < cleanSymbols.length; i++) {
          const sym = cleanSymbols[i];
          const list = perSymbolArticles[sym] || [];
          if (list.length === 0) continue;
          const article = list.shift();
          if (!article || !validateArticle(article)) continue;
          collected.push(formatArticle(article, true, sym, round));
          if (collected.length >= maxArticles) break;
        }
        if (collected.length >= maxArticles) break;
      }

      if (collected.length > 0) {
        // Sort by datetime desc
        collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
        return collected.slice(0, maxArticles);
      }
      // If none collected, fall through to general news
    }

    // General market news fallback or when no symbols provided
    const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;
    const general = await fetchJSON<RawNewsArticle[]>(generalUrl, 300);

    const seen = new Set<string>();
    const unique: RawNewsArticle[] = [];
    for (const art of general || []) {
      if (!validateArticle(art)) continue;
      const key = `${art.id}-${art.url}-${art.headline}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(art);
      if (unique.length >= 20) break; // cap early before final slicing
    }

    const formatted = unique
      .slice(0, maxArticles)
      .map((a, idx) => formatArticle(a, false, undefined, idx));
    return formatted;
  } catch (err) {
    console.error("getNews error:", err);
    throw new Error("Failed to fetch news");
  }
}

export const searchStocks = cache(
  async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    try {
      if (!process.env.NEXT_PUBLIC_FINNHUB_API_KEY) {
        // If no token, log and return empty to avoid throwing per requirements
        console.error(
          "Error in stock search:",
          new Error("FINNHUB API key is not configured"),
        );
        return [];
      }

      const trimmed = typeof query === "string" ? query.trim() : "";

      let results: FinnhubSearchResult[] = [];

      if (!trimmed) {
        // Fetch top 10 popular symbols' profiles
        const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
        const profiles = await Promise.all(
          top.map(async (sym) => {
            try {
              const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;
              // Revalidate every hour
              const profile = await fetchJSON<any>(url, 3600);
              return { sym, profile } as { sym: string; profile: any };
            } catch (e) {
              console.error("Error fetching profile2 for", sym, e);
              return { sym, profile: null } as { sym: string; profile: any };
            }
          }),
        );

        results = profiles
          .map(({ sym, profile }) => {
            const symbol = sym.toUpperCase();
            const name: string | undefined =
              profile?.name || profile?.ticker || undefined;
            const exchange: string | undefined = profile?.exchange || undefined;
            if (!name) return undefined;
            const r: FinnhubSearchResult = {
              symbol,
              description: name,
              displaySymbol: symbol,
              type: "Common Stock",
            };
            // We don't include exchange in FinnhubSearchResult type, so carry via mapping later using profile
            // To keep pipeline simple, attach exchange via closure map stage
            // We'll reconstruct exchange when mapping to final type
            (r as any).__exchange = exchange; // internal only
            return r;
          })
          .filter((x): x is FinnhubSearchResult => Boolean(x));
      } else {
        const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;
        const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
        results = Array.isArray(data?.result) ? data.result : [];
      }

      const mapped: StockWithWatchlistStatus[] = results
        .map((r) => {
          const upper = (r.symbol || "").toUpperCase();
          const name = r.description || upper;
          const exchangeFromDisplay =
            (r.displaySymbol as string | undefined) || undefined;
          const exchangeFromProfile = (r as any).__exchange as
            | string
            | undefined;
          const exchange = exchangeFromDisplay || exchangeFromProfile || "US";
          const type = r.type || "Stock";
          const item: StockWithWatchlistStatus = {
            symbol: upper,
            name,
            exchange,
            type,
            isInWatchlist: false,
          };
          return item;
        })
        .slice(0, 15);

      return mapped;
    } catch (err) {
      console.error("Error in stock search:", err);
      return [];
    }
  },
);

export const fetchStockData = async (symbol: string) => {
  try {
    const [quoteData, metricsData] = await Promise.all([
      fetchJSON<{ c: number; o: number; h: number; l: number; pc: number }>(
        `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`,
        60,
      ),
      fetchJSON<{
        metric: { marketCapitalization?: number; peNormalizedAnnual?: number };
      }>(
        `${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`,
        300,
      ),
    ]);

    const price = quoteData?.c ?? null;
    const marketCap = metricsData?.metric?.marketCapitalization ?? null;
    const peRatio = metricsData?.metric?.peNormalizedAnnual ?? null;
    const chartData = quoteData
      ? {
          open: quoteData.o,
          high: quoteData.h,
          low: quoteData.l,
          prevClose: quoteData.pc,
        }
      : null;

    return {
      price,
      marketCap,
      peRatio,
      chartData,
    };
  } catch (error: any) {
    console.error("Errro Get Data:", error);
    throw new Error("Error Get Data From Finnube");
  }
};
export interface StockData {
  price: number;
  marketCap: number;
}

export async function getCurrentStockData(
  stockSymbol: string,
): Promise<StockData> {
  try {
    const quote = await fetchJSON<{
      c: number; // current price
      h: number; // high price of the day
      l: number; // low price of the day
      o: number; // open price of the day
      pc: number; // previous close
    }>(
      `${FINNHUB_BASE_URL}/quote?symbol=${stockSymbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`,
    );
    const profile = await fetchJSON<{
      marketCapitalization: number;
      shareOutstanding: number;
      name: string;
    }>(
      `${FINNHUB_BASE_URL}/stock/profile2?symbol=${stockSymbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`,
    );
    return {
      price: quote.c,
      marketCap: profile.marketCapitalization,
    };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return {
      price: 0,
      marketCap: 0,
    };
  }
}

export async function fetchStockLogo(symbol: string): Promise<string | null> {
  const cacheKey = `stock_logo:${symbol}`;
  const cached = await redis.get(cacheKey);
  if (cached) return cached === "null" ? null : cached;

  try {
    const data = await fetchJSON<{ logo?: string }>(
      `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`,
    );
    const logoUrl = data?.logo || null;

    // Cache logo for 6 hours
    await redis.set(cacheKey, logoUrl ?? "null", "EX", 21600);
    return logoUrl;
  } catch (error) {
    console.error(`Error fetching logo for ${symbol}:`, error);
    await redis.set(cacheKey, "null", "EX", 3600); // cache empty result 1h
    return null;
  }
}

export async function fetchStockChange(symbol: string): Promise<number | null> {
  try {
    const currentPriceData = await fetchJSON<{ c: number }>(
      `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`,
    );
    const currentPrice = currentPriceData.c; // Finnhub 'c' = current price
    return currentPrice;
  } catch (e) {
    console.error(`Error fetching logo for ${symbol}:`, e);
    return null;
  }
}

export interface NewsArticle {
  id: string;
  ticker: string;
  title: string;
  source: string;
  timeAgo: string;
  preview: string;
  url: string;
  datetime?: number;
}

export async function getDailyNews(
  symbols: string[],
  page: number = 1,
  limit: number = 10,
): Promise<{ articles: NewsArticle[]; total: number }> {
  // Limit date range (e.g. last 7 days)
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 7);
  const fromStr = from.toISOString().split("T")[0];
  const toStr = today.toISOString().split("T")[0];

  // Fetch all symbols in parallel
  const allNews = await Promise.all(
    symbols.map(async (symbol) => {
      const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${fromStr}&to=${toStr}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;
      try {
        const data = await fetchJSON<
          {
            headline: string;
            source: string;
            datetime: number;
            summary: string;
            id: number;
            url: string;
          }[]
        >(url, 3600); // revalidate hourly

        // Map Finnhub data to your internal format
        return data.map((n) => ({
          id: crypto.randomUUID(),
          ticker: symbol,
          title: n.headline,
          source: n.source,
          timeAgo: timeAgoFromUnix(n.datetime),
          preview: n.summary,
          url: n.url,
          datetime: n.datetime,
        }));
      } catch (e) {
        console.error(`Error fetching news for ${symbol}:`, e);
        return [];
      }
    }),
  );

  const flat = allNews.flat();

  // Sort newest first
  const sorted = flat.sort((a, b) => (b.datetime ?? 0) - (a.datetime ?? 0));

  // Pagination
  const total = sorted.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paged = sorted.slice(start, end);

  return { articles: paged, total };
}
