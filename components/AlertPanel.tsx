"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AlertsPanel() {
  interface Alert {
    id: string;
    company: string;
    symbol: string;
    price: number;
    change: number;
    condition: string;
    frequency: string;
    logo: string;
    bgColor: string;
  }

  const alerts: Alert[] = [
    {
      id: "1",
      company: "Apple Inc.",
      symbol: "AAPL",
      price: 229.65,
      change: 1.4,
      condition: "Price > $240.60",
      frequency: "Once per day",
      logo: "🍎",
      bgColor: "bg-gray-800",
    },
    {
      id: "2",
      company: "Tesla, Inc.",
      symbol: "TSLA",
      price: 340.84,
      change: -2.53,
      condition: "Price = $300.80",
      frequency: "Once per minute",
      logo: "⚡",
      bgColor: "bg-red-600",
    },
    {
      id: "3",
      company: "Meta Platforms Inc.",
      symbol: "META",
      price: 790.0,
      change: 1.4,
      condition: "Price < $700.40",
      frequency: "Once per hour",
      logo: "∞",
      bgColor: "bg-blue-500",
    },
    {
      id: "4",
      company: "Microsoft Corporation",
      symbol: "MSFT",
      price: 529.24,
      change: 1.4,
      condition: "Price > $540.13",
      frequency: "Once per day",
      logo: "🪟",
      bgColor: "bg-blue-600",
    },
    {
      id: "5",
      company: "Tesla, Inc.",
      symbol: "TSLA",
      price: 340.84,
      change: -2.53,
      condition: "Price = $305.80",
      frequency: "Once per minute",
      logo: "⚡",
      bgColor: "bg-red-600",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Alerts</h2>
        <Button className="bg-[#FDD458] hover:bg-[#FDD458]/90 text-[#050505] font-bold rounded h-9 cursor-pointer">
          Create Alert
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-[#212328] rounded-lg border border-[#000000] p-4 space-y-3"
          >
            <div className="flex items-start justify-between ">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${alert.bgColor} rounded-lg flex items-center justify-center text-lg`}
                >
                  {alert.logo}
                </div>
                <div>
                  <div className="font-medium text-sm text-[#CCDADC]">
                    {alert.company}
                  </div>
                  <div className="text-xs text-[#CCDADC]">{alert.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm text-white">
                  ${alert.price.toFixed(2)}
                </div>
                <div
                  className={`text-sm font-semibold ${alert.change >= 0 ? "text-[#0FEDBE]" : "text-[#FF495B]"}`}
                >
                  {alert.change >= 0 ? "+" : ""}
                  {alert.change.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-[#313234]">
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm">
                  <span className="text-[#CCDADC]">Alert:</span>
                  <br />
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded transition-colors">
                    <Pencil className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-1 rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-white mt-1">{alert.condition}</p>
                </div>
                <div>
                  <div className="inline-block px-2 py-1 bg-[#FDD45833] text-[#FDD458] text-xs font-medium rounded border-0">
                    {alert.frequency}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
