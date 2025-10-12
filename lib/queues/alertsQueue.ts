import { Queue } from "bullmq";
import IORedis from "ioredis";

export const alertsQueue = new Queue("alerts", {
  connection: new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  }),
});

export async function scheduleAlertCheck(
  alertId: string,
  cronOrRepeat: { every?: number; cron?: string } = {},
) {
  const jobName = `check-alert-${alertId}`;
  await alertsQueue.add(
    jobName,
    { alertId },
    {
      removeOnComplete: true,
      removeOnFail: false,
      repeat: cronOrRepeat.cron
        ? { pattern: cronOrRepeat.cron }
        : cronOrRepeat.every
          ? { every: cronOrRepeat.every }
          : undefined,
      jobId: jobName,
    },
  );
}
