module.exports = {
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dcoola-homework',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        }
    },
    port: process.env.PORT || 3000,
    wechat: {
        token: process.env.WECHAT_TOKEN || 'your_token_here',
        appId: process.env.WECHAT_APPID || 'your_appid_here',
        appSecret: process.env.WECHAT_APPSECRET || 'your_appsecret_here'
    },
    targetGroups: ['group1_id'],
    collection: {
        startTime: '00:00',
        endTime: '23:59'
    }
};