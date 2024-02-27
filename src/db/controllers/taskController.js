const taskModel = require('../model/task');
const { findById } = require('../model/user');
 
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

/*
Authorize user can update only his/her task

*/

exports.update = [

    // validation

    // owner:65dc37876393dc8af1942328
    async (req, res) =>{
        
        const updates = Object.keys(req.body);
        const allowedType = ['description','completed'];
        const isValidOperation = updates.every((update) => allowedType.includes(update));

        if(!isValidOperation){
            
            return res.status(400).send({ error: 'Invalid updates!' })
        }

        try{
            // get task details using (_id)req.params.id[task_id] OR req.user._id(owner)
            // if-user found - set updated value in database
            // if not - return 404
            
            const fetchTaskByTaskId = await taskModel.findById({'_id': req.params.task_id });
            
            if(fetchTaskByTaskId === null){
                return res.status(404).send({'msg':'No Task has been assign to this User'});    
            }

            
            // Only assigned user will update task (what if other-user knows taskID)
            if(JSON.stringify(fetchTaskByTaskId.assignedUser) === JSON.stringify(req.user._id)){
              
                updates.forEach((update) => fetchTaskByTaskId[update] = req.body[update])
                
                console.log(updates);

                await fetchTaskByTaskId.save()
            
                res.send(fetchTaskByTaskId)
            } else {                
                return res.status(400).send({'msg':'Not Allowed - UnAutherised User'});    
            }
        }catch(error){
            console.log(error);
            return res.status(400).send(error);
        }
    }
    

];

exports.delete = [
    // validation

    async (req, res) => {
        try {
              
            const fetchTaskByTaskId = await taskModel.findById({'_id': req.params.task_id });
            
            if(fetchTaskByTaskId === null){
                return res.status(404).send({'msg':'No Task has been assign to this User'});    
            }
            
            // Only assigned user will update task (what if other-user knows taskID)
            if(JSON.stringify(fetchTaskByTaskId.assignedUser) === JSON.stringify(req.user._id)){
                
                await taskModel.findOneAndDelete({ _id: req.params.task_id})

            }
    
            return res.send({'msg':'Task Deleted'});

        } catch (e) {
            return res.status(500).send(e)
        }
    }

];