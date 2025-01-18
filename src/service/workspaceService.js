import { v4 as uuidv4} from 'uuid';
import ClientError from "../utils/error/clientError.js";
import { StatusCodes } from "http-status-codes";
import ValidationError from "../utils/error/validationError.js";
import workSpaceRepository from '../repositories/workspaceRepository.js';
import ChannalRepository from '../repositories/ChannalRepository.js';
import userRepository from '../repositories/userRepository.js';
import { response } from 'express';
import Workspace from '../schema/workspace.js';
import User from '../schema/user.js';

const isUserAdminOfWorkspace = (workspace,userId) =>{
    
    return workspace.members.find((member) => member.memberId.toString() === userId && member.role === 'admin'); 
}

// export const isUserMemberOfWorkspace = (workspace,userId) =>{
//     console.log("gggg",workspace,userId); 
//     return workspace.members.find((member) => member.memberId.toString() === userId); 
// }
export const isUserMemberOfWorkspace = (workspace, userId) => {
    // console.log("gggg",workspace,userId); 
    return workspace.members.find(
      (member) => member.memberId.toString() === userId
    );
  };

export const createWorkspaceService = async (workspaceData) =>{
    try {
        const joinCode = uuidv4().substring(0, 6).toUpperCase();

        const response = await workSpaceRepository.create({ name: workspaceData.name, description: workspaceData.description, joinCode });
        
 
        await workSpaceRepository.addMemberToWorkspace(response._id, workspaceData.owner, 'admin');
        

        const updatedResponse = await workSpaceRepository.addChannalToWorkspace(response._id, 'general');
        return updatedResponse;

    } catch (error) {
        console.log("workspace service error", error);
        
        if (error.name === 'ValidationError') {
            throw new ValidationError(
                {
                    error: error.errors
                },
                error.message
            );
        }

        if (error.name === 'MongoServerError' && error.code === 11000) {
            throw new ValidationError({
                error: ['A workspace with details already exists']
            },'A workspace with details already exists')
        }
    }
    

}

export const getWorkspacesUserIsMemberServices = async (userId) =>{

    try {
        const reponse = await workSpaceRepository.fatchAllWorkspaceByMemberId(userId);
        console.log("secound ",reponse)
        return reponse;
        
    } catch (error) {
        console.log("workspace service error 1", error);
    }
}

export const deleteWorkspaceServices = async (workspaceId,userId) =>{

    try {
        const workspace = await workSpaceRepository.getById(workspaceId);
        // console.log(workspace.members)

        const isAllowed = await workspace.members.find((member) => member.memberId.toString() === userId && member.role === 'admin'); 

        if (isAllowed) {
            await ChannalRepository.deleteMany(workspace.channels);
            const response = await workSpaceRepository.delete(workspaceId);
            return response;
        }

        

        throw new ClientError({
            explanation:'User is not a member either admin of the workspace',
            message:'User is not allowed to delete workspace',
            statusCode:StatusCodes.NOT_FOUND 
        })

    } catch (error) {
        console.log(error);
        throw error;

    }

    
};

export const getWorkspaceService = async (workspaceId,userId) =>{
    try {
        const workspace = await workSpaceRepository.getById(workspaceId);
        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMember = await workspace.members.find((member)=> member.memberId.toString() === userId );

        if (!isMember) {
            throw new ClientError({
              explanation: 'User is not a member of the workspace',
              message: 'User is not a member of the workspace',
              statusCode: StatusCodes.UNAUTHORIZED
            });
          }

        if(isMember){
            return workspace;
        }
    } catch (error) {
        console.log(error);
        throw error;
        
    }

}

export const getWorkspaceByJoinCodeService = async (joinCode,userId) =>{
    try {
        const workspace = await workSpaceRepository.getWorkspaceByJoinCode(joinCode);

        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMember  = isUserMemberOfWorkspace(workspace,userId);
        if (!isMember) {
            throw new ClientError({
              explanation: 'User is not a member of the workspace',
              message: 'User is not a member of the workspace',
              statusCode: StatusCodes.UNAUTHORIZED
            });
          }
          return workspace;




    } catch (error) {
        console.log("get workspace by joincode error", error);
        throw error;
        
    }
}

export const updateWorkspaceServices = async (workspaceId,workspaceData,userId) =>{
    try {
        const workspace = await workSpaceRepository.getById(workspaceId);
        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found update',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        const isAdmin = isUserAdminOfWorkspace(workspace,userId);
        if (!isAdmin) {
            throw new ClientError({
              explanation: 'User is not a Admin of the workspace',
              message: 'User is not a member of the workspace',
              statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const response = await workSpaceRepository.update(workspaceId,workspaceData);
        return response;


        
    } catch (error) {
        console.log("update workspace by workspace id error", error);
        throw error;
    }
}

export const addMemberToWorkspaceServices = async (workspaceId,memberId,memberRole,userId) =>{
    try {
        const workspace = await workSpaceRepository.getById(workspaceId);
        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isAdmin = isUserAdminOfWorkspace(workspace,userId);
        if (!isAdmin) {
            throw new ClientError({
              explanation: 'User is not a Admin of the workspace',
              message: 'User is not a member of the workspace',
              statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const validMember = await userRepository.getById(memberId);
        if (!validMember) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Member not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMemberAlreadyMember = isUserMemberOfWorkspace(workspace,memberId);
        if (isMemberAlreadyMember) {
            throw new ClientError({
              explanation: 'User is already a member of the workspace',
              message: 'User is already a member of the workspace',
              statusCode: StatusCodes.UNAUTHORIZED
            });
          }

        

        const response = await workSpaceRepository.addMemberToWorkspace(workspaceId,memberId,memberRole);
        return response;


    } catch (error) {
        console.log("Add Member  in workspace error",error);
        throw error;
        
    }
}

export const addChannalToWorkspaceServices = async (workspaceId,channelName,userId) =>{
    try {
        const workspace = await workSpaceRepository.getById(workspaceId);
        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        const isAdmin = isUserAdminOfWorkspace(workspace,userId);
        if (!isAdmin) {
            throw new ClientError({
              explanation: 'User is not a Admin of the workspace',
              message: 'User is not a member of the workspace',
              statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        // Check if the channel name already exists in the workspace
        const isChannel = workspace.channels.find(
            (channel) => channel && channel.name && channel.name.toLowerCase() === channelName.toLowerCase()
        );
        if (isChannel) {
            throw new ClientError({
              explanation: 'User is not a Admin of the workspace',
              message: 'Channel Name already used in same  workspace',
              statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const response = await workSpaceRepository.addChannalToWorkspace(workspaceId,channelName);
        return response;

    } catch (error) {
        console.log("Add channel  in workspace error",error);
        throw error;
        
    }
}