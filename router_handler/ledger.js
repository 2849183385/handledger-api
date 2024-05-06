const { query } = require('express');
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
        res.send({ status: 0, message: '添加成功'  })
    });
};
// 获取文章详情
exports.getLedger = (req, res) => {
    const post_id = req.query.id
    const sql = `select * ,(select count(*) from comments where comment_post_id=? and comment_status=0) as comment_count from posts where post_id= ? `
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
    db.query(sql, [post_id,post_id], (err, result) => {
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
            res.send({ status: 0, message: '查询任务信息成功', data: { article: { ...result[0], ...result1[0] } } })
        })
    })
}

//获取文章列表
exports.getLedgerList = (req, res) => {
    const { limit ,offset} = req.query;
    const sql = `SELECT * from posts where post_status = 0 order by post_likes_count desc limit ? offset ?`
    db.query(sql, [parseInt(limit), parseInt(offset)],(err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '查询任务信息失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '查询任务信息成功', data: result })
        // res.send({ status: 0, message: '查询任务信息成功', data: { article: {...result[0],...result1[0] } } })
    })
}
                  
//删除文章
exports.deleteLedger = (req, res) => {
    const { post_id } = req.body;
    const sql = 'UPDATE posts SET post_status = 1 WHERE post_id=?';
    db.query(sql, post_id, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        if (result.affectedRows === 0) return res.send({ status: 1, message: '删除失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '删除成功' })

    });
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
//获取最新评论
exports.getLatestComment = (req, res) => {
    const sql = `SELECT c.* , u.user_id ,u.user_pic,u.nick_name,u.account
                FROM 
                    comments c
                LEFT JOIN 
                    users u ON u.user_id = c.comment_user_id
                WHERE 
                    comment_created_time >= (NOW() - INTERVAL 1 MINUTE) and comment_post_id =?  and comment_status=0
                ORDER BY 
                    comment_created_time 
                DESC `;
    db.query(sql, [req.query.post_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 204, message: '查询任务信息失败，请稍后再试' })
        // 查询成功
        res.send({ status: 0, message: '查询任务信息成功', data: result })
    })
}
// 获取评论列表
exports.getComments = (req, res) => {
    const comment_post_id = req.query.id
    const limit = req.query.limit
    const offset = req.query.offset
    const sql = `SELECT c.* , u.user_id ,u.user_pic,u.nick_name,
                        (SELECT COUNT(*) FROM replies WHERE reply_comment_id = c.comment_id and reply_status=0) AS reply_count
                FROM
                    comments c
                left JOIN
                    users u ON c.comment_user_id = u.user_id
                where
                c.comment_post_id =? and comment_status=0
                limit ? offset ?`;
    //获取评论时间在最近五分钟的评论，和评论中点赞最多的评论
    //     (SELECT * FROM comments
    // WHERE comment_created_time >= (NOW() - INTERVAL 5 MINUTE)
    // ORDER BY comment_created_time DESC
    // LIMIT 1)
    //     UNION
    //         (SELECT * FROM comments
    // WHERE comment_created_time < (NOW() - INTERVAL 5 MINUTE)
    // ORDER BY comment_likes_count DESC
    // LIMIT 4);
    db.query(sql, [comment_post_id, parseInt(limit), parseInt(offset)], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        // if (result.length === 0) return res.send({ status: 1, message: '查询任务信息为空，请稍后再试', data: result })
        // 查询成功
        res.send({ status: 200, message: '查询任务信息成功', data: result })
    });

};
//删除评论
exports.deleteComment = (req, res) => {
    const { comment_id, method, reply_id } = req.body;
    let id = reply_id || comment_id
    let sql = ''
    let sql1 = ''
    switch (method) {
        case 'comment':
            sql = `update comments set comment_status=1 where comment_id=?`;
            sql1 = 'update replies set reply_status = 1 where reply_comment_id=?'
            db.query(sql, [id], (err, result) => {
                if (err) {
                    return res.send({ status: 1, message: err.message })
                }
                if (result.affectedRows === 0) return res.send({ status: 1, message: '删除失败，请稍后重试',data1:result })
                    db.query(sql1, [id], (err, result) => {
                        if (err) {
                            return res.send({ status: 1, message: err.message })
                        }
                        res.send({ status: 0, message: '删除成功' })
                    })
            })
            break;
        case 'reply':
            sql = `update replies set reply_status=1 where reply_id=?`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    return res.send({ status: 1, message: err.message })
                }
                if (result.affectedRows === 0) return res.send({ status: 1, message: '删除失败，请稍后重试' })
                res.send({ status: 0, message: '删除成功' })
            })
            break;
        default:
    }
    // res.send({ status: 0, message: '删除成功' })
   
}


