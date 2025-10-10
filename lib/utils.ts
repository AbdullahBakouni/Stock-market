import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getFormattedTodayDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
export const getDateRange = (days: number) => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - days);
  return {
    to: toDate.toISOString().split("T")[0],
    from: fromDate.toISOString().split("T")[0],
  };
};
export const validateArticle = (article: RawNewsArticle) =>
  article.headline && article.summary && article.url && article.datetime;

export const formatArticle = (
  article: RawNewsArticle,
  isCompanyNews: boolean,
  symbol?: string,
  index: number = 0,
) => ({
  id: isCompanyNews ? Date.now() + Math.random() : article.id + index,
  headline: article.headline!.trim(),
  summary:
    article.summary!.trim().substring(0, isCompanyNews ? 200 : 150) + "...",
  source: article.source || (isCompanyNews ? "Company News" : "Market News"),
  url: article.url!,
  datetime: article.datetime!,
  image: article.image || "",
  category: isCompanyNews ? "company" : article.category || "general",
  related: isCompanyNews ? symbol! : article.related || "",
});

export function calculateChangePercent(
  chartData: ChartData,
  currentPrice: number | null,
): number | null {
  if (!chartData?.prevClose || currentPrice == null) return null;

  const changePercent =
    ((currentPrice - chartData.prevClose) / chartData.prevClose) * 100;
  return Number(changePercent.toFixed(2));
}
export function formatMarketCap(
  value: number | string | null | undefined,
): string {
  if (value == null) return "N/A";

  // Convert string to number if necessary
  const num = typeof value === "string" ? parseFloat(value) : value;

  // If parsing failed or NaN, return N/A
  if (isNaN(num)) return "N/A";

  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(2) + "T";
  } else if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + "K";
  } else {
    return num.toString();
  }
}
export function calculateChange(current: number, previous: number): number {
  if (!previous || isNaN(current) || isNaN(previous)) return 0;
  return ((current - previous) / previous) * 100;
}
