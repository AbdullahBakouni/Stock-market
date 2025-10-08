"use server";

import { connectToDatabase } from "../mongodb";
import { ObjectId } from "mongodb";
import { scheduleAlertCheck } from "../queues/alertsQueue";
export const createAlert = async (
  data: AlertFormData,
  userId: string | undefined,
) => {
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
