
import workSpaceRepository from "../repositories/workspaceRepository.js"
import userRepository from "../repositories/userRepository.js"
import ClientError from "../utils/error/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";
import { StatusCodes } from "http-status-codes";

export const isMemberPartOfWorkspaceService = async (workspaceId, userId) => {
    const workspace = await workSpaceRepository.getById(workspaceId);

    if(!workspace) {
        throw new ClientError({
            explanation: 'Workspace not found',
            message: 'Workspace not found',
            statusCode: StatusCodes.NOT_FOUND
        })
    }

    const isMember = await isUserMemberOfWorkspace(workspace,userId);

    if(!isMember) {
        throw new ClientError({
            explanation: 'Member not found',
            message: 'Member is not part of this workspace',
            statusCode: StatusCodes.NOT_FOUND
        })
    }

    const user = userRepository.getById(userId);
    return user;
}