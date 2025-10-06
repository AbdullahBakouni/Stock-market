interface NewsArticle {
  id: string;
  ticker: string;
  title: string;
  source: string;
  timeAgo: string;
  preview: string;
}
export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    ticker: "GOOGL",
    title:
      "If Alphabet 'Missed The AI Boat', What Does That Mean For Microsoft?",
    source: "The Wall Street Journal",
    timeAgo: "12 minutes ago",
    preview:
      "Nearly three years after the launch of ChatGPT, most investors view MSFT as the AI leader. But has MSFT really outperformed GOOGL?",
  },
  {
    id: "2",
    ticker: "AAPL",
    title: "Apple Prepares Major iPhone Redesign for 2026...",
    source: "Bloomberg",
    timeAgo: "24 minutes ago",
    preview:
      "Analysts suggest Apple is betting on foldable displays, a move that could reshape the smartphone market.",
  },
  {
    id: "3",
    ticker: "TSLA",
    title: "Tesla Announces Affordable EV Model for Global Markets...",
    source: "CNBC",
    timeAgo: "47 minutes ago",
    preview:
      "Elon Musk confirms a sub-$25,000 electric vehicle aimed at emerging economies. Designed for markets in Asia, South America, and Africa, the vehicle will use a new batt...",
  },
  {
    id: "4",
    ticker: "NVDA",
    title: "Nvidia Faces Growing Competition in AI Chips...",
    source: "The Wall Street Journal",
    timeAgo: "37 minutes ago",
    preview:
      "While Nvidia dominates the GPU market, rivals are pushing new architectures that challenge its leadership.",
  },
  {
    id: "5",
    ticker: "GOOGL",
    title: "Tesla Announces Affordable EV Model for Global Markets...",
    source: "CNBC",
    timeAgo: "53 minutes ago",
    preview:
      "Tesla has confirmed plans to produce a low-cost EV priced around $25,000. Designed for markets in Asia, South America, and Africa, the vehicle will use a new batt...",
  },
  {
    id: "6",
    ticker: "MSFT",
    title: "Microsoft Expands AI Integration Across Office Suite...",
    source: "Reuters",
    timeAgo: "55 minutes ago",
    preview:
      "The company is rolling out new productivity features powered by its Azure AI platform, aiming to boost enterprise adoption.",
  },
  {
    id: "7",
    ticker: "META",
    title: "Meta Platforms Sees Surge in VR Headset Sales...",
    source: "The Verge",
    timeAgo: "1 hour ago",
    preview:
      "Meta's new Quest Pro headset has exceeded sales expectations, with shipments doubling Q2 compared to last year. The company sees the momentum as validat...",
  },
  {
    id: "8",
    ticker: "AMZN",
    title: "Amazon Tests Drone Deliveries in Suburban Areas...",
    source: "New York Times",
    timeAgo: "1 hour ago",
    preview:
      "Amazon has expanded its drone delivery program into several suburbs across Texas. Customers in test zones can receive packages weighing...",
  },
];

export function NewsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white">News</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {newsArticles.map((article) => (
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
              {article.preview}
            </p>

            <button className="text-xs text-[#FDD458] hover:underline font-medium">
              Read More →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
