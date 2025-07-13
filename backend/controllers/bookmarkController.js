import Bookmark from "../models/bookmark.js";

export const addBookmark = async (req, res) => {
    try {
        const { userId, contest } = req.body;
        if (!userId || !contest || !contest.contestId) {
            return res.status(400).json({ message: 'Missing userId or contest data' });
        }

        const updatedBookmark = await Bookmark.findOneAndUpdate(
            { userId },
            { $addToSet: { contests: contest } },
            { new: true, upsert: true }
        );

        return res.status(201).json({ message: 'Bookmark added successfully!', bookmark: updatedBookmark });
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

    try {
        const updatedBookmark = await Bookmark.findOneAndUpdate(
            { userId },
            { $pull: { contests: { contestId: contestId } } },
            { new: true }
        );

        if (!updatedBookmark) {
            return res.status(404).json({ message: "No bookmarks found for this user" });
        }

        return res.status(200).json({ message: 'Bookmark removed successfully', bookmark: updatedBookmark });
    } catch (err) {
        console.error("❌ Error removing bookmark:", err);
        return res.status(500).json({ message: 'Server error while removing bookmark' });
    }
};
