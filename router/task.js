const express = require('express');
const router = express.Router();

const task_Handler = require('../router_handler/task');
const expressJoi = require('@escook/express-joi');
const {addTask_schema,updateTask_schema,updateTaskStatus_schema,deleteTask_schema} = require('../schema/task');

router.get('/getTasksById', task_Handler.getTasksById);

router.post('/addTask', expressJoi(addTask_schema),task_Handler.addTask);

router.delete('/deleteTask', expressJoi(deleteTask_schema),task_Handler.deleteTask);

router.post('/updateTask', expressJoi(updateTask_schema),task_Handler.updateTask);

router.post('/updateTaskStatus', expressJoi(updateTaskStatus_schema),task_Handler.updateTaskStatus)

module.exports = router