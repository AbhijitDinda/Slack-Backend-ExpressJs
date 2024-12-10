import express from 'express';
import { createWorkspaceController,getWorkspacesUserIsMemberController,deleteWorkspaceController } from '../../controller/workspaceController.js';
import { validate } from '../../validation/zodvalidate.js';
import {workspaceSchema} from '../../validation/workspaceSchema.js';
import { isAuthenticated } from '../../middleware/authMiddleware.js';
const router = express.Router();

router.post('/',isAuthenticated,validate(workspaceSchema),createWorkspaceController);
router.get('/',isAuthenticated,getWorkspacesUserIsMemberController)
router.delete('/:workspaceId',isAuthenticated,deleteWorkspaceController)

export default router;