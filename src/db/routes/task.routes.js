const express = require('express');
const router = express.Router();
const taskController = require("../controllers/taskController");
const { body, validationResult } = require('express-validator');

const auth = require('../middlewares/Auth');


router.get('/tasks', auth, taskController.tasks);

//http://localhost:3000/tasks?completed=true

router.get('/task/show', auth, taskController.show);
router.post('/task/add', auth, taskController.add);
router.patch('/task/update/:task_id', auth, taskController.update);
router.delete('/task/delete/:task_id', auth, taskController.delete);

module.exports = router;