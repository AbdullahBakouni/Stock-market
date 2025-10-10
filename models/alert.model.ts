// models/Alert.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAlert extends Document {
  _id: string;
  userId: string;
  alertName: string;
  stockIdentifier: string;
  threshold: number;
  alertType: "price" | "marketCap";
  conditionType: "greater" | "less" | "equal";
  frequencyType: "once-per-hour" | "once-per-day" | "once-per-minute" | string;
  status: "pending" | "active" | "triggered" | "paused" | "disabled";
  createdAt: Date;
  updatedAt: Date;
  lastTriggeredAt?: Date;
  shortId: string;
}

const AlertSchema = new Schema<IAlert>(
  {
    userId: { type: String, required: true, index: true },
    alertName: { type: String, required: true },
    shortId: { type: String },
    stockIdentifier: { type: String, required: true },
    threshold: { type: Number, required: true },
    alertType: {
      type: String,
      enum: ["price", "marketCap"],
      default: "price",
    },
    conditionType: {
      type: String,
      enum: ["greater", "less", "equal"],
      default: "greater",
    },
    frequencyType: {
      type: String,
      enum: ["once-per-hour", "once-per-day", "once-per-minute"],
      default: "once-per-hour",
    },
    status: {
      type: String,
      enum: ["pending", "active", "triggered", "paused", "disabled"],
      default: "pending",
    },
    lastTriggeredAt: { type: Date },
  },

  {
    timestamps: true,
  },
);

export const Alert: Model<IAlert> =
  mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);
