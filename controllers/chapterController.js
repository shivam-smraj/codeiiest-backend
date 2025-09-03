// backend/controllers/chapterController.js
import asyncHandler from 'express-async-handler';
import Chapter from '../models/chapterModel.js';

const getChapters = asyncHandler(async (req, res) => {
    const chapters = await Chapter.find({});
    res.status(200).json(chapters);
});

const getChapterById = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findOne({ chapterId: req.params.id });
    if (chapter) {
        res.status(200).json(chapter);
    } else {
        res.status(404);
        throw new Error('Chapter not found');
    }
});

const createChapter = asyncHandler(async (req, res) => {
    const { chapterId, chapterContent } = req.body;
    if (!chapterId || !chapterContent || !chapterContent.title) {
        res.status(400);
        throw new Error('chapterId and chapterContent.title are required');
    }
    const chapterExists = await Chapter.findOne({ chapterId });
    if (chapterExists) {
        res.status(400);
        throw new Error('Chapter with that ID already exists');
    }
    const chapter = new Chapter({ chapterId, chapterContent });
    const createdChapter = await chapter.save();
    res.status(201).json(createdChapter);
});

const updateChapter = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findOne({ chapterId: req.params.id });
    if (chapter) {
        chapter.chapterContent = req.body.chapterContent || chapter.chapterContent;
        const updatedChapter = await chapter.save();
        res.status(200).json(updatedChapter);
    } else {
        res.status(404);
        throw new Error('Chapter not found');
    }
});

const deleteChapter = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findOne({ chapterId: req.params.id });
    if (chapter) {
        await chapter.deleteOne();
        res.status(200).json({ message: 'Chapter removed' });
    } else {
        res.status(404);
        throw new Error('Chapter not found');
    }
});
export { getChapters, getChapterById, createChapter, updateChapter, deleteChapter };