//发表回复
exports.publishReply = (req, res) => {

    const { content, comment_id, user_id, reply_user_id, post_id } = req.body;
    const sql = 'INSERT INTO replies (reply_content, reply_comment_id,reply_user_id,replied_user_id,reply_post_id) VALUES (?,?,?,?,?)';
    db.query(sql, [content, comment_id, user_id, reply_user_id, post_id], (err, result) => {
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
//获取最新回复
exports.getLatestReply = (req, res) => {
    const sql = `SELECT r.*, u.user_id,u.user_pic,u.nick_name,u.account,
                        u2.nick_name AS replied_user_nick_name,
                        (SELECT COUNT(*) FROM replies WHERE reply_comment_id = ? and reply_status=0) AS reply_count
                        FROM 
	                    replies r
                LEFT JOIN 
                    users u ON u.user_id=r.reply_user_id
                LEft JOIN
                    users u2 ON u2.user_id=r.replied_user_id
                where 
	                r.reply_created_time >= (NOW() - INTERVAL 5 MINUTE) and  r.reply_comment_id=? and reply_status=0
                ORDER BY
                    r.reply_created_time
                DESC`;
    db.query(sql, [req.query.comment_id, req.query.comment_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 204, message: '查询任务信息为空' })
        res.send({ status: 0, message: '查询任务信息成功', data: result })
    })
}
// 获取回复列表
exports.getReply = (req, res) => {
    const { comment_id, limit, offset } = req.query;
    // const offset = req.query.offset; 
    const sql = `SELECT r.*,u.user_pic,u.nick_name,u.account,
                        u2.nick_name AS replied_user_nick_name
                FROM 
	                replies r
                LEFT JOIN 
                    users u ON u.user_id=r.reply_user_id 
                LEft JOIN
                    users u2 ON u2.user_id=r.replied_user_id
                where 
	                r.reply_comment_id=? and reply_status=0
                limit ? offset ?`;
    db.query(sql, [comment_id, parseInt(limit), parseInt(offset)], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 0, message: '该评论没有回复' })
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
        default:
        // 处理未知的字段名
    }
    // sql = `INSERT INTO comment_likes (comment_id, user_id) VALUES (?,?)`;
    db.query(sql, [id, user_id], (err, result) => {
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
//取消点赞
exports.cancelLikes = async (req, res) => {
    try {
        const { id, user_id, method } = req.body;
        let sql = "";
        let sql1 = "";
        switch (method) {
            case 'comment':
                sql = `delete from comment_likes where user_id=? and comment_id =?`
                sql1 = `delete from likes where user_id=? and comment_id =?`
                // 执行commentSql
                break;
            case 'post':
                sql = `delete from post_likes where user_id=? and post_id =?`
                sql1 = `delete from likes where user_id=? and post_id =? `
                // 执行postSql
                break;
            case 'reply':
                sql = `delete from reply_likes where user_id=? and reply_id =?`
                sql1 = `delete from likes where user_id=? and reply_id =? `
                // 执行userSql
                break;
            default:
        }
        db.query(sql, [user_id, id], (err, result) => {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            if (result.affectedRows === 0) return res.send({ status: 1, message: '取消失败，请稍后再试', data: result })
            db.query(sql1, [user_id, id], (err, result) => {
                if (err) {
                    return res.send({ status: 1, message: err.message })
                }
                if (result.affectedRows === 0) res.send({ status: 1, message: '取消失败，请稍后再试' })
                res.send({ status: 0, message: '取消成功' })
            });
        });
    }
    catch (err) {
        res.send({ status: 1, message: err.message });
    }
}

//获取点赞详情
exports.getLike = (req, res) => {
    const { id, method } = req.query;
    let sql = "";
    switch (method) {
        case 'comment':
            sql = `SELECT comment_likes_count FROM comments WHERE comment_id =?`;
            // 执行commentSql
            break;
        case 'post':
            sql = `SELECT post_likes_count FROM posts WHERE post_id =?`;
            // 执行postSql
            break;
        case 'reply':
            sql = `SELECT reply_likes_count FROM replies WHERE reply_id =?`;
            // 执行userSql
            break;
        default:
    }
    db.query(sql, [id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.length === 0) return res.send({ status: 1, message: '查询为空' })
        // 查询成功
        res.send({ status: 0, message: '查询任务信息成功', data: result[0] })
    })
}

//获取用户点赞作品列表
exports.getLikesList = (req,res) => {
    const { user_id,limit,offset } = req.query;
    const sql = `SELECT posts.*
                FROM 
                    posts
                INNER JOIN 
                    likes ON likes.post_id =posts.post_id
                WHERE
                    likes.user_id = ?
                    limit ? offset ?`;
    db.query(sql, [user_id, parseInt(limit), parseInt(offset)], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        if (result.length === 0) return res.send({ status: 0, message: '收藏为空' })
        res.send({ status: 0, message: '查询点赞列表成功', data: result})
    })
}

