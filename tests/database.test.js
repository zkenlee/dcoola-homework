const mongoose = require('mongoose');
const { connectDB } = require('../src/utils/database');
const config = require('../src/config/config');

jest.setTimeout(120000); // 增加超时时间到 120 秒

describe('数据库连接测试', () => {
    afterEach(async () => {
        try {
            await mongoose.disconnect();
        } catch (error) {
            console.error('断开连接失败:', error);
        }
    });

    test('能够连接到 MongoDB', async () => {
        await connectDB();
        expect(mongoose.connection.readyState).toBe(1);
    });

    test('使用正确的数据库 URI', () => {
        expect(config.mongodb.uri).toBe(process.env.MONGODB_URI || 'mongodb://localhost:27017/dcoola-homework');
    });

    test('连接错误处理', async () => {
        const invalidUri = 'mongodb://invalid-host:27017/test';
        await expect(async () => {
            await mongoose.connect(invalidUri);
        }).rejects.toThrow();
    });
});