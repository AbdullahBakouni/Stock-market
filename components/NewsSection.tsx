"use client";
import { getDailyNews, NewsArticle } from "@/lib/actions/finnhup.actions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
interface NewsSectionProps {
  symbols: string[];
  initialPage?: number;
  limit?: number;
}
export default function NewsSection({
  symbols,
  initialPage = 1,
  limit = 10,
}: NewsSectionProps) {
  const truncatePreview = (text: string, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };
  const [page, setPage] = useState(initialPage);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / limit);

  // Cache already fetched pages
  const cacheRef = useRef<Record<number, NewsArticle[]>>({});

  const fetchPage = async (pageNumber: number) => {
    if (cacheRef.current[pageNumber]) {
      setArticles(cacheRef.current[pageNumber]);
      return;
    }

    setLoading(true);
    try {
      const { articles: pageArticles, total: totalArticles } =
        await getDailyNews(symbols, pageNumber, limit);
      cacheRef.current[pageNumber] = pageArticles;
      setArticles(pageArticles);
      setTotal(totalArticles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, [page, symbols]);

  const goToNextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const goToPreviousPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">News</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={page === 1}
            className="cursor-pointer p-2 rounded-lg bg-[#141414] border-0 hover:bg-[#141414]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm text-(--color-muted) min-w-[80px] text-center">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={page === totalPages}
            className="cursor-pointer p-2 rounded-lg bg-[#141414] border-0  hover:bg-[#141414]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {loading ? (
        <p className="text-sm font-semibold text-yellow-500">Loading News...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-[#141414] rounded-lg  border-0 p-4 space-y-3 hover:bg-[#141414]/90 transition-colors cursor-pointer"
            >
              <div className="inline-block px-2 py-1 bg-[#72EEA233] text-[#72EEA2] text-xs font-bold rounded">
                {article.ticker}
              </div>

              <h3 className="font-semibold text-sm leading-snug text-white">
                {article.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-[#9095A1]">
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.timeAgo}</span>
              </div>

              <p className="text-xs text-[#CCDADC] font-semibold leading-relaxed">
                {truncatePreview(article.preview)}
              </p>

              <Link href={article.url}>
                <p className="text-xs text-[#FDD458] hover:underline font-medium">
                  Read More →
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
