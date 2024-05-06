const express = require('express');
const router = express.Router();
const ledger_Handler = require('../router_handler/ledger');

//获取文章列表
router.get('/getLedgerList', ledger_Handler.getLedgerList);

//文章
router.get('/getLedger', ledger_Handler.getLedger);
router.post('/publishLedger', ledger_Handler.publishLedger)
//评论
router.get('/getComments', ledger_Handler.getComments)
router.post('/publishComment', ledger_Handler.publishComment)
router.get('/getLatestComment', ledger_Handler.getLatestComment)
//回复
router.get('/getReply', ledger_Handler.getReply)
router.post('/publishReply', ledger_Handler.publishReply)
router.get('/getLatestReply', ledger_Handler.getLatestReply)
//点赞
router.post('/publishLike', ledger_Handler.publishLike)
router.post('/cancelLikes', ledger_Handler.cancelLikes)
router.get('/getLike', ledger_Handler.getLike)
router.get('/getlikesList', ledger_Handler.getLikesList)
//收藏
router.post('/publishFavorite', ledger_Handler.publishFavorite)
router.post('/cancelFavorite', ledger_Handler.cancelFavorite)
router.get('/getFavoritesList', ledger_Handler.getFavoritesList)
//删除
router.post('/deleteLedger', ledger_Handler.deleteLedger)
router.post('/deleteComment', ledger_Handler.deleteComment)

// //回复·点赞
// router.get('/getReplyLikes', ledger_Handler.getReplyLikes)
// router.post('/publishReplyLike', ledger_Handler.publishReplyLike)
module.exports = router
