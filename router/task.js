const express = require('express');
const router = express.Router();

const task_Handler = require('../router_handler/task');


// router.get('/getTaskById/:id', task_Handler.getTasksById);

router.post('/addTask', task_Handler.addTask);

router.delete('/deleteTask/:id', task_Handler.deleteTaskById);

router.put('/updateTask/:id', task_Handler.updateTaskById);

router.post('/finishTaskById',task_Handler.finishTaskById)
module.exports = router