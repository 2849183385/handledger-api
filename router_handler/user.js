// 引入数据库模块
const db = require('../db/index')
// 引入 bcrypt 模块，用于对密码进行加密
const bcrypt = require('bcryptjs')

/**
* 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
*/
// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userInfo = req.body
    // 对表单中的数据，进行合法性的校验
    // if (!userinfo.username || !userinfo.password) {
    //   return res.send({ status: 1, message: '用户名或密码不合法！' })
    // }

    //定义sql语句，查询用户是否被占用
    const sqlStr = 'select * from user where username =?'
    db.query(sqlStr, [userInfo.username], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.cc({ status: 1, message: err.message })
        }
        //查询成功，判断用户是否被占用
        if (result.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        //调用bcrypt.hashSync()模块，对密码进行加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        //定义sql语句，插入用户信息
        const sql = 'insert into user set?'
        db.query(sql, userInfo, (err, result) => {
            //执行sql语句失败
            if (err) {
                return res.cc({ status: 1, message: err.message })
            }
            //判断插入后影响的行数是否为1
            if (result.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
            //插入成功
             res.cc({ status: 0, message: '注册成功' })
        })
    })
}
// 登录的处理函数
exports.login = (req, res) => {
    res.send('login OK')
}
