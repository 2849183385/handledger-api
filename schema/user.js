const joi = require('joi')

/**
* string() 值必须是字符串
* alphanum() 值只能是包含 a-zA-Z0-9 的字符串
* min(length) 最小长度
* max(length) 最大长度
* required() 值是必填项，不能为 undefined
* pattern(正则表达式) 值必须符合正则表达式的规则
*/

// 用户名的验证规则
const acount = joi.string().min(1).max(10).required()
// 密码的验证规则
const password = joi
    .string()
    .pattern(/^[\S]{6,12}$/)
    .required()
const newPassword = joi
   .string()
   .pattern(/^[\S]{6,12}$/)
    .required()
       

// 定义 id, nickname, email 的验证规则
const id = joi.number().integer().min(1).required()
//

// 昵称不能为空字符串，长度不超过指定的最大长度
const nick_name = joi.string()
// 输入的字符串是一个合法的电子邮件地址，并且不能为空。
const user_email = joi.string().email()

// 定义验证 avatar 头像的验证规则
const user_pic = joi.string()
const gender = joi.string().valid('0', '1').required()
const user_tel = joi.string().min(11).max(11)
const user_region = joi.string()
const user_brithday = joi.date()
// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body: {
        acount,
        password,
    },
}

// 验证规则对象 - 更新用户基本信息
exports.update_userinfo_schema = {
    // 需要对 req.body 里面的数据进行验证
    body: {
        acount,
        nick_name,
        user_email ,
        user_pic,
        user_sex:gender,
        user_brithday,
        user_tel,
        user_region
    },
}


// 验证规则对象 - 更新用户密码
exports.update_password_schema = {
    // 需要对 req.body 里面的数据进行验证
    body: {
        acount,
        password,
        newPassword,
    },
}
