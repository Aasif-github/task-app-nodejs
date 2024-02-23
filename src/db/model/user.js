const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*
The best place to store JWTs in a Node.js app is typically in the HTTP Headers using the Authorization header with the Bearer scheme. This method is commonly used and has some advantages:

1. Security: Storing JWTs in the Authorization header helps protect against XSS attacks since the token is not accessible by client-side scripts.

2. Standardized: It follows the standard way of handling authentication tokens in HTTP requests.

Example: Authorization: Bearer your.jwt.token

Always ensure that your Node.js app is using HTTPS to encrypt the communication, preventing eavesdropping on the token during transit.

Additionally, if your application has a front-end (e.g., a web client), consider using HTTP-only cookies to store JWTs for added security. This prevents client-side scripts from accessing the token.
----------------------------------------------------------

Both localStorage and SessionStorage are not protected by the XSS by default.

However, the Cookie provides a bunch of security options like SameSite ,” HttpOnly , etc. So it is good to go with Cookie.

“Store Your JWT on Cookie with Some Secure Flag.”

*/
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
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type:Number,
        default:0,        
        validate(value){
            if(value < 0){
                throw new Error('Age must be a Positive number')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }        
    }]
});

// Hash Plain text Password before save it to database or pass it in userController.
// we cann't use arrow-function becouse of this-binding.
userSchema.pre('save', async function(next){

    const user = this
    console.log('step-2: password hashed');
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});



/*
https://athiravajit.medium.com/what-are-methods-and-statistics-in-mongoose-f128d51b49b0
https://stackoverflow.com/questions/39708841/what-is-the-use-of-mongoose-methods-and-statics


Statistics and methods are quiet similar to each other with only difference being statics are functions you call on the whole model whereas methods are functions you call on a particular instance.
*/

userSchema.statics.findByCredentials = async (email, password) => {
        
    try {
        const user = await User.findOne({email});
        
        if(!user){
            throw new Error('No User Found');
        }
      
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if(!isPasswordMatch){
            throw new Error("Password Not Match")
        }
        return user;
        
    } catch (error) {
        console.log(error);
        return error;
    }
    
}

userSchema.methods.toJSON = function(){
    const user = this;
    
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;    
    
    return userObject;
}

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    
    // Create a JWT
    const secretKey = 'myKey';
    const payload = { _id:user._id.toString() };
    
    const token = jwt.sign(payload, secretKey, {expiresIn:'10h'});

    user.tokens = user.tokens.concat({ token });
    
    //saving it to database
    await user.save();
  
   return token;
}

const User = mongoose.model('User', userSchema)

module.exports = User;

//https://mongoosejs.com/docs/populate.html