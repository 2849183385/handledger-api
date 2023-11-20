// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express();

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

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)



app.get('/', (req, res) => {
    res.send('Hello, World!');
});

//启动服务器
const server=app.listen(8080, () =>{
    console.log('api server running at http://127.0.0.1:8080')
})