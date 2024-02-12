const express = require('express');
const test_contoller = require("../controllers/taskController");
const router = express.Router();


// console.log(test_contoller)

// router.get('/test', test_contoller);

router.get('/abc', function(req, res, next){
  try {
    console.log('cool')
    res.send({ "name": "GeeksforGeeks" });
    next();
  } catch (error) {
    console.log(error);
  }
    
})


module.exports = router;