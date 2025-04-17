const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('./logger');

mongoose.set('strictQuery', true);

let isConnected = false;

const connectDB = async (uri) => {
    try {
        // 如果已经连接，先断开现有连接
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            isConnected = false;
        }
        
        // 使用传入的 URI 或配置中的 URI
        const mongoUri = uri || config.mongodb.uri;
        
        // 连接到数据库
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        isConnected = true;
        logger.info('数据库连接成功');
    } catch (error) {
        logger.error('数据库连接失败:', error);
        throw error;
    }
};

const disconnectDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        isConnected = false;
        logger.info('数据库连接已断开');
    }
};

module.exports = {
    connectDB,
    disconnectDB,
    isConnected: () => isConnected
};