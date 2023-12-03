const express = require('express');
const router = express.Router();
const ledger_Handler = require('../router_handler/ledger');


router.get('/detail', ledger_Handler.getLedger);

module.exports = router
