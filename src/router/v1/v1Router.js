import express from 'express';
import userRouter from './user.js';
import workspaceRouter from './workspace.js';
import channalRouter from './channal.js';
const router = express.Router();

router.use('/user',userRouter);
router.use('/workspace',workspaceRouter);
router.use('/channal',channalRouter);

export default router;
