const mongoose = require('mongoose');
const config = require('../src/config/config');

beforeAll(async () => {
    await mongoose.connect(config.mongodb.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});