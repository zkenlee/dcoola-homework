const config = require('../src/config/config');
const mongoose = require('mongoose');

describe('生产环境配置测试', () => {
    test('数据库连接配置', () => {
        expect(config.mongodb.uri).toBeDefined();
        expect(mongoose.connection.readyState).toBe(1);
    });

    test('微信配置验证', () => {
        expect(config.wechat.token).toBeDefined();
        expect(config.wechat.appId).toBeDefined();
        expect(config.wechat.appSecret).toBeDefined();
    });

    test('目标群配置验证', () => {
        expect(Array.isArray(config.targetGroups)).toBe(true);
        expect(config.targetGroups.length).toBeGreaterThan(0);
    });
});