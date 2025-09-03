import express from 'express';
const router = express.Router();
import { 
    getChapters, 
    getChapterById,
    createChapter,
    updateChapter,
    deleteChapter
} from '../controllers/chapterController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(getChapters)
    .post(protect, admin, createChapter);

router.route('/:id')
    .get(getChapterById)
    .put(protect, admin, updateChapter)
    .delete(protect, admin, deleteChapter);

export default router;