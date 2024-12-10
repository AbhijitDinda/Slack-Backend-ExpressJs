import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/serverConfig.js'
import { customErrorResponse,internalErrorResponse } from '../utils/common/responseObject.js'
import userRepository from "../repositories/userRepository.js";
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        // const token = req.body['x-access-token'];

        //check token
        if (!token) {
            console.log("token",token);
            return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
                explanation: 'invalid data send from client 1',
                message: 'no auth token provided',

            }))
            
        }

        //if token present then varify
        const response = jwt.verify(token, JWT_SECRET);
        if (!response) {
            return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
                explanation: 'invalid data send from client 2',
                message: 'invalid auth token provided',

            }))
        }

        //if token is vefified

        const user = await userRepository.getById(response.id);
        req.user = user.id;
        next()
    } catch (error) {
        console.log("Auth middleware",error)
        if(error.name==='JsonWebTokenError'){
            return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
                explanation: 'invalid data send from client 3',
                message: 'invalid auth token provided',

            }))

        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error))
    }

}