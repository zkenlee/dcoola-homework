const WechatService = require('../src/services/wechatService');
const Chat = require('../src/models/chatModel');
const config = require('../src/config/config');

describe('WechatService 测试', () => {
    // 签名验证测试
    test('验证签名', () => {
        const mockSignature = '1234567890';
        const mockTimestamp = '1234567890';
        const mockNonce = 'noncestr';
        
        const result = WechatService.verifySignature(mockSignature, mockTimestamp, mockNonce);
        expect(result).toBeDefined();
    });

    // 目标群检测测试
    test('检查目标群消息', () => {
        const mockMessage = {
            FromUserName: config.targetGroups[0]
        };
        
        const result = WechatService.isTargetGroup(mockMessage);
        expect(result).toBe(true);
    });

    // 消息处理测试
    test('处理群消息', async () => {
        const mockMessage = {
            FromUserName: config.targetGroups[0],
            Content: '测试消息',
            MsgId: '123456',
            CreateTime: Date.now(),
            MsgType: 'text'
        };
        
        await WechatService.processGroupMessage(mockMessage);
        const savedMessage = await Chat.findOne({ 'metadata.msgId': mockMessage.MsgId });
        expect(savedMessage).toBeTruthy();
    });
});