const express = require('express')
const router = express.Router()

// 挂载路由

// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userInfo')

router.get('/getUserInfo', userinfo_handler.getUserInfo)

// 修改密码
router.put('/updatePassword', userinfo_handler.updatePassword)
// 修改头像
router.put('/updateAvatar', userinfo_handler.updateAvatar)
// 修改个人信息
router.put('/updateUserInfo', userinfo_handler.updateUserInfo)


module.exports = router