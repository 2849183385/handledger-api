const express = require('express');
//创建路由对象
const router = express.Router();

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user');

//注册新用户
router.post('/register', (req, res) => {
    res.send({code: 200, msg: '注册成功'})
})
   
//登录
router.post('/login', (req, res) => {
    res.send({code: 200, msg: '登录成功'})
})

//把路由共享出去
module.exports = router;