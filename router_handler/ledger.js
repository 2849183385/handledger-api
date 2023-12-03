const db = require('../db/index');



// 创建文章
exports.publishLedger=(req, res) => {
    const { title, content } = req.body;
    const sql = 'INSERT INTO articles (title, content) VALUES (?, ?)';
    db.query(sql, [title, content], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, title, content });
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
    const { content, articleId } = req.body;
    const sql = 'INSERT INTO comments (content, articleId) VALUES (?, ?)';
    db.query(sql, [content, articleId], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, content, articleId });
    });
};



// 获取评论列表
exports.getLComments=(req, res) => {
    const sql = 'SELECT * FROM comments';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};
// 发布点赞
exports.publishLike=(req, res) => {
    const { articleId } = req.body;
    const sql = 'INSERT INTO likes (articleId) VALUES (?)';
    db.query(sql, [articleId], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, articleId });
    });
}
// 获取点赞列表
exports.getLlikes=(req, res) => {
    const sql = 'SELECT * FROM likes';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
}
// 发布收藏
exports.publishCollect=(req, res) => {
    const { articleId } = req.body;
    const sql = 'INSERT INTO collects (articleId) VALUES (?)';
    db.query(sql, [articleId], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, articleId });
    })
}
// 获取收藏列表
exports.getLcollects=(req, res) => {
    const sql = 'SELECT * FROM collects';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
}