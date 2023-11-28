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
exports.getUserInfo = (req, res) => {
    // res.cc({ status: 0, message: '查询用户信息成功', data: req.query.acount })
    // 定义查询用户信息的sql语句
    const sql = 'select user_id,account,nick_name,user_pic,user_email,user_sex,user_region,user_tel,user_brithday,user_motto from users where account =?'
    // 执行sql语句
    db.query(sql, [req.query.account], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.cc({ status: 1, message: err.message })
            //执行sql语句成功
        }
        if (result.length === 0) return res.cc('查询用户信息失败，请稍后再试！')
        //查询成功
        res.send({ status: 0, message: '查询用户信息成功', data: result[0] })

    })
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
        if (result.affectedRows === 0) return res.send({status:1,message:'修改用户信息失败，请稍后再试！',data:result})
        //修改成功
        res.send({ status: 0, message: '修改用户信息成功', data: newInfo})
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
            return res.cc({ status: 1, message: err.message })
        }
        //判断修改后影响的行数是否为1
        if (result.affectedRows !== 1) return res.cc('修改密码失败，请稍后再试！')
        //修改成功
        res.send({ status: 0, message: '修改密码成功' })
    })
}
//更换头像的处理函数
exports.updateAvatar = (req, res) => {
    const userInfo = req.body

    //定义更换头像的sql语句
    const sql = 'update users set user_pic =? where account =?'
    db.query(sql, [userInfo.user_pic, userInfo.account], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.cc({ status: 1, message: err instanceof Error ? err.message : err })
        }
        //判断修改后影响的行数是否为1
        if (result.affectedRows !== 1) return res.cc('更换头像失败，请稍后再试！')
        //修改成功
        res.cc({ status: 0, message: '更换头像成功' })
    })
}

