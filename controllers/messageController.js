const mongoose = require('mongoose');
const Message = require('../models/Message');

// ⚠️ QUAN TRỌNG: phải dùng ObjectId (KHÔNG dùng string)
const CURRENT_USER = new mongoose.Types.ObjectId("67f111111111111111111111");

// ================= GET messages giữa 2 user =================
exports.getMessagesBetweenUsers = async (req, res) => {
    try {
        const currentUser = CURRENT_USER;
        const otherUser = new mongoose.Types.ObjectId(req.params.userID);

        const messages = await Message.find({
            $or: [
                { from: currentUser, to: otherUser },
                { from: otherUser, to: currentUser }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= POST gửi message =================
exports.sendMessage = async (req, res) => {
    try {
        const currentUser = CURRENT_USER;
        const { to, text, file } = req.body;

        const messageContent = file
            ? { type: 'file', text: file }
            : { type: 'text', text: text };

        const newMessage = new Message({
            from: currentUser,
            to: new mongoose.Types.ObjectId(to), // ⚠️ ép kiểu ObjectId
            messageContent
        });

        await newMessage.save();

        res.json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= GET message cuối mỗi user =================
exports.getLastMessages = async (req, res) => {
    try {
        const currentUser = CURRENT_USER;

        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { from: currentUser },
                        { to: currentUser }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $addFields: {
                    otherUser: {
                        $cond: [
                            { $eq: ["$from", currentUser] },
                            "$to",
                            "$from"
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$otherUser",
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};