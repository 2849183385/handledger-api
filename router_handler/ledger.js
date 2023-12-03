const db = require('../db/index');



// 创建文章
exports.publishLedger=(req, res) => {
    const { title, content, image_url ,user_id} = req.body;
    const sql = 'INSERT INTO posts (title, content,image_url,user_id)  VALUES (?, ?, ?, ?) ';
    db.query(sql, [title, content, image_url, user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '添加失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '添加成功'})
    });
};

// 获取文章列表
exports.getLedger = (req, res) => {
    const sql = "SELECT * FROM posts";
    db.query(sql, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '查询任务信息失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '查询任务信息成功', data: result })
    })
}

// 发布评论
exports.publishComment=(req, res) => {
    const { content, post_id, user_id } = req.body;
    const sql = 'INSERT INTO comments (content, post_id ,user_id) VALUES (?, ?, ?)';
    db.query(sql, [content, post_id, user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '添加失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '添加成功' })
    });
};

// 获取评论列表
exports.getLComments=(req, res) => {
    const sql = 'SELECT * FROM comments';
    db.query(sql, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '查询任务信息失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '查询任务信息成功', data: result })
    });
};

// 发布点赞
exports.publishLike=(req, res) => {
    const { post_id,user_id } = req.body;
    const sql = 'INSERT INTO likes (post_id,user_id) VALUES (?, ?)';
    db.query(sql, [post_id, user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '添加失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '添加成功' })
    });
}
// 获取点赞列表
exports.getLikes=(req, res) => {
    const sql = 'SELECT * FROM likes';
    db.query(sql, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '查询任务信息失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '查询任务信息成功', data: result })
    });
}
// 发布收藏
exports.publishFavorites=(req, res) => {
    const { post_id,user_id } = req.body;
    const sql = 'INSERT INTO Favorites ( post_id,user_id) VALUES (?,?)';
    db.query(sql, [post_id, user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '添加失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '添加成功' })
    })
}
// 获取收藏列表
exports.getFavorites=(req, res) => {
    const sql = 'SELECT * FROM Favorites';
    db.query(sql, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '查询任务信息失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '查询任务信息成功', data: result })
    });
}

//发表回复
exports.publishReply=(req, res) => {
    const { content, post_id, user_id } = req.body;
    const sql = 'INSERT INTO replies (content, post_id,user_id) VALUES (?,?,?)';
    db.query(sql, [content, post_id, user_id], (err, result) => {
        if (err) {  
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '添加失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '添加成功' })
    })
}
// 获取回复列表
exports.getReply=(req, res) => {
    const sql = 'SELECT * FROM replies';
    db.query(sql, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '查询任务信息失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '查询任务信息成功', data: result })
    })
}

//回复点赞
exports.publishReplyLike=(req, res) => {
    const { reply_id,user_id } = req.body;
    const sql = 'INSERT INTO reply_likes (reply_id,user_id) VALUES (?,?)';
    db.query(sql, [reply_id, user_id], (err, result) => {
        if (err) {  
            return res.send({ status: 1, message: err.message })

        }
        if (result.length === 0) return res.send({ status: 1, message: '添加失败，请稍后再试' })
        res.send({ status: 0, message: '添加成功' })
    })
}
//获取回复点赞
exports.getReplyLikes=(req, res) => {
    const sql = 'SELECT * FROM reply_likes';
    db.query(sql, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '查询任务信息失败，请稍后再试' })
        res.send({ status: 0, message: '查询任务信息成功', data: result })
    })
}