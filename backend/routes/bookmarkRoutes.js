import express from "express";
import { addBookmark, getBookmarks, removeBookmark } from "../controllers/bookmarkController.js";
const router = express.Router();

router.post('/add', addBookmark);
router.get('/get/:userId', getBookmarks);
router.delete('/remove', removeBookmark);

export default router;
