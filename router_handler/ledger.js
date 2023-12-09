const db = require('../db/index');



// 创建文章
exports.publishLedger = (req, res) => {
    const { title, content, image_url, user_id } = req.body;
    const sql = 'INSERT INTO posts (post_title, post_content,post_image_url,post_user_id)  VALUES (?, ?, ?, ?) ';
    db.query(sql, [title, content, image_url, user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.affectedRows === 0) return res.send({ status: 1, message: '添加失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '添加成功' })
    });
};
// 获取文章详情
exports.getLedger = (req, res) => {
    const post_id = req.query.id
    const sql = `select * from posts where post_id= ?`
    //一次返回这个作品所有数据，有数据冗余
    /*  const sql = `SELECT  p.*, c.*, r.*,
                  postUser.user_pic AS post_user_pic,postUser.user_id AS post_user_id,postUser.nick_name AS post_nick_name,
                  commentUser.user_pic AS comment_user_pic,commentUser.user_id AS comment_user_id,commentUser.nick_name AS comment_nick_name,  const sql = `SELECT  p.*, c.*, r.*,
                  postUser.user_pic AS post_user_pic,postUser.user_id AS post_user_id,postUser.nick_name AS post_nick_name,
                  commentUser.user_pic AS comment_user_pic,commentUser.user_id AS comment_user_id,commentUser.nick_name AS comment_nick_name,
                  replyUser.user_pic AS reply_user_pic,replyUser.user_id AS reply_user_id,replyUser.nick_name AS reply_nick_name
                  FROM 
                      posts p 
                  LEFT JOIN 
                   -- 加入评论表，查询评论表中的作品ID和作品表中的作品ID相等的数据(获取发布的评论数据)
                   comments c ON p.post_id = c.comment_post_id
                   LEFT JOIN 
                   -- 加入用户表，查询作品表中发布作品用户ID与用户表中ID相同数据(查询发布作品的用户数据)
                   users postUser ON p.post_user_id = postUser.user_id
                   LEFT JOIN 
                   -- 加入用户表，查询评论表中评论用户ID与用户表中ID相同数据(查询发表评论的用户数据)
                   users commentUser ON c.comment_user_id = commentUser.user_id 
                   LEFT JOIN 
                   -- 加入回复表，查询评论表中评论ID与回复表里面的评论ID相同数据（获取回复评论的内容）
                   replies r ON c.comment_id=r.reply_comment_id
                   LEFT JOIN
                   -- 加入用户表，查询回复表中回复用户ID与用户表中ID相同数据(查询回复评论的用户数据)
                   users replyUser ON r.reply_user_id=replyUser.user_id
                   WHERE 
                   p.post_id = 19 `*/
    db.query(sql, post_id, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '查询任务信息失败，请稍后再试' })
        // 查询成功
        // res.send({ status: 0, message: '查询任务信息成功', data: result })
        const user_id = result[0].post_user_id
        const sql1 = `SELECT users.user_id, users.nick_name, users.user_pic
                        FROM users where user_id =? `;
        //查询作品用户数据
        db.query(sql1, user_id, (err, result1) => {
            if (err) {
                // 执行sql语句失败
                return res.send({ status: 1, message: err.message })
            }
            //执行sql语句成功
            // 返回任务列表
            if (result1.length === 0) return res.send()
            res.send({ status: 0, message: '查询任务信息成功', data: { postInfo: result, userInfo: result1 } })
        })
    })
}

// 发布评论
exports.publishComment = (req, res) => {
    const { content, post_id, user_id } = req.body;
    const sql = 'INSERT INTO comments (comment_content, comment_post_id ,comment_user_id) VALUES (?, ?, ?)';
    db.query(sql, [content, post_id, user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.affectedRows === 0) return res.send({ status: 1, message: '添加失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '添加成功' })
    });
};
// 获取评论列表
exports.getComments = (req, res) => {
    const comment_post_id = req.query.id
   
    const sql = `SELECT c.* , u.user_id ,u.user_pic,u.nick_name,u.account,
                        (SELECT COUNT(*) FROM replies WHERE reply_comment_id = c.comment_id) AS reply_count
                FROM
                    comments c
                left JOIN
                    users u ON c.comment_user_id = u.user_id
                where
                c.comment_post_id =?`;
    
    db.query(sql, comment_post_id, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '查询任务信息为空，请稍后再试',data:result })
        // 查询成功
      res.send({ status: 0, message: '查询任务信息成功', data: result })
    });
    
};

