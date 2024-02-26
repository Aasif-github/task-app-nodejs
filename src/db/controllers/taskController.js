const taskModel = require('../model/task');
 
/*
show all task, assignTo(user name) with status and datetime
Set Token of login - user
Note: Admin Tasklist will [] empty becouse Admin dont have assigned id. it has owner it.
*/
 exports.show = [
    //validation
    async (req, res) => {
        try{
            console.log(req.user._id);
          
            const taskList = await taskModel.find({ assignedUser:req.user._id }).populate('assignedUser');
            
            //For New User, and Admin
            if(!taskList.length){
                return res.status(200).send({Msg: 'No Task Has been Assigned to this User'});    
                
            }
            
            return res.status(200).send({tasks:taskList});
        }catch(err){
            console.log(err)
            res.status(500).send(err);
        }
    }
]

exports.add = [
    // validation

    async (req, res) => {
        
    const taskList = await taskModel.find({ assignedUser:req.user._id }).populate('assignedUser');
    // Check the number of tasks assigned to the user
        console.log(taskList);
    let assignedUser = taskList[0].assignedUser._id;
    
    const userTaskCount = await taskModel.countDocuments({ assignedUser });
    
   console.log(userTaskCount);

    if (userTaskCount >= 2) {
      return res.status(400).json({ error: 'User can have only two tasks.' });
    }

        const task = new taskModel({
            ...req.body,
            owner: req.user._id
        })
        
        try{    
           // await task.save();            
            res.status(201).json({'status': task});
        }catch(err){
            res.status(500).send(err);
        }
    }
]

/*

- Only description and task-status will update(True/False).
- Only Admin can update task with task_id

req.body = {
    "des": "",
    "completed": true
}

*/

exports.update = [

    //validation
    async (req, res) =>{
        const updates = Object.keys(req.body);
        const allowedType = ['description','completed'];
        const isValidOperation = updates.every((update) => allowedType.includes(update));

        if(!isValidOperation){
            return res.status(400).send({ error: 'Invalid updates!' })
        }

        try{
            
        }catch(error){

        }
    }
    

];

exports.delete = [
    // validation

    async (req, res) => {
        try {
            const task = await taskModel.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    
            if (!task) {
                res.status(404).send()
            }
    
            res.send(task)
        } catch (e) {
            res.status(500).send()
        }
    }

];