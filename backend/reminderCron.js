import cron from 'node-cron';
import { sendDueReminders } from "./services/reminderService.js";

cron.schedule('*/30 * * * * *', async () => {
  console.log(`⏰ Cron job running at ${new Date().toISOString()}`);
  await sendDueReminders();
});