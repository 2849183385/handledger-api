const express = require('express');
const router = express.Router();
const ledger_Handler = require('../router_handler/ledger');

//文章
router.get('/getLedger', ledger_Handler.getLedger);
router.post('/publishLedger', ledger_Handler.publishLedger)
//评论
router.get('/getComments', ledger_Handler.getComments)
router.post('/publishComment', ledger_Handler.publishComment)
//点赞
router.get('/getLikes', ledger_Handler.getLikes)
router.post('/publishLike', ledger_Handler.publishLike)
//收藏
router.get('/getFavorites', ledger_Handler.getFavorites)
router.post('/publishFavorites', ledger_Handler.publishFavorites)
//回复
router.get('/getReply', ledger_Handler.getReply)
router.post('/publishReply', ledger_Handler.publishReply)

//回复·点赞
router.get('/getReplyLikes', ledger_Handler.getReplyLikes)
router.post('/publishReplyLike', ledger_Handler.publishReplyLike)
module.exports = router
