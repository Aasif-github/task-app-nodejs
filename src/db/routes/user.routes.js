const express = require('express');
const userController = require("../controllers/userController.js");
const router = express.Router();

router.get('/testing', function(req, res){
    res.send('testing-user-routes');
})

router.post('/registration', userController.testing);
router.get('/checkPassword', userController.checkPassword);




module.exports = router;