//发表回复
exports.publishReply = (req, res) => {
    
    const { content, comment_id, user_id,reply_user_id } = req.body;
    const sql = 'INSERT INTO replies (reply_content, reply_comment_id,reply_user_id,replied_user_id) VALUES (?,?,?,?)';
    db.query(sql, [content, comment_id, user_id,reply_user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.affectedRows === 0) return res.send({ status: 1, message: '添加失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '添加成功' })
    })
}
// 获取回复列表
exports.getReply = (req, res) => {
    const {id, limit } = req.query;
    // const offset = req.query.offset; 
    const sql = `SELECT r.*,u.user_pic,u.nick_name,u.account,
                        u2.nick_name AS replied_user_nick_name,
                        (SELECT COUNT(*) FROM replies WHERE reply_comment_id = ?) AS reply_count
                FROM 
	                replies r
                LEFT JOIN 
                    users u ON u.user_id=r.reply_user_id
                LEft JOIN
                    users u2 ON u2.user_id=r.replied_user_id
                where 
	                r.reply_comment_id=?
                limit ? `;
    db.query(sql, [id,id, parseInt(limit)], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        // if (result.length === 0) return res.send({ status: 0, message: '该评论没有回复' })
        // 查询成功
        res.send({ status: 0, message: '查询任务信息成功', data: result })
    })
}

// 发布点赞
exports.publishLike = (req, res) => {
    const { id, user_id, method } = req.body;
    let sql = "";
    let sql1 = "";
    switch (method) {
        case 'comment':
            sql = `INSERT INTO comment_likes (comment_id, user_id) VALUES (?,?)`
            sql1 = `INSERT INTO likes (user_id, comment_id) VALUES (?,?) `;
            // 执行commentSql
            break;
        case 'post':
            sql = `INSERT INTO post_likes (post_id, user_id) VALUES (?,?)`
            sql1 = `INSERT INTO likes (user_id, post_id) VALUES (?,?) `;
            // 执行postSql
            break;
        case 'reply':
            sql = `INSERT INTO reply_likes (reply_id, user_id) VALUES (?,?) `
            sql1 = ` INSERT INTO likes (user_id, reply_id) VALUES (?,?) `;
            // 执行userSql
            break;
        // case 'reply_id':
        //     sql = `INSERT INTO likes (reply_id, counts) VALUES (?,?) 1`;
        //     // 执行replySql
        //     break;
        default:
        // 处理未知的字段名
    }
    // sql = `INSERT INTO comment_likes (comment_id, user_id) VALUES (?,?)`;
    db.query(sql, [id, user_id, id, user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message, data: [id, user_id, sql] })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.affectedRows === 0) return res.send({ status: 1, message: '添加失败，请稍后再试' })
        // const res1 = result
        // 查询成功
        db.query(sql1, [user_id, id], (err, result) => {
            if (err) {
                // 执行sql语句失败
                return res.send({ status: 1, message: err.message })
            }
            //执行sql语句成功
            // 返回任务列表
            if (result.affectedRows === 0) res.send({ status: 1, message: '添加失败，请稍后再试' })
            res.send({ status: 0, message: '添加成功' })
        });
    })
}
// 获取点赞列表
exports.getLikes = (req, res) => {
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
exports.publishFavorites = (req, res) => {
    const { post_id, user_id } = req.body;
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
exports.getFavorites = (req, res) => {
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

//回复的点赞
exports.publishReplyLike = (req, res) => {
    const { reply_id, user_id } = req.body;
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
exports.getReplyLikes = (req, res) => {
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