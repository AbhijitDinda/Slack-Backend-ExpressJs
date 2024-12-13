import { StatusCodes } from "http-status-codes"
import { customErrorResponse, internalErrorResponse,successResponse} from "../utils/common/responseObject.js";
import { createWorkspaceService,getWorkspacesUserIsMemberServices,deleteWorkspaceServices,getWorkspaceService ,getWorkspaceByJoinCodeService ,updateWorkspaceServices ,addMemberToWorkspaceServices,addChannalToWorkspaceServices} from "../service/workspaceService.js";

export const createWorkspaceController = async (req,res)=>{
    try {
        const response = await createWorkspaceService({...req.body,owner:req.user});
        return res.status(StatusCodes.CREATED).json(successResponse(response));
        
    } catch (error) {
        console.log('workspace Controller error',error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error))
        
    }
}

export const getWorkspacesUserIsMemberController = async (req,res) =>{
    try {
        const response = await getWorkspacesUserIsMemberServices(req.user);
        console.log("first",response)
        return res.status(StatusCodes.OK).json(successResponse(response, 'Workspaces fetched successfully'));
        
    } catch (error) {
        console.log('workspace Controller error 1',error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error))
    }
}

export const deleteWorkspaceController = async (req,res)=>{
    try {
    const response = deleteWorkspaceServices(req.params.workspaceId,req.user)
    return res.status(StatusCodes.CREATED).json(successResponse(response));
        
    } catch (error) {
        console.log('workspace Controller error 2',error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
    }
}

export const getWorkspaceController = async (req, res) => {
    try {

        const response = await getWorkspaceService(
            req.params.workspaceId,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Workspace fatched successfully'));

    } catch (error) {

        console.log('Get workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
            
    }
};

export const getWorkspaceByJoincode = async (req,res) => {
    try {
        const response = await getWorkspaceByJoinCodeService(req.params.joinCode,req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Workspace fatched successfully'));
    } catch (error) {
        console.log('Get workspace by  joincode controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
        
    }
}

export const updateWorkspaceController = async (req,res) =>  {
  try {
    const response = await updateWorkspaceServices(req.params.workspaceId,req.body,req.user)
    return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Workspace Updated successfully'));
  } catch (error) {
    console.log('Update workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
        
    
  }
}

export const addMemberToWorkspaceController = async (req,res) => {
    try {
        const response = await addMemberToWorkspaceServices(
            req.params.workspaceId,
            req.body.memberId,
            req.body.memberRole,
            req.user
        )
        return res
        .status(StatusCodes.OK)
        .json(successResponse(response, 'Add Member to Workspace successfully'));
        
    } catch (error) {
        console.log('Add Member to workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
        
        
    }
}

export const addChannalToWorkspaceController = async (req,res)=>{
    try {
        const response = await addChannalToWorkspaceServices(
            req.params.workspaceId,
            req.body.channelName, 
            req.user
        );

        return res
        .status(StatusCodes.OK)
        .json(successResponse(response, 'Add Channal to Workspace successfully'));
        
    } catch (error) {
        console.log('Add Channal to workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}