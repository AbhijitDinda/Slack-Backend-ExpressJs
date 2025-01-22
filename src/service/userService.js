

import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/userRepository.js";
import ClientError from "../utils/error/clientError.js";
import ValidationError from "../utils/error/validationError.js";
import bcrypt from 'bcrypt';
import { createJWT } from "../utils/common/authUtils.js";


export const signUpServices = async (data) => {

    try {
        const newUser = await userRepository.create(data);
        return newUser;

    } catch (error) {
        console.log("user service erroe", error)
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
                error: ['A user with same Email or Username already exists']
            },'A user with same Email or Username already exists')
        }
    }


}

export const signInServices = async (data) => {
    try {
        //check user email exists or not
        const user = await userRepository.getByEmail(data.email);
        //if user not found
        if(!user){
            throw new ClientError({
                explanation:'Invalid data send from the client',
                message:'No registerd user found with this email',
                statusCode:StatusCodes.NOT_FOUND
            })
        }
        //then match password
        const isMatch = bcrypt.compareSync(data.password,user.password);

        if(!isMatch){
            throw new ClientError({
                explanation:'Invalid data send from the client',
                message:'invalid password,please try again',
                statusCode:StatusCodes.UNAUTHORIZED
            })
        }

        return {
            username: user.username,
            avtar: user.avtar,
            email: user.email,
            _id:user._id,
            token: createJWT({id:user._id, email:user.email})
        }



    } catch (error) {
        console.log('User services error', error);
        throw error;
    }
}

