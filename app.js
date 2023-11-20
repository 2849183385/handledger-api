// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express();
// 导入 joi 模块
const joi = require('joi')

//跨域服务，导入cors中间件
const cors = require('cors')
//使用cors中间件
app.use(cors())

app.use(express.urlencoded({ extended: false }))

// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
    // status 默认值为 1，表示失败的情况
    // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
    // @ts-ignore
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

// 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({
    path: [/^\/api\//]
}))


app.get('/', (req, res) => {
    res.send('Hello, World!');
});


// 错误中间件 在最后定义
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
})



//启动服务器
const server=app.listen(8080, function(){
    console.log('api server running at http://127.0.0.1:8080')
})