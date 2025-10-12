export const runtime = "nodejs";
import { connectToDatabase } from "@/lib/mongodb";
import { scheduleAlertCheck } from "@/lib/queues/alertsQueue";
import { Alert } from "@/models/alert.model";

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    const activeAlerts = await Alert.find({ status: "active" });

    if (!activeAlerts || activeAlerts.length === 0) {
      return res
        .status(200)
        .json({ ok: true, message: "No active alerts found" });
    }

    let count = 0;

    for (const alert of activeAlerts) {
      await scheduleAlertCheck(alert._id.toString());
      count++;
    }

    res.status(200).json({
      ok: true,
      totalAlerts: count,
      message: `Scheduled ${count} alerts successfully`,
    });
  } catch (err) {
    console.error("❌ Error scheduling alerts:", err);
    res.status(500).json({ error: err.message });
  }
}
