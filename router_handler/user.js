// 引入数据库模块
const db = require('../db/index')
// 引入 bcrypt 模块，用于对密码进行加密
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

/**
* 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
*/
// 注册用户的处理函数
exports.regUser = (req, res) => {
    // res.send('注册用户')
    // 获取客户端提交到服务器的用户信息
    const userInfo = req.body
    // 对表单中的数据，进行合法性的校验
    // if (!userinfo.username || !userinfo.password) {
    //   return res.send({ status: 1, message: '用户名或密码不合法！' })
    // }

    //定义sql语句，查询用户是否被占用
    const sqlStr = 'select * from users where acount =?'
    db.query(sqlStr, [userInfo.acount], (err, result) => {
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
        const sql = 'insert into users set?'
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
    // 接收表单的数据
    const userinfo = req.body
    // 定义 SQL 语句
    const sql = `select * from users where acount=?`
    db.query(sql, userinfo.acount, (err, result) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc({ status: 1, message: err.message })
        }
        // 查询成功，判断用户是否存在
        if (result.length === 0)   return res.cc('用户不存在，请先注册！')
        // 调用 bcrypt.compareSync() 方法，对用户输入的密码进行加密，并与数据库中的密码进行比较
        const isMatch = bcrypt.compareSync(userinfo.password, result[0].password)
        // 密码匹配失败
        if (!isMatch) return res.cc('密码错误，请重新输入！')
        // 密码匹配成功
        // 在生成Token 之前，剔除头像和密码的值
        const user = { ...result[0], password: '', user_pic: '' }
        //生成Token
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h', // token 有效期为 10 个小时
        })
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr,
        })

    })
        
    }

//更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
    const newInfo = req.body
    //定义修改用户信息的sql语句
    const sql = 'update users set nickname=?, user_gender=?, user_brithday =?, user_tel =?, user_email =? ,user_region =? where acount = ?'
    db.query(sql, [newInfo.nickname, newInfo.user_gender, newInfo.user_age, newInfo.user_tel, newInfo.user_email, newInfo.user_region, newInfo.acount], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.cc({ status: 1, message: err.message })
        }   
        //判断修改后影响的行数是否为1
        if (result.affectedRows!== 1) return res.cc('修改用户信息失败，请稍后再试！')
        //修改成功
        res.cc({ status: 0, message: '修改用户信息成功' })
    })
}

//修改密码的处理函数
exports.updatePassword = (req, res) => {
    const newInfo = req.body

    //调用bcrypt.hashSync()模块，对密码进行加密
    newInfo.newPassword = bcrypt.hashSync(newInfo.newPassword, 10)
    //定义修改密码的sql语句
    const sql = 'update users set password =? where acount =?'
    db.query(sql, [newInfo.newPassword, newInfo.acount], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.cc({ status: 1, message: err.message })
        }
        //判断修改后影响的行数是否为1
        if (result.affectedRows !== 1) return res.cc('修改密码失败，请稍后再试！')
        //修改成功
        res.cc({ status: 0, message: '修改密码成功' })
    })
}


//更换头像的处理函数
exports.updateAvatar = (req, res) => {
    const userInfo = req.body

    //定义更换头像的sql语句
    const sql = 'update users set user_pic =? where acount =?'
    db.query(sql, [userInfo.user_pic, userInfo.acount], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.cc({ status: 1, message: err.message })
        }
        //判断修改后影响的行数是否为1
        if (result.affectedRows !== 1) return res.cc('更换头像失败，请稍后再试！')
        //修改成功
        res.cc({ status: 0, message: '更换头像成功' })
    })
}



