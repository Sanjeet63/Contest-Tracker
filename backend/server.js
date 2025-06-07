import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import "./reminderCron.js";
import Reminder from "./models/reminder.js";


import authRoutes from "./routes/authRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());


app.use("/api/google", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/reminder", reminderRoutes);

app.post('/api/reminder/test-add', async (req, res) => {
    try {
        const now = new Date();
        const contestStartTime = new Date(now.getTime() + 11 * 60 * 1000);

        const testReminder = new Reminder({
            contestId: "test123",
            contestTitle: "Test Contest for Reminder",
            email: "sanjeet22444@iiitd.ac.in",
            minutesBefore: 10,
            contestStartTime: contestStartTime,
            sent: false,
        });

        await testReminder.save();

        return res.status(201).json({ message: "✅ Test reminder added to DB", reminder: testReminder });
    } catch (error) {
        console.error("❌ Error adding test reminder:", error);
        return res.status(500).json({ message: "Server error while adding test reminder" });
    }
});


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});

