import express from "express";
import { getPastContests, getUpcomingContests } from "../controllers/contestController.js";

const router = express.Router();

router.get("/past-contests", getPastContests);
router.get("/upcoming", getUpcomingContests);

export default router;
