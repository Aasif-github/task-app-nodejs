const userModel = require("../model/user");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const sharp = require('sharp'); // for multer, to shape or customise-image
const { Error } = require("mongoose");

// @ http://localhost:3000/registration
// @ author: asif
// @ similer package for validation: https://joi.dev/api/

exports.registration = [

    body('name').trim().isLength({min:2}).escape()
        .withMessage('User name must be specified')
        .isAlphanumeric()
        .withMessage('User name has non-alphanumeric characters'),

    body('email').trim().isEmail().withMessage('Enter proper email'),

    body('password').trim().notEmpty(),
 
        async (req, res) => {
    
        // Extract the validation errors from a request.
           const errors = validationResult(req);
           console.log(errors);

        try{
            /* Accessing Model in Controller */
            // const user = await userModel.find({});

            // console.log(req.body.name);
            // console.log(req.body.email);
            // console.log(req.body.password);
            
            //console.log(req.params.name);
            //console.log(user);

            const user_data = new userModel({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password
            })
            
            //console.log(user_data);
          
              if(!errors.isEmpty()){
                    console.log(errors);
                    res.status(422).json({errors: errors.array()})
              }else{
                console.log('step-1');
                const userSaved = await user_data.save();   
                const token = await user_data.generateAuthToken();                
                
                res.status(200).json({ userSaved, token });
              }
    
        }catch(err){
            console.log(err);
            res.status(500).json(err.message);
        }
     }

];
/*
Method: GET
http://localhost:3000/users/me 
set header: Authorization : jwt(token) for that user.
*/
exports.readUser = [
    
    async (req, res) =>{
       
       
        // hidding user password and token
        try{
            res.send(req.user);
            //better to use it model using toJson
        //     const userInfo = {
        //         "name": req.user.name,
        //         "email": req.user.email
        //     };                         
            
        //     console.log(userInfo);

        //   res.send(userInfo);

        }catch(err){
            console.log(err);
            res.status(500).send(err);
        }
        
    }
];

/*
@ Method: Get
@ url : http://localhost:3001/checkPassword
@ author: Asif
*/

/*
type of request:-
1.query params
2.params
3.header
4.body
*/

exports.checkPassword =  async (req, res) => {
   
    try{
        const password = '12345';
        const id = '65cb61c1cf2d9636bae7823e';
        //console.log('req:', req.query.password);

        const userInfo = await userModel.findById(id);
            
        // bcrypt.compare(req.query.password, userInfo.password)

        const result = await bcrypt.compare(password, userInfo.password);
        //console.log(result);

        if(result){
            res.status(200).json('Password match');
        }else{
            res.status(404).json('Password Not Match');
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }    
}

// @Method - PUT  
// http://localhost:3001/updateUser/userId
// author: asif

exports.updateUserInfo = [
    /*
    1. Check user is present in database or not.
    2. find object-key for update user info.
    3. save as it is in database.
    */ 

    async (req, res) => {
        try{
            // console.log(req.params.id); 65cb61c1cf2d9636bae7823e
            // const user_id = req.params.id;        
            // const user  = await userModel.findById(user_id);                        
            // if(!user){
            //     return res.send('No User Found');
            // }

            // request by user for update
            const updates = Object.keys(req.body)
            const allowedTyped = ['name', 'email', 'password'];           

            //  updates.every(callbackFun(ele, index, array))
            const isValidOperation = updates.every((update)=>{
                return allowedTyped.includes(update)
            });
          
            if(!isValidOperation){
                res.status(400).send({error:'Invalid key'});
            }

            updates.forEach((update) => { return req.user[update] = req.body[update]});
            
            console.log('as', req.user);
             
            await req.user.save();
            res.status(200).send(req.user);  
        }catch(err){
            console.log(err);
            res.status(400).send(err);  
        }
        
    }
];

 /*
# Testing credentials
{
    "name":"john",
    "email":"john@gmail.com",
    "password":"12345"
}
 */

exports.login = [

    async (req, res) => {
        
        try {
            const user = await userModel.findByCredentials(req.body.email, req.body.password); // statics
            const token = await user.generateAuthToken();  // methods

            res.status(200).send({user, token});    
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }

];

/*
- just delete the token that is user by the user to login.
- if we have multiple token(login with diff devices) then delete only one token that is used by login-User(using js-filter() to achive this)
-----------------or---------------
JUST RETURN ALL UN-MATCH TOKEN WITH REQUESTED-AUTH-TOKEN

token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNkYmEwNWNmNTgyMTBhOTA0NTZmZjUiLCJpYXQiOjE3MDg0OTU0NzcsImV4cCI6MTcwODUzMTQ3N30.cSEK5BOmdWVVwecjasVEVLvDJ4CKd5cZIOBB6rNSxxg',
*/

exports.logout = [
   
    async(req, res) => {
             
        try{
            const user = req.user;
            const token = req.token;
            
            req.user.tokens = req.user.tokens.filter((tokenObj) => {
                return tokenObj.token !== req.token;  // return all un-matched tokens
            })
            
            await req.user.save();
            res.send('Token deleted.');

            /*
            const tokens = req.user.tokens;
            const result = tokens.filter((obj) => obj.token === token );
            console.log(result);

            if(result){
                indexToDelete = tokens.findIndex((obj) => {
                    obj.token === token;
                })
                console.log('indexToDelete',indexToDelete);
                if(indexToDelete !== -1){
                    tokens.splice(indexToDelete, 1);
                    console.log('token deleted successfully');
                }
            }
            console.log(tokens);
            */
        }catch(error){
            console.log(error);
            res.status(500).send(error,'Req, Token not found');
        }
    }
]

/*
user will logout all the devices at ones.
*/
exports.logoutAll = [
    
    async(req, res) => {            
        try{
            const user = req.user;
            user.tokens = [];
            await user.save();

            res.status(200).send('Logut from all devices');
        }catch(error){
            res.status(500).send(err,'error');
        }
    }
]

exports.deleteUser = [
    
    async(req, res) => {            
        try{
             const user = req.user;
             console.log('user',user);
             if(user){
                const deletedUser = await User.findOneAndDelete(user._id);
                // await req.user.remove();
                if (!deletedUser) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.status(200).json({ message: 'User deleted successfully', deletedUser });
             }                           
        } catch(err){
            console.log('err', err)
            res.status(500).json(err);
        }  
    }

]
/*
{
     "email": "mike@gmail.com",
     "password": "12345"
}
*/

exports.uploadImage = [

    async (req, res) => {
        try {
             await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toFile(__dirname + `/images/${req.file.originalname}`)
             res.status(201).send('Image uploaded succesfully')
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    }
];

exports.doTask = [

    async (req, res) => {
        
    }
];