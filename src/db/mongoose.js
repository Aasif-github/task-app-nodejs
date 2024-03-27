const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require("express-rate-limit");
const cors = require('cors');

require('dotenv').config();
console.log('my Port no:',process.env.DEV_PORT) // remove this after you've confirmed it is working

// const Task = require('./model/task');

const path = require('path');

// Router
const taskRouter = require('./routes/task.routes');
const userRouter = require('./routes/user.routes');
// console.log('test', taskRouter)
const app = express();

app.use(express.json());

// Use the cors middleware to enable CORS for all routes
app.use(cors());


// app.use(express.text());

// middleware - (use before routes)
// request -> route - without middleware
// request -> middleware -> route - with middleware
// middleware acts as a bridge between request and routes
app.use((req, res, next) => {
  // console.log(req.method);
  // console.log(req.path);
  next();
})

// middleware for maintance mode
// app.use((req, res, next) => {
//   res.send('This website is in maintance mode. check after 4hrs. :(');
// });

// express-rate-limit
// Only 10 request-hits accepted by app within 1 hrs
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //  60sec * 60min * 1000ms - 1hrs
  message: "Too many request from this IP"
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);



app.use(userRouter);
app.use(taskRouter);
//static template-engine
const ejs = require('ejs');
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/task/sample', taskRouter.test_contoller);
// app.use();

/*
The express. json() function is a middleware function used in Express. js applications to parse It is the process of converting a JSON string to a JSON object for data manipulation. 
 */

// app.use(express.urlencoded({ extended: true }));

app.set("views", __dirname + "/views");

// Set EJS as templating engine 
app.set('view engine', 'ejs');

// app.set("view engine", "pug");
 
// const uri = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-app';
// const collectionName = 'users';

// const port = 3000;

// http://localhost:3000/users

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DEV_DB, {});
      console.log(`MongoDB Connected: {conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

  connectDB();
  
  // https://www.digitalocean.com/community/tutorials/how-to-implement-caching-in-node-js-using-redis

// Redis connection setup
// (async () => { 
//   await redisclient.connect(); 
// })(); 

// console.log("Connecting to the Redis"); 

 


  // app.get('/users', async (req, res) => {
    
  //   try{
  //     let user = await User.find({});

  //     console.log(user);
      
  //     if(!user){
  //       throw new Error();
  //     }

  //     // res.render('user_details', {
  //     //   message: "User List",
  //     //   user: user     
  //     // });

  //     res.render('user_list.ejs', {
  //       message: "User List",
  //       user: user     
  //     });
 
  //    // res.status(200).json({user});

  //   }catch(err){
  //     res.status(404).send()
  //   }

  // });


  


  
  // app.post('/task', async(req, res) => {
  //   // console.log(req.body);

   
  //   try{
  //     let task = new Task(req.body); // this req.body check by TaskSchema
       
  //       const savedTask =  await task.save();  
         
  //       res.status(200).json(savedTask);
  //   }catch(error){
  //     console.log(error);
  //       res.status(500).send(error);
  //   }

  // });

  // update any task.
  /*
  app.patch('/task/:id', async(req, res) => {
    
    try {
      let updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body);
      console.log(updatedTask);
      res.status(200).json(updatedTask);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  // delete any task

  app.delete('/task/:id', async(req, res) => {

    try{
      let deletedTask = await Task.findByIdAndDelete(req.params.id);
      console.log(deletedTask);
      if(deletedTask){
        res.status(200).send('Task deleted');
      }else{
        res.status(404).send('Task not found');
      }
    }catch(error){
      console.log(error);
      res.status(500).send(error);
    }
  })
*/
let port = process.env.DEV_PORT;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

/*
  database - event_procedure
  table - tbl_buyers
  -------------------------------------
  table_attributes:
  user_id
  order_id
  product_id
  payment_id
  product_name
  purchase_datetime
  product_return_status
  -------------------------------------
  condition :
  after 2 days product_return_status will set false(set 0), that means user can not return there product.


  OR

  - we can create one more attribute in database. ie expire_datetime
  - Then, When user purchase the product, at the time of insertion of purchase_datetime we    have to insert expire_datetime(ie. purchase date + 2 days).
  -  each time user visit his profile. function product_status() is called which checks the product expire_date 

*/

/*

how to start nodejs app

install npm
install nodejs
install express/ mongodb / mongoose / nodemon

1. connect to database using mongoose
2. Set Port number
3. Create Schema for collection(table)
4. define routes in app and write query inside callback , also return result with status.
*/


