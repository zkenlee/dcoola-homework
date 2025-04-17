require('dotenv').config();
const { checkDatabaseConnection } = require('../src/utils/healthCheck');

async function checkEnvironment() {
    const requiredEnvVars = [
        'MONGODB_URI',
        'WECHAT_TOKEN',
        'WECHAT_APPID',
        'WECHAT_APPSECRET'
    ];

    const missing = requiredEnvVars.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.error('缺少必要的环境变量:', missing.join(', '));
        process.exit(1);
    }

    const dbConnected = await checkDatabaseConnection();
    if (!dbConnected) {
        console.error('数据库连接失败');
        process.exit(1);
    }

    console.log('环境检查通过');
}

checkEnvironment();