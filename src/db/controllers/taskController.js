const taskModel = require('../model/task');
 
 exports.show = [
    //validation

    async (req, res) => {
        try{
            res.status(200).send({message:'i\'m from task'});
        }catch(err){

        }
    }
]

exports.add = [
    // validation

    async (req, res) => {
        
        const task = new taskModel({
            ...req.body,
            owner: req.user._id
        })

        try{    
            
            await task.save();
            
            res.status(201).json({'status': task});
        }catch(err){
            res.status(500).send(err);
        }
    }
]