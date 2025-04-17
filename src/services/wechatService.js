const crypto = require('crypto');
const config = require('../config/config');
const Chat = require('../models/chatModel');
const logger = require('../utils/logger');

class WechatService {
    verifySignature(signature, timestamp, nonce) {
        try {
            if (!signature || !timestamp || !nonce) {
                logger.warn('验证参数不完整');
                return false;
            }

            const token = config.wechat.token;
            const tmpArr = [token, timestamp, nonce].sort();
            const tmpStr = tmpArr.join('');
            const hash = crypto.createHash('sha1').update(tmpStr).digest('hex');
            
            const isValid = hash === signature;
            if (!isValid) {
                logger.warn('签名验证失败');
            }
            return isValid;
        } catch (error) {
            logger.error('签名验证过程出错:', error);
            return false;
        }
    }

    isTargetGroup(message) {
        try {
            if (!message || !message.FromUserName) {
                logger.warn('消息格式不正确');
                return false;
            }

            const isTarget = config.targetGroups.includes(message.FromUserName);
            if (!isTarget) {
                logger.debug(`非目标群消息: ${message.FromUserName}`);
            }
            return isTarget;
        } catch (error) {
            logger.error('检查目标群过程出错:', error);
            return false;
        }
    }

    async processGroupMessage(message) {
        try {
            if (!this.validateMessage(message)) {
                return;
            }

            if (!this.isWithinCollectionTime()) {
                logger.debug('不在收集时间范围内');
                return;
            }

            const chatData = {
                groupId: message.FromUserName,
                userId: message.ActualSender || message.FromUserName, // 添加实际发送者ID
                content: this.sanitizeContent(message.Content),
                type: this.getMessageType(message),
                timestamp: new Date(),
                metadata: {
                    msgId: message.MsgId,
                    createTime: message.CreateTime
                }
            };

            // 检查重复消息
            const existingMessage = await this.checkDuplicateMessage(chatData.metadata.msgId);
            if (existingMessage) {
                logger.warn('重复消息，已跳过');
                return;
            }

            const chat = new Chat(chatData);
            await chat.save();
            logger.info('保存群消息成功:', {
                groupId: chatData.groupId,
                userId: chatData.userId,
                type: chatData.type
            });
        } catch (error) {
            logger.error('处理群消息失败:', error);
            throw error;
        }
    }

    validateMessage(message) {
        if (!message || !message.Content || !message.FromUserName || !message.MsgId) {
            logger.warn('消息格式验证失败');
            return false;
        }
        return true;
    }

    sanitizeContent(content) {
        if (!content) return '';
        // 移除可能的危险字符
        return content.toString().replace(/[<>]/g, '');
    }

    async checkDuplicateMessage(msgId) {
        return await Chat.findOne({ 'metadata.msgId': msgId });
    }

    isWithinCollectionTime() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const [startHour, startMin] = config.collection.startTime.split(':').map(Number);
        const [endHour, endMin] = config.collection.endTime.split(':').map(Number);
        
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;
        
        return currentTime >= startTime && currentTime <= endTime;
    }

    getMessageType(message) {
        // 根据微信消息类型映射到我们的类型
        const typeMap = {
            text: 'text',
            image: 'image',
            voice: 'voice',
            video: 'video',
            link: 'link'
        };
        return typeMap[message.MsgType] || 'text';
    }

    async getDailyStats(groupId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        try {
            const stats = await Chat.aggregate([
                {
                    $match: {
                        groupId: groupId,
                        timestamp: {
                            $gte: startOfDay,
                            $lte: endOfDay
                        }
                    }
                },
                {
                    $group: {
                        _id: '$userId',
                        messageCount: { $sum: 1 },
                        messageTypes: { $push: '$type' }
                    }
                }
            ]);

            return stats;
        } catch (error) {
            logger.error('获取每日统计失败:', error);
            throw error;
        }
    }
}

module.exports = new WechatService();