// store/alertStore.ts
import { create } from "zustand";
import {
  AlertDTO,
  deleteAlert,
  getAlertsByUser,
} from "../actions/alert.actions";
import { toast } from "sonner";

interface AlertState {
  alerts: AlertDTO[];
  loading: boolean;
  error: string | null;
  fetchAlerts: (userId: string | undefined) => Promise<void>;
  removeAlert: (alertId: string) => Promise<void>;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  loading: false,
  error: null,

  fetchAlerts: async (userId) => {
    set({ loading: true, error: null });
    try {
      const alerts = await getAlertsByUser(userId);
      set({ alerts, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  removeAlert: async (alertId) => {
    try {
      const res = await deleteAlert(alertId);
      if (res.success) {
        toast.success(res.messgae);
        set((state) => ({
          alerts: state.alerts.filter((a) => a._id !== alertId),
        }));
      } else {
        toast.error("Failed to delete alert");
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
