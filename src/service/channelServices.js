import  channalRepository from '../repositories/ChannalRepository.js';
import  messageRepository from '../repositories/messageRepository.js';
import { StatusCodes } from "http-status-codes";
import ClientError from "../utils/error/clientError.js";
import { isUserMemberOfWorkspace } from './workspaceService.js';
export const getChannalByIdService = async (channelId, userId)=> {
  // console.log("channelId",channelId)
    try {
        const channel = await channalRepository.getChannelWithWorkspaceDetails(channelId);
        // console.log("iiiiddd",channel)

        if (!channel || !channel.workspaceId) {
            throw new ClientError({
                message: 'Channel not found with the provided ID',
                explanation: 'Invalid data sent from the client',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        const isUserPartOfWorkspace = isUserMemberOfWorkspace(
            channel.workspaceId,
            userId
        );

          if (!isUserPartOfWorkspace) {
            throw new ClientError({
              message:
                'User is not a member of the workspace and hence cannot access the channel',
              explanation: 'User is not a member of the workspace',
              statusCode: StatusCodes.UNAUTHORIZED
            });
          }

        const messages = await messageRepository.getPaginatedMessages({ channelId },1,20);
      
      

      return {
        messages,
        _id: channel._id,
        name: channel.name,
        createdAt: channel.createdAt,
        updatedAt: channel.updatedAt,
        workspaceId: channel.workspaceId
      };
    } catch (error) {
        console.log("Get channel by id service error",error);
        throw error;
    }

}