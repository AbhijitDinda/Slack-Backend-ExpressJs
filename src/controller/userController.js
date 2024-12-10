import { customErrorResponse, internalErrorResponse,successResponse} from "../utils/common/responseObject.js"
import {signUpServices,signInServices} from '../service/userService.js'
import { StatusCodes } from "http-status-codes"
export const signUp = async (req,res) =>{
    try { 
        const user = await signUpServices(req.body);
        console.log(user)
        return res.status(StatusCodes.CREATED).json(successResponse(user,"user created Succesfully"));
    } catch (error) {
        console.log('user Controller error',error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error))
    }
}

export const signIn = async (req,res) =>{
    try {
        const user = await signInServices(req.body);
        return res.status(StatusCodes.OK).json(successResponse(user,'user signed in succesful'))
    } catch (error) {
        console.log('user Controller error',error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error))
    }
}