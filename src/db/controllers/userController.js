const userModel = require("../model/user");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// @ http://localhost:3001/registration
// @ author: asif
// @ similer package: https://joi.dev/api/

exports.testing = [

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
                res.status(200).json(userSaved);
              }
    
        }catch(err){
            console.log(err);
            res.status(500).json(err.message);
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
            const user_id = req.params.id;
            
            const allowedTyped = ['name', 'email', 'password'];            

            const user  = await userModel.findById(user_id);                        
            
            if(!user){
                return res.send('No User Found');
            }

            // request by user for update
            const updates = Object.keys(req.body)
            
            console.log('up:', updates);

            //  updates.every(callbackFun(ele, index, array))
            const isValidOperation = updates.every((update)=>{
                return allowedTyped.includes(update)
            });
          
            if(!isValidOperation){
                res.status(400).send({error:'Invalid key'});
            }

            updates.forEach((update) => { return user[update] = req.body[update]});
            
            console.log('as', user);
             
            await user.save();
            res.status(200).send(user);  
        }catch(err){
            console.log(err);
            res.send(err);    
        }
        
    }
];

// password" a111
// password: hash: $2a$08$.dknCjiBWAgAJjVu5WHBW.jkajsf4Idr1EwGNhasnSyzQEf2Uuwr.

