import { StatusCodes } from "http-status-codes";
import {getChannalByIdService} from "../service/channelServices.js";
import { customErrorResponse, internalErrorResponse,successResponse} from "../utils/common/responseObject.js";
export const getChannalByIdController = async (req,res) => {
    try {
        const response = await getChannalByIdService(req.params.channalId, req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, 'Channel fatched successfully'));
    } catch (error) {
        console.log("Get Channal by id controller error ",error)
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));

    }

    
}