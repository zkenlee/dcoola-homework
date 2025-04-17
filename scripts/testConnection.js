const mongoose = require('mongoose');
const config = require('../src/config/config');

async function testConnection() {
    try {
        console.log('正在连接到数据库...');
        console.log('URI:', config.mongodb.uri);
        
        await mongoose.connect(config.mongodb.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('数据库连接成功！');
        console.log('数据库状态:', mongoose.connection.readyState);
        console.log('数据库名称:', mongoose.connection.name);
        
        await mongoose.disconnect();
        console.log('连接已关闭');
        process.exit(0);
    } catch (error) {
        console.error('数据库连接失败:', error);
        process.exit(1);
    }
}

testConnection();