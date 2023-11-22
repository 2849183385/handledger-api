const express = require('express');
const router = express.Router();

const task_Handler = require('../router_handler/task');


router.get('/getTask/:id', task_Handler.getTasksById);

router.post('/addTask', task_Handler.addTask);

router.delete('/deleteTask/:id', task_Handler.deleteTaskById);

module.exports = router