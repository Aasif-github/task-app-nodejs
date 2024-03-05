const express = require('express');
const router = express.Router();
const taskController = require("../controllers/taskController");
const { body, validationResult } = require('express-validator');

const auth = require('../middlewares/Auth');


router.get('/tasks', auth, taskController.tasks);

//@ Sort By completed - http://localhost:3000/tasks?completed=true
//@ Pagination        - http://localhost:3000/tasks?limit=10&skip=20
//@ Sort By ase/desc  - http://localhost:3000/tasks?sortBy=createdAt:desc | createdAt:asc

router.get('/task/show', auth, taskController.show);
router.post('/task/add', auth, taskController.add);
router.patch('/task/update/:task_id', auth, taskController.update);
router.delete('/task/delete/:task_id', auth, taskController.delete);

module.exports = router;