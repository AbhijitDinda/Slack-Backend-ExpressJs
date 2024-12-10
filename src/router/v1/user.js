import express from 'express';
import { StatusCodes } from "http-status-codes";
import { signUp,signIn } from '../../controller/userController.js';
import { validate } from '../../validation/zodvalidate.js';
import { userSignUpSchema,userSignInSchema } from '../../validation/userSchema.js';
const router = express.Router();

router.post('/signup',validate(userSignUpSchema),signUp)
router.post('/signin',validate(userSignInSchema),signIn)
export default router;