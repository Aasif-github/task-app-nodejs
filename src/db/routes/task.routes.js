const express = require('express');
const router = express.Router();
const taskController = require("../controllers/taskController");
const { body, validationResult } = require('express-validator');

const auth = require('../middlewares/Auth');

router.get('/task/show', taskController.show);
router.post('/task/add', auth, taskController.add);
 
module.exports = router;