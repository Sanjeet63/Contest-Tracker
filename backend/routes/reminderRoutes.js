import express from "express";
import { addReminder, getReminders } from "../controllers/reminderController.js";
const router = express.Router();

router.post('/add', addReminder);
router.get('/get', getReminders);

export default router;
