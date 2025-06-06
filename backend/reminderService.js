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
      const contestIST = new Date(reminder.contestStartTime.getTime());
      const formattedIST = contestIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      const emailText = 
      `
Hey there! 👋,

⏰ This is a friendly reminder that the contest:

${reminder.contestTitle} is scheduled to start at: ${formattedIST} (IST)

You had set a reminder ${reminder.minutesBefore} minutes before the contest.

Make sure you're ready! 🚀  
Wishing you the best of luck!

—
Team CP Hub
      `.trim();

      await sendEmail({
        to: reminder.email,
        subject: `⏰ Reminder: ${reminder.contestTitle} starts soon!`,
        text: emailText,
      });

      await Reminder.deleteOne({ _id: reminder._id });
      console.log(`✅ Reminder sent & deleted for: ${reminder.email}`);
    } catch (err) {
      console.error(`❌ Failed to send reminder to ${reminder.email}`, err);
    }
  }
}
