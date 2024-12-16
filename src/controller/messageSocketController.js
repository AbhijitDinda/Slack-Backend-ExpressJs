import { createMessageService } from '../service/messageServices.js';
import { NEW_MESSAGE_EVENT,NEW_MESSAGE_RECEIVED_EVENT } from '../utils/common/eventsConstant.js'
export default function messageHandlers(io, socket) {
    socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {

        const { channelId } = data
        const massageResponse = await createMessageService(data);
        // socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, massageResponse);
        io.to(channelId).emit(NEW_MESSAGE_RECEIVED_EVENT, massageResponse);
        cb({
            success: true,
            message: 'Successfully created message',
            data: massageResponse
        })
 
    });
} 

// async function createMessageHandler(data, cb) {
//     const massageResponse = await createMessageService(data);
//     cb({
//         success: true,
//         message: 'Successfully created message',
//         data: massageResponse
//     })

// }