// 发布收藏
exports.publishFavorite = (req, res) => {
    const { post_id, user_id } = req.body;
    const sql = 'INSERT INTO Favorites ( post_id,user_id) VALUES (?,?)';
    const sql1 = 'select count(*) as favorites_count from Favorites where post_id=?'
    db.query(sql, [post_id, user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表
        if (result.affectedRows === 0) return res.send({ status: 1, message: '收藏失败，请稍后再试' })
        // 查询成功
        db.query(sql1, [post_id], (err, result) => {
            if (err) {
                // 执行sql语句失败
                return res.send({ status: 1, message: err.message })
            }
            //执行sql语句成功
            // 返回任务列表
            if (result[0].count === 0) return res.send({ status: 1, message: '收藏失败，请稍后再试' })
            res.send({ status: 0, message: '收藏成功', data: result[0] })
        })
    })
}

//删除收藏
exports.cancelFavorite = (req, res) => {
    const { post_id, user_id } = req.body;
    const sql = 'delete from Favorites where post_id=? and user_id=?';
    const sql1 = 'select count(*) as favorites_count from Favorites where post_id=?'
    db.query(sql, [post_id, user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        if (result.affectedRows === 0) return res.send({ status: 1, message: '查询为空' })
        db.query(sql1, [post_id], (err, result) => {
            if (err) {
                // 执行sql语句失败
                return res.send({ status: 1, message: err.message })
            }
            //执行sql语句成功
            // 返回任务列表
            if (result[0].count === 0) return res.send({ status: 1, message: '查询为空' })
            res.send({ status: 0, message: '取消成功', data:result[0]})
        })
    })

}

//获取收藏列表
exports.getFavoritesList = (req, res) => {
    const { user_id } = req.query;
    const sql =`SELECT *
                FROM 
                    posts
                INNER JOIN 
                    favorites ON posts.post_id = favorites.post_id
                WHERE
                    favorites.user_id = ?`;
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        if (result.length === 0) return res.send({ status: 0, message: '收藏为空' })
        res.send({ status: 0, message: '查询收藏成功', data: result })
    })
}