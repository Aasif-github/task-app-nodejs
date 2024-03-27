const { log } = require('console');
const taskModel = require('../model/task');
const { findById } = require('../model/user');
const userModel = require('../model/user');

/*

@ SortByTaskCompleted -  {{url}}/tasks?completed=true
@ Pagination          -  {{url}}/tasks?limit=10&skip=20
@ Sorting             -  {{url}}/tasks?sortBy=createdAt:desc | createdAt:asc

*/

exports.tasks = [

    // validation

    async (req, res) => {

        const match = {};
        const sort = {};

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        // sort = { createdAt : -1 }
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        try {
            await req.user.populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit) ? 5 : 0,
                    skip: parseInt(req.query.skip) ? 5 : 0,
                    sort
                }
            });

            if (req.user.tasks.length === 0) {
                return res.status(404).send('No Task Found')
            }

            if (req.user.tasks.length > 0) {
                return res.status(200).send(req.user.tasks);
            }

        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
];

/*
show all task, assignTo(user name) with status and datetime
Set Token of login - user
Note: Admin Tasklist will [] empty becouse Admin dont have assigned id. it has owner it.
*/


exports.show = [
    //validation
    async (req, res) => {
        try {
           
            // Fetch tasks from MongoDB
            const taskList = await taskModel.find({ assignedUser: req.user._id }).populate('assignedUser');

            // Handle no tasks for new user or admin
            if (!taskList.length) {
                
                return res.status(200).send({ Msg: 'No Task Has been Assigned to this User' });
            }
            return res.status(200).send({ tasks: taskList });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }
]

/*
@ req.user - login-user from auth.js
*/
exports.add = [
    // validation

    async (req, res) => {

        try {
            // check user type. only admin will add Task and assign task to user.
            let loginUser = req.user.type.toLowerCase();

            if (loginUser === 'admin') {
                console.log("welcome admin");
                // Check total number of task that have assigned user.            
                let assignedUser = req.body.assignedUser;

                const taskList = await taskModel.find({ assignedUser: assignedUser }).populate('assignedUser');

                if (taskList.length <= 2) {

                    const task = new taskModel({
                        ...req.body,
                        owner: req.user._id
                    });
                    await task.save();
                    return res.status(201).json({ 'status': task });
                }

                if (taskList.length >= 2) {
                    return res.status(400).json({ error: 'User can have only two tasks.' });
                }

            } else {
                return res.status(401).json({ 'msg': 'Unauthorized User Type' });
            }

        } catch (err) {
            console.log(err);
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
    async (req, res) => {

        const updates = Object.keys(req.body);
        const allowedType = ['description', 'completed'];
        const isValidOperation = updates.every((update) => allowedType.includes(update));

        if (!isValidOperation) {

            return res.status(400).send({ error: 'Invalid updates!' })
        }

        try {
            // get task details using (_id)req.params.id[task_id] OR req.user._id(owner)
            // if-user found - set updated value in database
            // if not - return 404

            const fetchTaskByTaskId = await taskModel.findById({ '_id': req.params.task_id });

            if (fetchTaskByTaskId === null) {
                return res.status(404).send({ 'msg': 'No Task has been assign to this User' });
            }


            // Only assigned user will update task (what if other-user knows taskID)
            if (JSON.stringify(fetchTaskByTaskId.assignedUser) === JSON.stringify(req.user._id)) {

                updates.forEach((update) => fetchTaskByTaskId[update] = req.body[update])

                console.log(updates);

                await fetchTaskByTaskId.save()

                res.send(fetchTaskByTaskId)
            } else {
                return res.status(400).send({ 'msg': 'Not Allowed - UnAutherised User' });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).send(error);
        }
    }


];

exports.delete = [
    // validation

    async (req, res) => {
        try {

            const fetchTaskByTaskId = await taskModel.findById({ '_id': req.params.task_id });

            if (fetchTaskByTaskId === null) {
                return res.status(404).send({ 'msg': 'No Task has been assign to this User' });
            }

            // Only assigned user will update task (what if other-user knows taskID)
            if (JSON.stringify(fetchTaskByTaskId.assignedUser) === JSON.stringify(req.user._id)) {

                await taskModel.findOneAndDelete({ _id: req.params.task_id })
            }

            return res.send({ 'msg': 'Task Deleted' });

        } catch (e) {
            return res.status(500).send(e)
        }
    }

];