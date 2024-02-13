const userModel = require("../model/user");
const { body, validationResult } = require('express-validator');

// @ http://localhost:3001/registration
// @ author: asif

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

]
