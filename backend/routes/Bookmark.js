// routes/bookmarkRoutes.js
import express from 'express';
import Bookmark from '../models/bookmark.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// Create a bookmark
router.post('/', async (req, res) => {
  try {
    const { userId, contestId, title, url } = req.body;
    const bookmark = new Bookmark({ userId, contestId, title, url });
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bookmarks for a user
router.get('/:userId', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.params.userId });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a bookmark
router.delete('/:id', async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
