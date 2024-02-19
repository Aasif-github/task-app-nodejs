const express = require('express');
const userController = require("../controllers/userController.js");
const router = express.Router();
const multer = require('multer');


// https://medium.com/geekculture/nodejs-image-upload-with-multer-e6cf08c1562f
//configure multer
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid image file'))
        }
        cb(undefined, true)
    }
}) 

router.get('/', function(req, res){
    res.send('<h3>Welcome to my app..</h3>');
})

router.post('/registration', userController.registration);
router.get('/checkPassword', userController.checkPassword);
router.put('/updateUser/:id', userController.updateUserInfo);
router.post('/user/login', userController.login);

/*

In Postman 
[Request] POST - [url] http://localhost:3001/user/image
select - Body -> form-data
Key - upload [type:file] | value: select File

*/

router.post('/user/image', upload.single('upload'), userController.uploadImage);

module.exports = router;