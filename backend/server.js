import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
import cors from "cors";
import Bookmark from "./models/bookmark.js";
import Reminder from "./models/reminder.js";
import axios from "axios";
import './reminderCron.js'
import { sendDueReminders } from './reminderService.js';

dotenv.config();
const app = express();
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, { dbName: 'cphub' })
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.log('❌ MongoDB Connection Error: ', err));

app.post('/api/bookmarks/add', async (req, res) => {
    try {
        const { userId, contest } = req.body;
        if (!userId || !contest || !contest.contestId) {
            return res.status(400).json({ message: 'Missing userId or contest data' });
        }
        const bookmarkDoc = await Bookmark.findOne({ userId });
        if (bookmarkDoc) {
            const alreadyExists = bookmarkDoc.contests.some(c => c.contestId === contest.contestId);
            if (alreadyExists) {
                return res.status(400).json({ message: 'Contest already bookmarked!' });
            }
            bookmarkDoc.contests.push(contest);
            await bookmarkDoc.save();
            return res.status(201).json({ message: 'Bookmark added successfully!', bookmark: bookmarkDoc });
        } else {
            const newBookmark = new Bookmark({
                userId,
                contests: [contest]
            });
            await newBookmark.save();
            return res.status(201).json({ message: 'Bookmark added successfully!', bookmark: newBookmark });
        }
    } catch (err) {
        console.error("❌ Error adding bookmark:", err);
        return res.status(500).json({ message: 'Server error while adding bookmark' });
    }
});

app.get('/api/bookmarks/get/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const bookmarkDoc = await Bookmark.findOne({ userId });
        if (!bookmarkDoc) {
            return res.status(404).json({ message: "No bookmarks found" });
        }
        return res.status(200).json(bookmarkDoc.contests);
    } catch (err) {
        console.error("❌ Error fetching bookmarks:", err);
        return res.status(500).json({ message: 'Server error while fetching bookmarks' });
    }
});

app.delete('/api/bookmarks/remove', async (req, res) => {
    const { userId, contestId } = req.query;

    if (!userId || !contestId) {
        return res.status(400).json({ message: 'Missing userId or contestId' });
    }
    const bookmarkDoc = await Bookmark.findOne({ userId });
    if (!bookmarkDoc) {
        return res.status(404).json({ message: "No bookmarks found for this user" });
    }
    bookmarkDoc.contests = bookmarkDoc.contests.filter(c => c.contestId !== contestId);
    await bookmarkDoc.save();
    return res.status(200).json({ message: 'Bookmark removed successfully', bookmark: bookmarkDoc });
});

app.post("/api/reminder/add", async (req, res) => {
    try {
        console.log("👉 Incoming reminder data:", req.body);
        const { contestId, contestTitle, email, minutesBefore, contestStartTime } = req.body;
        if (!contestId || !contestTitle || !email || !minutesBefore || !contestStartTime) {
            return res.status(400).json({ message: "Missing fields in request" });
        }
        const existing = await Reminder.findOne({ contestId, email });
        if (existing) {
            return res.status(409).json({ message: "Reminder already exists for this contest and email" });
        }
        const contestStartTimeUTC = new Date(contestStartTime + "+05:30");
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
});
app.get("/api/reminders/get", async (req, res) => {
    try {
        const reminders = await Reminder.find({ sent: false });
        if (reminders.length === 0) {
            return res.status(404).json({ message: "No pending reminders found" });
        }
        return res.status(200).json(reminders);
    } catch (error) {
        console.error("❌ Error fetching reminders:", error);
        return res.status(500).json({ message: "Server error while fetching reminders" });
    }
});

app.get("/api/reminders/get/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const reminders = await Reminder.find({ email, sent: false });
        if (reminders.length === 0) {
            return res.status(404).json({ message: "No pending reminders found for this email" });
        }
        return res.status(200).json(reminders);
    } catch (error) {
        console.error("❌ Error fetching reminders:", error);
        return res.status(500).json({ message: "Server error while fetching reminders" });
    }
});


app.post("/api/contest/:id/remind", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    await db.update("contest_users", {
        where: { contestId: id, userId },
        update: { reminded: true },
    });
    res.sendStatus(200);
});

app.post("/api/contest/:id/complete", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    await db.update("contest_users", {
        where: { contestId: id, userId },
        update: { completed: true },
    });
    res.sendStatus(200);
});

app.post('/api/reminders/send-due', async (req, res) => {
    try {
        await sendDueReminders();
        return res.status(200).json({ message: "Reminder sending triggered manually." });
    } catch (err) {
        console.error("❌ Error sending reminders manually:", err);
        return res.status(500).json({ message: "Server error while sending reminders manually." });
    }
});

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


app.post('/api/feedback', async (req, res) => {
    const { email, message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    console.log("Email User:", process.env.EMAIL_USER);
    console.log("Email Pass:", process.env.EMAIL_PASS ? '✅ Present' : '❌ Missing');
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Missing email credentials');
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Feedback Received',
            text: `From: ${email}\n\n${message}`
        });
        res.status(200).json({ message: 'Feedback sent successfully!' });
    } catch (err) {
        console.error('Error sending feedback:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/api/past-contests", async (req, res) => {
    try {
        const endDate = new Date().toISOString().slice(0, 19);
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 19);
        const url = `https://clist.by/api/v4/contest/?start__gte=${startDate}&start__lte=${endDate}&resource_id__in=1,2,93,102&order_by=-start`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `ApiKey sanjeet:${process.env.API_KEY}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        console.error("❌ Error fetching contests from Clist:", error.message);
        if (error.response) {
            console.error("📄 Response data:", error.response.data);
            console.error("📄 Status:", error.response.status);
        }
        res.status(500).json({ error: "Failed to fetch contests" });
    }
});

app.get("/api/upcoming", async (req, res) => {
    try {
        const response = await axios.get(
            "https://clist.by/api/v4/contest/?upcoming=true&format=json&order_by=start&limit=50&resource_id__in=1,2,93,102",
            {
                headers: {
                    Authorization: `ApiKey sanjeet:${process.env.API_KEY}`,
                },
            }
        );
        res.json(response.data.objects);
    } catch (error) {
        console.error("Error fetching contests from Clist:", error);
        res.status(500).json({ error: "Failed to fetch contests" });
    }
});
app.get("/", (req, res) => {
    res.send("Backend is live 🚀");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
