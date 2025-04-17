const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'voice', 'video', 'link'],
        default: 'text'
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    metadata: {
        msgId: {
            type: String,
            unique: true
        },
        createTime: Number
    }
}, {
    timestamps: true
});

// 添加索引
chatSchema.index({ 'metadata.msgId': 1 }, { unique: true });

module.exports = mongoose.model('Chat', chatSchema);