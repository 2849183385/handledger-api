const db = require('../db/index')

//根据 Id 获取任务信息接口
exports.getTasksById=(req, res) => {
    const { task_id } = req.query;
    // 构造查询任务的SQL语句
    const sql = "SELECT * FROM tasks WHERE task_id =?";
    const values = [task_id];
    // 执行SQL语句
    db.query(sql, values, (err, results) => {
        //执行sql语句失败
        if (err) {
            return res.cc({ status: 1, message: err.message })
           
        }
        //执行sql语句成功
        // 返回任务列表
        if (results.length === 0) return res.cc('查询任务信息失败，请稍后再试！')
        //查询成功
        res.cc({ status: 0, message: '查询任务信息成功', data: results[0] })
    });
};


// 添加任务接口
exports.addTask = (req, res) => {
    
    const { task_title, task_description, due_date, priority, creator_id, cate_id } = req.body;

    // 构造插入任务的SQL语句
    const sql = "INSERT INTO tasks (task_title, task_description, due_date, priority, creator_id, cate_id, created_time, updated_time) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
    const values = [task_title, task_description, due_date, priority, creator_id, cate_id];

    // 执行SQL语句
    db.query(sql, values, (err, results) => {
        if (err) {
            return res.cc({ status: 1, message: err.message })
        }
        // 返回添加的任务ID
        res.cc({ status: 0, message: '添加任务成功', })

    });
};

// 删除任务接口
exports.deleteTaskById = (req, res) => {
    // res.send('删除任务接口')
    const task_id = req.params.id;
    // 构造删除任务的SQL语句
    const sql = "update tasks set is_delete=1 WHERE task_id = ?";
    const values = [task_id];
    // 执行SQL语句
    db.query(sql, values, (err, results) => {
        if (err) {
            return res.cc({ status: 1, message: err.message })
        }
        res.cc({ message: "任务删除成功" });
    });
};




