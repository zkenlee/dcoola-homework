const express = require('express');
const bodyParser = require('body-parser');
const xmlParser = require('express-xml-bodyparser');
const { connectDB } = require('./src/utils/database');
const wechatController = require('./src/controllers/wechatController');
const logger = require('./src/utils/logger');
const config = require('./src/config/config');

const app = express();

// 中间件配置
app.use(bodyParser.json());
app.use(xmlParser());
app.use('/wechat', wechatController);

// 错误处理中间件
app.use((err, req, res, next) => {
    logger.error('App Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

let server;

async function startServer(skipDbConnection = false) {
    try {
        if (!skipDbConnection) {
            await connectDB();
        }

        if (!server) {
            const port = config.port || 3000;
            server = app.listen(port, () => {
                logger.info(`服务器运行在端口 ${port}`);
            });
        }
        
        return server;
    } catch (error) {
        logger.error('服务器启动失败:', error);
        throw error;
    }
}

async function stopServer() {
    if (server) {
        await new Promise((resolve) => {
            server.close(resolve);
        });
        server = null;
        logger.info('服务器已关闭');
    }
}

// 只在直接运行时启动服务器
if (require.main === module) {
    startServer().catch((error) => {
        logger.error('启动失败:', error);
        process.exit(1);
    });
}

module.exports = { app, startServer, stopServer };