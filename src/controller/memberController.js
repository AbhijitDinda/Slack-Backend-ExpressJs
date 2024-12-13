import { isMemberPartOfWorkspaceService } from "../service/memberServices.js"
import { StatusCodes } from "http-status-codes"
import { customErrorResponse, internalErrorResponse,successResponse} from "../utils/common/responseObject.js";
export const isMemberPartOfWorkspaceController = async (req, res) => {
    try {
        const response = isMemberPartOfWorkspaceService(req.params.workspaceId, req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, 'User is Member of workspace'));
    } catch (error) {
        console.log('Member controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}