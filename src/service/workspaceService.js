import { v4 as uuidv4} from 'uuid';
import ClientError from "../utils/error/clientError.js";
import { StatusCodes } from "http-status-codes";
import ValidationError from "../utils/error/validationError.js";
import workSpaceRepository from '../repositories/workspaceRepository.js';
import ChannalRepository from '../repositories/ChannalRepository.js';
import { response } from 'express';


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