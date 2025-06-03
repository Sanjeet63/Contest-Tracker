import Reminder from './models/reminder.js';
import { sendEmail } from './utils/email.js';

export async function sendDueReminders() {
  const now = new Date();
  const timeWindowMs = 15 * 1000;

  console.log("🚀 sendDueReminders called at:", now.toISOString());

  let reminders = [];
  try {
    reminders = await Reminder.find({ sent: false });
    console.log(`🔍 Found ${reminders.length} total unsent reminders`);
  } catch (err) {
    console.error("❌ Error fetching reminders:", err);
  }

  const dueReminders = reminders.filter(reminder => {
    const triggerTime = new Date(reminder.contestStartTime.getTime() - reminder.minutesBefore * 60 * 1000);
    const isDue = triggerTime >= new Date(now.getTime() - timeWindowMs) &&
      triggerTime <= new Date(now.getTime() + timeWindowMs);

    if (isDue) {
      console.log(`⏱️ Due reminder: ${reminder.email} for ${reminder.contestTitle} (Trigger Time: ${triggerTime.toISOString()})`);
    }

    return isDue;
  });

  console.log(`📬 Ready to send ${dueReminders.length} reminders`);

  for (const reminder of dueReminders) {
    try {
      await sendEmail({
        to: reminder.email,
        subject: `⏰ Reminder: ${reminder.contestTitle}`,
        text: `Contest "${reminder.contestTitle}" starts at ${reminder.contestStartTime.toISOString()}. This is your reminder set ${reminder.minutesBefore} minutes before.`,
      });

      await Reminder.deleteOne({ _id: reminder._id });
      console.log(`✅ Reminder sent & deleted for: ${reminder.email}`);
    } catch (err) {
      console.error(`❌ Failed to send reminder to ${reminder.email}`, err);
    }
  }
}
