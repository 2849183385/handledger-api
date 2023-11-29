const db = require('../db/index')


//根据 创建者Id 获取任务信息接口
exports.getTasksById=(req, res) => {
    // 构造查询任务的SQL语句
    const sql = "SELECT * FROM tasks WHERE creator_id = ?";
    // 执行SQL语句
    db.query(sql, req.query.id, (err, results) => {
        //执行sql语句失败
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (results.length === 0) return res.send({ status: 1, message: '查询任务信息失败，请稍后再试' })
        //查询成功
        res.send({ status: 0, message: '查询任务信息成功', data: results })
    });
};

// 添加任务接口
exports.addTask = (req, res) => {
    const { task_title, task_description, start_date, end_date, priority, creator_id,  } = req.body;
    // 构造插入任务的SQL语句
    const sql = "INSERT INTO tasks (task_title, task_description, start_date, end_date, priority, creator_id,  created_time, updated_time) VALUES (?, ?, ?, ?, ?,?, NOW(), NOW())";
    const values = [task_title, task_description, start_date, end_date, priority, creator_id, ];

    // 执行SQL语句
    db.query(sql, values, (err, results) => {
        if (err) {
            return res.send({status: 1,  message: err.message })
        }
        if (results.affectedRows === 0) return res.send({ status: 1, message: '添加任务失败，请稍后再试！', data: results })

        // 返回添加的任务ID
        res.send({ status: 0, message: '添加任务成功', })

    });
};

// 删除任务接口
exports.deleteTask = (req, res) => {
    // res.send('删除任务接口')
   
    // 构造删除任务的SQL语句
    const sql = "update tasks set is_delete=1 WHERE task_id = ? and creator_id=?";
    // 执行SQL语句
    db.query(sql,[req.body.task_id,req.body.creator_id,], (err, results) => {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        if (results.affectedRows === 0) return res.send({status:1, message: '删除失败，请稍后再试！', data: results })

        res.send({ status:0,message: "任务删除成功" });
    });
};


//更新任务信息接口
exports.updateTask = (req, res) => {
    const { task_id, task_title, task_description, start_date, end_date,priority, creator_id} = req.body;
    // 构造更新任务的SQL语句
    const sql = "update tasks set task_title = ?, task_description = ?, start_date =?, end_date=?, priority = ? WHERE task_id =? and creator_id=?";
    // 执行SQL语句
    db.query(sql, [task_title, task_description, start_date, end_date, priority,task_id,  creator_id], (err, results) => {
        //执行sql语句失败
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        if (results.affectedRows === 0) return res.send({status: 1, message: '更新失败，请稍后再试！', data: results })

        res.send({status:0, message: "任务更新成功" });
    });
};

//完成任务接口
exports.updateTaskStatus = (req, res) => {
    // 构造更新任务的SQL语句
    const sql = "UPDATE tasks SET status = ? WHERE task_id =? and creator_id=?";
    // 执行SQL语句
    db.query(sql, [req.body.status,req.body.task_id,req.body.user_id], (err, results) => {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        if (results.affectedRows === 0) return res.send({ status: 1, message: '修改用户信息失败，请稍后再试！', data: results })
        res.send({ status:0,message: "已完成任务" });
    });
}

