const express = require('express');
const router = express.Router();
const wechatService = require('../services/wechatService');
const logger = require('../utils/logger');

router.get('/', (req, res) => {
    const { signature, timestamp, nonce, echostr } = req.query;
    if (wechatService.verifySignature(signature, timestamp, nonce)) {
        res.send(echostr);
    } else {
        res.status(401).send('验证失败');
    }
});

router.post('/', async (req, res) => {
    try {
        const message = req.body;
        await wechatService.processGroupMessage(message);
        res.send('success');
    } catch (error) {
        logger.error('处理消息失败:', error);
        res.status(500).send('处理失败');
    }
});

module.exports = router;