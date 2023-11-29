const express = require('express')
const router = express.Router()
const { update_userinfo_schema, update_password_schema } = require('../schema/user')
// 挂载路由

// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userInfo')
const expressJoi = require('@escook/express-joi')

router.get('/getUserInfo', userinfo_handler.getUserInfo)

// 修改密码
router.put('/updatePassword', expressJoi(update_password_schema),userinfo_handler.updatePassword)
// 修改头像
router.post('/updateAvatar', userinfo_handler.updateAvatar)
// 修改个人信息
router.put('/updateUserInfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)


module.exports = router