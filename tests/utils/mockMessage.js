const crypto = require('crypto');
const config = require('../../src/config/config');

function generateMockMessage(type = 'text', content = '测试消息') {
    return {
        FromUserName: config.targetGroups[0],
        Content: content,
        MsgType: type,
        MsgId: Date.now().toString(),
        CreateTime: Math.floor(Date.now() / 1000),
        ActualSender: 'user_' + Math.random().toString(36).substr(2, 9)
    };
}

function generateSignature(timestamp, nonce) {
    const token = config.wechat.token;
    const tmpArr = [token, timestamp, nonce].sort();
    const tmpStr = tmpArr.join('');
    return crypto.createHash('sha1').update(tmpStr).digest('hex');
}

module.exports = {
    generateMockMessage,
    generateSignature
};