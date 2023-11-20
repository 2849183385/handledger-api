// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express();

//跨域服务，导入cors中间件
const cors = require('cors')
//使用cors中间件
app.use(cors())

app.use(express.urlencoded({ extended: false }))



// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)









//启动服务器
const server=app.listen(8080, () =>{
    console.log('服务器启动成功，端口号为  http://127.0.0.1:8080')
})