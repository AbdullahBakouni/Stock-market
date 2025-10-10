import "dotenv/config";
import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { connectToDatabase } from "../lib/mongodb.ts";
import { Alert } from "../models/alert.model.ts";
import { fetchUserById } from "../lib/actions/user.actions.ts";
import { generateOpportunityMessage } from "../lib/ai/geminiMessage.ts";
import { generatePriceVolumeMarketCapTemplate } from "../lib/nodemailer/templates.ts";
import { sendFininctiolsDetails } from "../lib/nodemailer/index.ts";
import { getCurrentStockData } from "../lib/actions/finnhup.actions.ts";

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "alerts",
  async (job: Job) => {
    const { alertId } = job.data as { alertId: string };
    await connectToDatabase();
    const alert = await Alert.findById(alertId);
    if (!alert || alert.status !== "active") return;

    // fetch current price
    const { price, marketCap } = await getCurrentStockData(
      alert.stockIdentifier,
    );
    const alertType = alert.alertType as "price" | "marketCap";
    let currentValue: number;
    if (alert.alertType === "price") currentValue = price;
    else if (alert.alertType === "marketCap") currentValue = marketCap;
    else return; // alertType

    let triggered = false;
    if (alert.conditionType === "greater" && currentValue > alert.threshold)
      triggered = true;
    if (alert.conditionType === "less" && currentValue < alert.threshold)
      triggered = true;
    if (alert.conditionType === "equal" && currentValue === alert.threshold)
      triggered = true;

    const now = new Date();
    let minIntervalMs = 60 * 60 * 1000; // once-per-hour

    if (alert.frequencyType === "once-per-minute") minIntervalMs = 60 * 1000;
    if (alert.frequencyType === "once-per-day")
      minIntervalMs = 24 * 60 * 60 * 1000;

    if (triggered) {
      const user = await fetchUserById(alert.userId.toString());
      if (!user) return "user Email Not Found";

      if (
        alert.lastTriggeredAt &&
        now.getTime() - alert.lastTriggeredAt.getTime() < minIntervalMs
      ) {
        return;
      }
      const aiMessage = await generateOpportunityMessage({
        stockSymbol: alert.stockIdentifier,
        stockName: alert.alertName,
        alertType,
        conditionType: alert.conditionType,
      });
      const change = ((currentValue - alert.threshold) / alert.threshold) * 100;

      const percentChange = (change >= 0 ? "+" : "") + change.toFixed(2) + "%";

      const html = generatePriceVolumeMarketCapTemplate({
        stockName: alert.alertName,
        stockSymbol: alert.stockIdentifier,
        alertType,
        conditionType: alert.conditionType,
        threshold: alert.threshold,
        currentValue,
        percentChange: percentChange,
        timestamp: now.toLocaleString(),
        aiMessage,
      });
      await sendFininctiolsDetails({
        email: user.user?.email,
        subject: `📈 ${alert.stockIdentifier} triggered your ${alertType} alert`,
        html: html,
      });

      alert.lastTriggeredAt = now;

      alert.status =
        alert.frequencyType === "manual" ? "disabled" : "triggered";

      await alert.save();
      console.log(`✅ Alert ${alert._id} triggered successfully`);
    }
  },
  { connection },
);

worker.on("failed", (job, err) => {
  console.error("❌ Job failed", job?.id, err);
});

console.log("🚀 Alerts worker started with AI-generated email alerts");
