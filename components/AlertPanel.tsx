"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAlertStore } from "@/lib/store/alert-store";
import { useUserStore } from "@/lib/store/user-store";
import { useEffect } from "react";

import AlertCard from "./AlertCard";

export function AlertsPanel() {
  const router = useRouter();
  const session = useUserStore((state) => state.session);
  const { alerts, fetchAlerts, removeAlert, loading } = useAlertStore();
  useEffect(() => {
    fetchAlerts(session?.user?.id);
  }, [session?.user?.id, fetchAlerts]);

  const handlepush = () => {
    router.push("/alerts/new");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Alerts</h2>
        <Button
          className="bg-[#FDD458] hover:bg-[#FDD458]/90 text-[#050505] font-bold rounded h-9 cursor-pointer"
          onClick={handlepush}
        >
          Create Alert
        </Button>
      </div>

      {loading ? ( // Conditional rendering starts here
        <p className="text-sm font-semibold text-yellow-500">
          Loading Alerts...
        </p>
      ) : (
        <AlertCard alert={alerts} handleDeleteAlert={removeAlert} />
      )}
    </div>
  );
}
