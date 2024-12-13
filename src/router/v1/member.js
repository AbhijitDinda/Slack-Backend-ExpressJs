import express from 'express';
import { isAuthenticated } from '../../middleware/authMiddleware.js';
import { isMemberPartOfWorkspaceController } from '../../controller/memberController.js';

const router = express.Router();

router.get('/workspace/:workspaceId',isAuthenticated,isMemberPartOfWorkspaceController)
export default router; 