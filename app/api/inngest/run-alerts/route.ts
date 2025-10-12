export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { scheduleAlertCheck } from "@/lib/queues/alertsQueue";
import { Alert } from "@/models/alert.model";

export async function GET() {
  try {
    console.log("🚀 Running scheduled alerts...");

    await connectToDatabase();

    const activeAlerts = await Alert.find({ status: "active" });
    console.log(`📊 Found ${activeAlerts.length} active alerts`);

    let count = 0;
    for (const alert of activeAlerts) {
      await scheduleAlertCheck(alert._id.toString());
      count++;
    }

    return NextResponse.json({
      ok: true,
      totalAlerts: count,
      message: `Scheduled ${count} alerts successfully ✅`,
    });
  } catch (err: any) {
    console.error("❌ Error scheduling alerts:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
