import {JOIN_CHANNEL} from '../utils/common/eventsConstant.js'
export default function messageHandlers(io,socket){
    socket.on(JOIN_CHANNEL,async function joinChannelHandler(data,cb){
        const roomId = data.channelId;
        socket.join(roomId);

        console.log(`user ${socket.id} join the channel ${roomId}`);
        cb({
            success: true,
            message: "successfully join the channel",
            data: roomId
        })
    })

}