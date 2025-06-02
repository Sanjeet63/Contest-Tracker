import Reminder from './models/reminder.js';
import { sendEmail } from './utils/email.js';

export async function sendDueReminders() {
  const now = new Date();
  const timeWindowMs = 15 * 1000; 

  const reminders = await Reminder.find({
    sent: false,
    $expr: {
      $and: [
        {
          $gte: [
            { $subtract: ["$contestStartTime", { $multiply: ["$minutesBefore", 60 * 1000] }] },
            new Date(now.getTime() - timeWindowMs)
          ]
        },
        {
          $lte: [
            { $subtract: ["$contestStartTime", { $multiply: ["$minutesBefore", 60 * 1000] }] },
            new Date(now.getTime() + timeWindowMs)
          ]
        }
      ]
    }
  });

  console.log(`⏰ [sendDueReminders] Found ${reminders.length} reminders to send at ${now.toISOString()}`);

  for (const reminder of reminders) {
    try {
      console.log(`📤 Preparing to send email to: ${reminder.email}`);
      await sendEmail({
        to: reminder.email,
        subject: `⏰ Reminder: ${reminder.contestTitle}`,
        text: `Contest "${reminder.contestTitle}" starts at ${reminder.contestStartTime.toISOString()}. This is your reminder set ${reminder.minutesBefore} minutes before.`,
      });

      // Delete after sending
      await Reminder.deleteOne({ _id: reminder._id });
      console.log(`✅ Reminder sent and deleted for ${reminder.email} - ${reminder.contestTitle}`);
    } catch (err) {
      console.error(`❌ Failed to send reminder to ${reminder.email}`, err);
    }
  }
}
