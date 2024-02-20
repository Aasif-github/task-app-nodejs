const { header } = require('express-validator');
const User = require('../model/user')
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    
    try{
        const token = req.header('Authorization').replace('Bearer', '');
        console.log(token);
        const decoded = jwt.verify(token, 'myKey');
        console.log('decoded::::',decoded);
       
        const user = await User.findOne({ _id: decoded._id, 'tokens.token':token });
        
 
        console.log(user);
       

        if(!user){
            throw new Error();
        }
        req.user = user;
        next();    
    }catch(err){
        console.log(err);
        res.status(401).send({error:'Please authenticate.'});
    }
    
}

module.exports = auth;

/*
Real-time
https://stackoverflow.com/questions/40539609/how-to-add-authorization-header-in-postman-environment


for testing:

POST: http://localhost:3001/user/login
---------------Hxxxxs --Body-----------------------
--------------------------------------------------- 
                0-raw                  JSON-v
--------------------------------------------------- 
            {
                "email": "john@gmail.com",
                "password": "12345"
            }
---------------------------------------------------            

---------------Headers ----------------------------
key: Authorization 
value: Bearer-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNkYmEwNWNmNTgyMTBhOTA0NTZmZjUiLCJpYXQiOjE3MDg0MTE0MzMsImV4cCI6MTcwODQxNTAzM30.OF56QRB8aDSu2vvZdvUAn8zK6p826SFWxIQ1TAt1-qg


token:
Bearer-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNkYmEwNWNmNTgyMTBhOTA0NTZmZjUiLCJpYXQiOjE3MDg0MTE0MzMsImV4cCI6MTcwODQxNTAzM30.OF56QRB8aDSu2vvZdvUAn8zK6p826SFWxIQ1TAt1-qg
*/
