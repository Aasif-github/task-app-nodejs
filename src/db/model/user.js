const mongoose = require('mongoose');
// const { default: isEmail } = require('validator/lib/isEmail');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        // validate(value){
        //     if(!validator(isEmail(value))){
        //         throw new Error('Email is invalid')
        //     }
        // }
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema)

module.exports = User;

//