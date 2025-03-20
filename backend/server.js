import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Bookmark from "./models/bookmark.js"; // bookmark model

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { dbName: 'cphub' })
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.log('❌ MongoDB Connection Error: ', err));

// =========================
// 🔵 Add Bookmark API
// =========================
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
            // create new doc if user doesn't exist yet
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


// =========================
// 🟢 Get Bookmarks API
// =========================
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

// =========================
// 🔴 Delete Bookmark API (updated to DELETE + query params)
// =========================
app.delete('/api/bookmarks/remove', async (req, res) => {
    const { userId, contestId } = req.query; // 👈 change from req.body to req.query

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


// =========================
// 💚 Health Check
// =========================
app.get('/ping', (req, res) => {
    res.send('🏓 Pong');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
