import Reminder from "../models/reminder.js";

export const addReminder = async (req, res) => {
    try {
        const { contestId, contestTitle, email, minutesBefore, contestStartTime } = req.body;

        if (!contestId || !contestTitle || !email || !minutesBefore || !contestStartTime) {
            return res.status(400).json({ message: "Missing fields in request" });
        }

        const existing = await Reminder.findOne({ contestId, email });
        if (existing) {
            return res.status(409).json({ message: "Reminder already exists" });
        }

        const contestStartTimeUTC = new Date(new Date(contestStartTime).getTime());

        const newReminder = new Reminder({
            contestId,
            contestTitle,
            email,
            minutesBefore,
            contestStartTime: contestStartTimeUTC,
        });

        await newReminder.save();
        return res.status(201).json({ message: "Reminder saved successfully ✅", reminder: newReminder });
    } catch (error) {
        console.error("❌ Error saving reminder:", error);
        return res.status(500).json({ message: "Server error while saving reminder" });
    }
};

export const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ sent: false });
        if (!reminders.length) {
            return res.status(404).json({ message: "No pending reminders found" });
        }
        return res.status(200).json(reminders);
    } catch (error) {
        console.error("❌ Error fetching reminders:", error);
        return res.status(500).json({ message: "Server error while fetching reminders" });
    }
};
