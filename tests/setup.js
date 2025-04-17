const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDB, disconnectDB } = require('../src/utils/database');
const logger = require('../src/utils/logger');

let mongoServer;

beforeAll(async () => {
    try {
        // 确保之前的连接已断开
        await disconnectDB();
        
        // 创建内存数据库
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        // 连接到测试数据库
        await connectDB(mongoUri);
    } catch (error) {
        logger.error('测试环境设置失败:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        await disconnectDB();
        await mongoServer.stop();
    } catch (error) {
        logger.error('测试环境清理失败:', error);
        throw error;
    }
});

afterEach(async () => {
    try {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany();
        }
    } catch (error) {
        logger.error('测试数据清理失败:', error);
        throw error;
    }
});