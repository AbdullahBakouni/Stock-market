"use client";

import {
  AlertDTO,
  activateAlert,
  pauseAlert,
} from "@/lib/actions/alert.actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";
interface AlertToggleButtonProps {
  alert: AlertDTO;
}
export default function AlertToggleButton({ alert }: AlertToggleButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(alert.status);
  const handleToggle = () => {
    startTransition(async () => {
      try {
        if (status !== "active") {
          const res = await activateAlert(alert._id);
          if (res?.success) {
            setStatus("active");
            toast.success("Alert activated ✅");
          } else {
            toast.error("Failed to activate alert");
          }
        } else {
          const res = await pauseAlert(alert._id);
          if (res?.success) {
            setStatus("paused");
            toast.info("Alert paused ⏸️");
          } else {
            toast.error("Failed to pause alert");
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong ❌");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="p-1.5 rounded transition-all relative group cursor-pointer"
      aria-label={status === "active" ? "Pause alert" : "Activate alert"}
    >
      {status === "active" ? (
        // 🔴 Active state — record red pulse
        <div className="relative w-4 h-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      ) : (
        // 🟡 Paused state — pause icon
        <div className="w-4 h-4 flex items-center justify-center gap-0.5">
          <div className="w-1 h-4 bg-yellow-500 rounded-sm"></div>
          <div className="w-1 h-4 bg-yellow-500 rounded-sm"></div>
        </div>
      )}
    </button>
  );
}
