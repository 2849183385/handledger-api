const joi = require('joi');

const task_id = joi.number().required();
const creator_id = joi.number().required();
const cate_id = joi.number().required();
const task_title = joi.string().min(3).max(255);
const task_description = joi.string().min(3).max(255);
const task_status = joi.string().valid('Pending', 'In Progress', 'Completed');
const start_date = joi.date().greater("now");
const end_date = joi.date().greater("now");
const priority = joi.string().valid('High', 'Medium', 'Low');
const assignedTo = joi.string();

exports.addTask_schema = {
    task_id,
    task_title,
    task_description,
    task_status,
    start_date,
    end_date,
    priority,
    assignedTo
}

exports.updateTask_schema = {
    task_id,
    task_title,
    task_description,
    task_status,
    start_date,
    end_date,
    priority,
    assignedTo,
    creator_id,
    cate_id, 
}
