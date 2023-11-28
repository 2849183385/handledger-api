const joi = require('joi');

const user_id = joi.number().required();
const task_id = joi.number().required();
const creator_id = joi.number().required();
// const cate_id = joi.number().required();
const task_title = joi.string().min(3).max(255);
const task_description = joi.string().min(3).max(255);
const task_status = joi.string().valid('Pending', 'InProgress', 'Completed');
const start_date = joi.number().required();
const end_date = joi.number().required();
const priority = joi.number().valid(1, 2, 3);
// const assignedTo = joi.string();

exports.addTask_schema = {
    task_id,
    task_title,
    task_description,
    task_status,
    start_date,
    end_date,
    priority,
    creator_id
    // assignedTo
}

exports.updateTask_schema = {
    task_id,
    task_title,
    task_description,
    task_status,
    start_date,
    end_date,
    priority,
    // assignedTo,
    creator_id,
    // cate_id, 
}


exports.updateTaskStatus_schema = {
    task_id,
    task_status,
    user_id
}

exports.deleteTask_schema = {
    task_id,
    creator_id
}