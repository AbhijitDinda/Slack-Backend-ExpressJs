import { StatusCodes } from "http-status-codes";
import ClientError from "../utils/error/clientError.js";
import MessageRepository from "../repositories/messageRepository.js";
import channalRepository from "../repositories/ChannalRepository.js";
import workspaceRepository from "../repositories/workspaceRepository.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getMessageService = async (messageParams, page, limit, user) => {
    
    try {
        const channal = await channalRepository.getChannelWithWorkspaceDetails(messageParams.channelId);
        
        if(!channal) {
            throw new ClientError({
                explanation: 'channal not found',
                message: 'channal not found',
                statusCode: StatusCodes.NOT_FOUND
            })
        }
        
        const workspace = channal.workspaceId;
        
        
        const isMember = await isUserMemberOfWorkspace(workspace, user);
        if(!isMember) {
            throw new ClientError({
                explanation: 'member is not part of workspace',
                message: 'member is not part of workspace',
                statusCode: StatusCodes.NOT_FOUND
            })
        }
        // console.log("meeeee",isMember)

        const message = await MessageRepository.getPaginatedMessages(messageParams, page, limit);
        return message;

    } catch (error) {
        console.log(error)
        throw error;

    }

}