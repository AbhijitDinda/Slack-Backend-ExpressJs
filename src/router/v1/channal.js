import express from 'express';
import { StatusCodes } from "http-status-codes";
import { isAuthenticated } from '../../middleware/authMiddleware.js';
import { getChannalByIdController } from '../../controller/channelController.js';
import { validate } from '../../validation/zodvalidate.js';
const router = express.Router();

router.get('/:channalId',isAuthenticated,getChannalByIdController)
export default router; 