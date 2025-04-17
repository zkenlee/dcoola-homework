const request = require('supertest');
const { app, startServer, stopServer } = require('../../app');
const { generateMockMessage, generateSignature } = require('../utils/mockMessage');

describe('微信接入集成测试', () => {
    let server;

    beforeAll(async () => {
        server = await startServer(true);
    });

    afterAll(async () => {
        await stopServer();
    });

    test('服务器认证测试', async () => {
        const timestamp = Date.now().toString();
        const nonce = 'testNonce';
        const signature = generateSignature(timestamp, nonce);
        const echostr = 'testEchostr';

        const response = await request(server)
            .get('/wechat')
            .query({
                signature,
                timestamp,
                nonce,
                echostr
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe(echostr);
    });

    test('消息接收测试', async () => {
        const mockMessage = generateMockMessage();
        const timestamp = Date.now().toString();
        const nonce = 'testNonce';
        const signature = generateSignature(timestamp, nonce);

        const response = await request(server)
            .post('/wechat')
            .query({
                signature,
                timestamp,
                nonce
            })
            .send(mockMessage);

        expect(response.status).toBe(200);
    });
});