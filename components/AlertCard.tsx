import AlertToggleButton from "./AlertToggleButton";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { AlertDTO } from "@/lib/actions/alert.actions";
import Link from "next/link";

interface AlertCardProps {
  alert: AlertDTO[];
  handleDeleteAlert: (alertId: string) => Promise<void>;
}
const AlertCard = ({ alert, handleDeleteAlert }: AlertCardProps) => {
  return alert && alert.length > 0 ? (
    <div className="space-y-3">
      {alert.map((alert) => (
        <div
          key={alert._id}
          className="bg-[#212328] rounded-lg border border-[#000000] p-4 space-y-3"
        >
          <div className="flex items-start justify-between ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#212328] rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={alert.logoUrl || ""}
                  alt={`${alert.alertName} logo`}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <div className="font-medium text-sm text-[#CCDADC]">
                  {alert.stockIdentifier}
                </div>
                <div className="text-xs text-[#CCDADC]">{alert.alertName}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm text-white">
                ${alert.threshold}
              </div>
              <div
                className={`text-sm font-semibold ${
                  alert.change !== null && alert.change !== undefined
                    ? alert.change >= 0
                      ? "text-[#0FEDBE]"
                      : "text-[#FF495B]"
                    : ""
                }`}
              >
                {alert.change !== null && alert.change !== undefined ? (
                  <>
                    {alert.change >= 0 ? "+" : ""}
                    {alert.change.toFixed(2)}%
                  </>
                ) : (
                  "N/A"
                )}
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
                <AlertToggleButton alert={alert} />
                <button
                  className="p-1 rounded transition-colors cursor-pointer"
                  onClick={() => handleDeleteAlert(alert._id)}
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
                <Link
                  href={`/alerts/new/?id=${alert.shortId}`}
                  className="p-1.5 rounded transition-colors inline-flex items-center justify-center"
                  aria-label="Edit alert"
                >
                  <Pencil className="w-4 h-4 text-white transition-colors" />
                </Link>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-white mt-1">
                  {alert.conditionType}
                </p>
              </div>
              <div>
                <div className="inline-block px-2 py-1 bg-[#FDD45833] text-[#FDD458] text-xs font-medium rounded border-0">
                  {alert.frequencyType}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-[#CCDADC] text-center py-8">No Alerts Added Yet!</p>
  );
};

export default AlertCard;
