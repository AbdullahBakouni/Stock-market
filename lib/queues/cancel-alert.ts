import { alertsQueue } from "./alertsQueue";

export async function cancelAlertCheck(alertId: string) {
  const jobName = `check-alert:${alertId}`;
  const repeatableJobs = await alertsQueue.getRepeatableJobs();

  for (const job of repeatableJobs) {
    if (job.name === jobName || job.id === jobName) {
      await alertsQueue.removeRepeatableByKey(job.key);
      console.log(`🗑️ Removed repeatable job for alert ${alertId}`);
    }
  }
}
