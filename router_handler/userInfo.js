// 导入数据库操作模块
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

// // 导入用户路由处理函数模块
// const userHandler = require('../router_handler/user');

// //  导入验证表单数据的中间件
// const expressJoi = require('@escook/express-joi')
// //  导入需要的验证规则对象

//获取用户信息的处理函数
exports.getUserInfo = async (req, res) => {
    try {
        // 定义查询用户信息的sql语句
        const sql = `select users.* from users where account =? `
        const sql1 = `select  likes.post_id FROM likes WHERE likes.user_id = ?  AND likes.post_id IS NOT NULL `
        const sql2 = `select  likes.comments_id ROFM likes WHERE likes.comments_id =?  AND likes.comments_id IS NOT NULL `
        let userInfo = null
        // 执行sql语句
        userInfo = await new Promise((resolve, reject) => {
            db.query(sql, [req.query.account], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        // const postLikes = await new Promise((resolve, reject) => {
        //     db.query(sql1, [req.query.account], (err, result) => {
        //         if (err) {
        //             reject(err);
        //         } else {
        //             resolve(result);
        //         }
        //     });
        // });
        // const commentsLikes = await new Promise((resolve, reject) => {
        //     db.query(sql2, [req.query.account], (err, result) => {
        //         if (err) {
        //             reject(err);
        //         } else {
        //             resolve(result);
        //         }
        //     });
        // });
        if (userInfo.length === 0) {
            return res.send({ status: 1, message: '查询用户信息失败，请稍后再试！' });
        }
        // userInfo[0].postLikes = postLikes

        // 查询成功
        res.send({ status: 0, message: '查询用户信息成功', data: userInfo[0] });
    } catch (err) {
        res.send({ status: 1, message: err.message });
    }

}
//更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
    const newInfo = req.body
    //定义修改用户信息的sql语句
    // newInfo.user_region = JSON.stringify(newInfo.user_region)
    const sql = 'update users set nick_name=?, user_sex=?, user_brithday =?, user_tel =?, user_email =? ,user_region =?,user_motto=? where account = ?'
    db.query(sql, [newInfo.nick_name, newInfo.user_sex, newInfo.user_brithday, newInfo.user_tel, newInfo.user_email, newInfo.user_region, newInfo.user_motto, newInfo.account], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        //判断修改后影响的行数是否为1
        if (result.affectedRows === 0) return res.send({ status: 1, message: '修改用户信息失败，请稍后再试！', data: result })
        //修改成功
        res.send({ status: 0, message: '修改用户信息成功', data: newInfo })
    })
}
//修改密码的处理函数
exports.updatePassword = (req, res) => {
    const newInfo = req.body

    //调用bcrypt.hashSync()模块，对密码进行加密
    newInfo.newPassword = bcrypt.hashSync(newInfo.newPassword, 10)
    //定义修改密码的sql语句
    const sql = 'update users set password =? where account =?'
    db.query(sql, [newInfo.newPassword, newInfo.account], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        //判断修改后影响的行数是否为1
        if (result.affectedRows !== 1) return res.send({ status: 1, message: '修改密码失败，请稍后再试！' })
        //修改成功
        res.send({ status: 0, message: '修改密码成功' })
    })
}
//更换头像的处理函数
exports.updateAvatar = (req, res) => {
    const userInfo = req.body
    //定义更换头像的sql语句
    const sql = 'update users set user_pic =? where user_id =?'
    db.query(sql, [userInfo.user_pic, userInfo.user_id], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.send({ status: 1, message: err instanceof Error ? err.message : err })
        }
        //判断修改后影响的行数是否为1
        if (result.affectedRows !== 1) return res.send({ status: 1, message: '更换失败，请稍后再试！' })
        //修改成功
        res.send({ status: 0, message: '更换头像成功' })
    })
}

//获取点赞列表
exports.getLikes = async (req, res) => {
    try {
        const post = `select DISTINCT likes.post_id FROM likes WHERE likes.user_id =?  AND likes.post_id IS NOT NULL `
        const comment = `select DISTINCT likes.comment_id From likes WHERE likes.user_id =?  AND likes.comment_id IS NOT NULL `
        const reply = `select DISTINCT likes.reply_id from likes WHERE likes.user_id =?  AND likes.reply_id IS NOT NULL `
        const postRes = await new Promise((resolve, reject) => {
            db.query(post, [req.query.user_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
        const commentRes = await new Promise((resolve, reject) => {
            db.query(comment, [req.query.user_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
        const replyRes = await new Promise((resolve, reject) => {
            db.query(reply, [req.query.user_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
        const postid = postRes.map(item => item.post_id)
        const commentid = commentRes.map(item => item.comment_id)
        const replyid = replyRes.map(item => item.reply_id)
        // if (postLikes.length === 0 && commentLikes.length === 0 && replyLikes.length === 0) {
        //     return res.send({ status: 1, message: '查询用户信息失败，请稍后再试！' });
        // }
        res.send({ status: 0, message: '查询点赞信息成功', data: { postid, commentid, replyid } })
    }
    catch (err) {
        res.send({ status: 1, message: err.message });
    }
}

// 获取收藏列表
exports.getFavorites = (req, res) => {
    const sql = 'SELECT DISTINCT post_id FROM Favorites where user_id =?';
    db.query(sql, req.query.user_id, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        // 返回任务列表

        // 查询成功
        result = result.map(item => item.post_id)
        res.send({ status: 0, message: '查询任务信息成功', data: result })
    });
}

//获取用户作品
exports.getPosts = (req, res) => {
    const sql = 'SELECT * FROM posts where post_user_id =?';
    db.query(sql, req.query.user_id, (err, result) => {
        if (err) {
            // 执行sql语句失败
            return res.send({ status: 1, message: err.message })
        }
        //执行sql语句成功
        if (result.length === 0) return res.send({ status: 0, message: '查询到的作品为空' })
        // 查询成功
        res.send({ status: 0, message: '查询作品信息成功', data: result })
    });
}

