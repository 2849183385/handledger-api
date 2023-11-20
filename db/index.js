const mysql = require('mysql');

// 连接数据库
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    port: 3307,
    password: 'admin123',
    database: 'handleledger'
});

module.exports = db