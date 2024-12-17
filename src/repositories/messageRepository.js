import Message from '../schema/message.js';
import crudRepository from './crudRepisitory.js';

const MessageRepository = {
    ...crudRepository(Message),

    getPaginatedMessages: async (messageParams, page, limit) => {
        const messages = await Message.find(messageParams)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('senderId', 'username email avatar');

        console.log(messages);

        return messages;
    }

  };
  
  export default MessageRepository;
