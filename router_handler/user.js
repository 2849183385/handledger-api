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
    const sqlStr = 'select * from users where account =?'
    db.query(sqlStr, [userInfo.account], (err, result) => {
        //执行sql语句失败
        if (err) {
            return res.send({ status: 1, message: err instanceof Error ? err.message : err, })
        }
        //查询成功，判断用户是否被占用
        if (result.length > 0) {
            return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
        }
        //调用bcrypt.hashSync()模块，对密码进行加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        //定义sql语句，插入用户信息
        const sql = 'insert into users set?'
        db.query(sql, userInfo, (err, result) => {
            //执行sql语句失败
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            //判断插入后影响的行数是否为1
            if (result.affectedRows !== 1) return res.send('注册用户失败，请稍后再试！')
            //插入成功
             res.send( {status: 0, message: '注册成功'} )
        })
    })
}
// 登录的处理函数
exports.login = (req, res) => {
    // res.send('登录')
    // 接收表单的数据
    const userinfo = req.body
    // res.send(req.params,req.body,req.query)
    // 定义 SQL 语句
    const sql = `select * from users where account=?`
    db.query(sql, userinfo.account, (err, result) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        // 查询成功，判断用户是否存在
        if (result.length === 0) return res.send({ status: 1, message: '用户不存在，请先注册！' })
        // 调用 bcrypt.compareSync() 方法，对用户输入的密码进行加密，并与数据库中的密码进行比较
        const isMatch = bcrypt.compareSync(userinfo.password, result[0].password)
        // 密码匹配失败
        if (!isMatch) return res.send('密码错误，请重新输入！')
        // 密码匹配成功
        // 在生成Token 之前，剔除头像和密码的值
        const user = { ...result[0], password: '', user_pic: '' }
        //生成Token
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn, // token 有效期为 10 个小时
        })
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr,
            // data:result
        })

    })
        
    }



