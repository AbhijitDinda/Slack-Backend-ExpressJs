import express from 'express';
import userRouter from './user.js';
import workspaceRouter from './workspace.js';
import channalRouter from './channal.js';
import memberRouter from './member.js';
const router = express.Router();

router.use('/user',userRouter);
router.use('/workspace',workspaceRouter);
router.use('/channal',channalRouter);
router.use('/members', memberRouter);

export default router;
