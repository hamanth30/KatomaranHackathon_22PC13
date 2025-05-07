import User from '../models/User';

let chatHistory = [];

export const sendMessage = async (req, res) => {
    const { userId, message } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const chatMessage = {
            userId,
            message,
            timestamp: new Date(),
        };

        chatHistory.push(chatMessage);
        // Here you would typically emit the message to the WebSocket clients
        // For example: io.emit('message', chatMessage);

        res.status(200).json(chatMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export const getChatHistory = (req, res) => {
    res.status(200).json(chatHistory);
};