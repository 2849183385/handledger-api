const express = require('express');
const router = express.Router();

const task_Handler = require('../router_handler/task');
const expressJoi = require('@escook/express-joi');
const addTask_schema = require('../schema/task');

router.get('/getTasksById/:id', task_Handler.getTasksById);

router.post('/addTask', expressJoi(addTask_schema),task_Handler.addTask);

router.delete('/deleteTaskById/:id', task_Handler.deleteTaskById);

router.put('/updateTask/:id', task_Handler.updateTaskById);

router.post('/finishTaskById',task_Handler.finishTaskById)
module.exports = router