import { StatusCodes } from "http-status-codes"
import { customErrorResponse, internalErrorResponse,successResponse} from "../utils/common/responseObject.js";
import { createWorkspaceService,getWorkspacesUserIsMemberServices,deleteWorkspaceServices } from "../service/workspaceService.js";

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

