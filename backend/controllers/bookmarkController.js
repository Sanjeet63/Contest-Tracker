import Bookmark from "../models/bookmark.js";

export const addBookmark = async (req, res) => {
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
            const newBookmark = new Bookmark({ userId, contests: [contest] });
            await newBookmark.save();
            return res.status(201).json({ message: 'Bookmark added successfully!', bookmark: newBookmark });
        }
    } catch (err) {
        console.error("❌ Error adding bookmark:", err);
        return res.status(500).json({ message: 'Server error while adding bookmark' });
    }
};

export const getBookmarks = async (req, res) => {
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
};

export const removeBookmark = async (req, res) => {
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
};
