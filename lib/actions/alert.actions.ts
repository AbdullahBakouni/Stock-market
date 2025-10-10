"use server";

import { connectToDatabase } from "../mongodb";
import { ObjectId } from "mongodb";
import { scheduleAlertCheck } from "../queues/alertsQueue";
import { Alert, IAlert } from "@/models/alert.model";
import { revalidatePath } from "next/cache";
import { fetchStockChange, fetchStockLogo } from "./finnhup.actions";
import { calculateChange } from "../utils";
import { cancelAlertCheck } from "../queues/cancel-alert";
import { customAlphabet } from "nanoid";
export const createAlert = async (
  data: AlertFormData,
  userId: string | undefined,
) => {
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
  if (!userId) return { success: false, message: "User ID is required" };
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Mongose connectiion Field");
    const user = await db
      .collection("user")
      .findOne<{ _id: ObjectId; name: string; email: string }>({
        _id: new ObjectId(userId),
      });
    if (!user) return { success: false, message: "User not found" };
    const newAlert = await db.collection("alerts").insertOne({
      userId: user._id.toString(),
      alertName: data.alertName,
      stockIdentifier: data.stockIdentifier,
      threshold: data.threshold,
      alertType: data.alertType,
      conditionType: data.conditionType,
      frequencyType: data.frequencyType,
      status: data.status,
      shortId: nanoid(),
    });

    if (newAlert.acknowledged) {
      await scheduleAlertCheck(newAlert.insertedId.toString(), {
        every:
          data.frequencyType === "once-per-minute"
            ? 60 * 1000
            : data.frequencyType === "once-per-hour"
              ? 60 * 60 * 1000
              : 24 * 60 * 60 * 1000, // once-per-day
      });
      return {
        success: true,
        message: "Successfully created a new Alert",
      };
    } else {
      return { success: false, message: "Failed to create new Alert" };
    }
  } catch (err: any) {
    console.error("Create a Alert error:", err);
    return {
      success: false,
      message: `An error occurred: ${err.message || err}`,
    };
  }
};
export type AlertDTO = Omit<IAlert, keyof Document> & {
  logoUrl?: string;
  change?: number;
};
export async function getAlertsByUser(
  userId: string | undefined,
): Promise<AlertDTO[]> {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Mongoose connection failed");

    const alerts = await Alert.find({ userId }).sort({ createdAt: -1 }).lean();

    // Fetch logos in parallel for all unique stockIdentifiers
    const uniqueSymbols = [...new Set(alerts.map((a) => a.stockIdentifier))];

    const symbolToLogo = Object.fromEntries(
      await Promise.all(
        uniqueSymbols.map(async (symbol) => {
          const logo = await fetchStockLogo(symbol);
          return [symbol, logo];
        }),
      ),
    );

    // Attach logos to alerts
    const alertsWithImagesAndChange = await Promise.all(
      alerts.map(async (alert) => {
        const currentPrice = await fetchStockChange(alert.stockIdentifier);
        if (!currentPrice) return;
        const change = calculateChange(currentPrice, alert.threshold);
        revalidatePath("/watchlist");
        return {
          ...alert,
          logoUrl: symbolToLogo[alert.stockIdentifier] || null,
          change,
        };
      }),
    );

    return JSON.parse(JSON.stringify(alertsWithImagesAndChange));
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw new Error("Failed to fetch alerts");
  }
}

export async function deleteAlert(alertId: string) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Mongoose connection failed");
    await Alert.findByIdAndUpdate(alertId, { status: "disabled" });
    await cancelAlertCheck(alertId);
    await Alert.findByIdAndDelete(alertId);
    revalidatePath("/watchlist");
    return { success: true, messgae: "Alert Deleted Succssefully" };
  } catch (error) {
    console.error("Error deleting alert:", error);
    throw new Error("Failed to delete alert");
  }
}

export async function updateAlert(shortId: string, data: AlertFormData) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Mongoose connection failed");
    const alert = await Alert.findOneAndUpdate({ shortId }, data, {
      new: true,
    }).lean();
    if (!alert) throw new Error("Alert not found");

    await cancelAlertCheck(alert._id);

    if (alert.status === "active") {
      const intervals = {
        "once-per-minute": 60 * 1000,
        "once-per-hour": 60 * 60 * 1000,
        "once-per-day": 24 * 60 * 60 * 1000,
      };
      type IntervalKeys = keyof typeof intervals;

      if (alert.frequencyType in intervals) {
        await scheduleAlertCheck(alert._id.toString(), {
          every: intervals[alert.frequencyType as IntervalKeys],
        });
      } else {
        // Fallback or error handling if frequencyType is not a recognized interval
        await scheduleAlertCheck(alert._id.toString(), {
          every: 60 * 60 * 1000, // Default to once-per-hour
        });
      }

      console.log(
        `🔁 Updated alert and rescheduled job for ${alert.alertName}`,
      );
    }

    revalidatePath("/watchlist");
    return { success: true, message: "Alert Updated Successfully" };
  } catch (error) {
    console.error("Error updating alert:", error);
    throw new Error("Failed to update alert");
  }
}
export async function activateAlert(alertId: string) {
  try {
    await connectToDatabase();
    const alert = await Alert.findById(alertId);
    if (!alert) throw new Error("Alert not found");

    alert.status = "active";
    await alert.save();
    const intervals = {
      "once-per-minute": 60 * 1000,
      "once-per-hour": 60 * 60 * 1000,
      "once-per-day": 24 * 60 * 60 * 1000,
    };
    type IntervalKeys = keyof typeof intervals;

    if (alert.frequencyType in intervals) {
      await scheduleAlertCheck(alert._id.toString(), {
        every: intervals[alert.frequencyType as IntervalKeys],
      });
    }

    console.log(`🚀 Activated alert ${alert.alertName}`);
    return { success: true, status: alert.status };
  } catch (error) {
    console.error("Error Active alert Status:", error);
    throw new Error("Failed to Active alert");
  }
}
export async function pauseAlert(alertId: string) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Mongoose connection failed");
    const alert = await Alert.findByIdAndUpdate(alertId, { status: "paused" });
    if (!alert) throw new Error("Alert not found");
    await cancelAlertCheck(alertId);
    return { success: true, status: alert.status };
  } catch (error) {
    console.error("Error Pause alert:", error);
    throw new Error("Failed to Pause alert");
  }
}

export async function getAlertByShortId(shortId: string) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Mongoose connection failed");

    const alert = await Alert.findOne({ shortId }).lean();
    if (!alert) return { success: false, message: "Alert not found" };
    return {
      success: true,
      alert: { ...alert, _id: alert._id.toString() },
    };
  } catch (error) {
    console.error("Error fetching alert:", error);
    return { success: false, message: "Error fetching alert" };
  }
}
