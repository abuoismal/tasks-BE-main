const Tasks = require('../models/task');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: 'Image is required'
    });
  }

  const { title, userId, description, deadLineDate } = req.body;

  try {
    const task = new Tasks({
      title,
      userId,
      image: req.file.path, // ← مكان الصورة في السيرفر
      description,
      deadline: deadLineDate
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
