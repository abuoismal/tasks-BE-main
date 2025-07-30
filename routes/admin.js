const express = require('express');
const { body } = require('express-validator');
const tasksControllers = require('../controller/admin');
const tasksFilter = require('../controller/admin-filter');
const isAuth = require('../middlware/is-auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// إعداد رفع الصورة
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // تأكد إن الفولدر موجود
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// الراوتات
router.get('/all-tasks', isAuth, tasksFilter.filter, tasksControllers.getTasks);
router.get('/user-tasks/:id', isAuth, tasksFilter.filter, tasksControllers.getUserTasks);

router.post(
  '/add-task',
  isAuth,
  upload.single('image'), // ← لازم دا عشان الصورة
  body('title').trim().isLength({ min: 5, max: 255 }),
  tasksControllers.createTask
);

router.put(
  '/edit-task/:id',
  isAuth,
  upload.single('image'), // لو حابب تعدل الصورة كمان
  body('title').trim().isLength({ min: 5, max: 255 }),
  tasksControllers.editTask
);

router.delete('/delete-task/:id', isAuth, tasksControllers.deleteTask);
router.get('/task/:id', isAuth, tasksControllers.taskDetails);
router.put('/complete', isAuth, tasksControllers.completeTask);

module.exports = router;
