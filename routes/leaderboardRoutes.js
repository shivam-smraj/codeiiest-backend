import express from 'express';
const router = express.Router();
import { getCodeforcesLeaderboard } from '../controllers/leaderboardController.js';
router.get('/codeforces', getCodeforcesLeaderboard);

export default router;