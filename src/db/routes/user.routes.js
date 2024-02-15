const express = require('express');
const userController = require("../controllers/userController.js");
const router = express.Router();

router.get('/testing', function(req, res){
    res.send('testing-user-routes');
})

router.post('/registration', userController.registration);
router.get('/checkPassword', userController.checkPassword);
router.put('/updateUser/:id', userController.updateUserInfo);
router.post('/user/login', userController.login);



module.exports = router;