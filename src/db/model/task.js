const mongoose = require('mongoose');
const User = require('../model/user');

const taskSchema = new mongoose.Schema({
        description:{
            type: String,
            required: true,
            trim: true
        },
        completed:{
            type:Boolean,
            default:false
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        assignedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            enum: [],
            default: null
          }
    },
    {
        timestamps:true
    }
);

/*
In future, One User will only get 2 Tasks
*/ 
// Middleware to populate the enum options from the User model
taskSchema.pre('validate', async function (next) {
    try {
      const users = await User.find({}, '_id');
      // console.log(users);

      this.schema.path('assignedUser').enum = users.map(user => user._id);
      next();
    } catch (error) {
      next(error);
    }
  });

const Task = mongoose.model('Task', taskSchema)

module.exports = Task;