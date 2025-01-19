import express from 'express';
import { createWorkspaceController,getWorkspacesUserIsMemberController,deleteWorkspaceController,getWorkspaceController,getWorkspaceByJoincode , updateWorkspaceController,addMemberToWorkspaceController,addChannalToWorkspaceController} from '../../controller/workspaceController.js';
import { validate } from '../../validation/zodvalidate.js';
import { workspaceSchema , addMemberToWorkspaceSchema,addChannelToWorkspaceSchema } from '../../validation/workspaceSchema.js';
import { isAuthenticated } from '../../middleware/authMiddleware.js';
const router = express.Router();

router.post('/',isAuthenticated,validate(workspaceSchema),createWorkspaceController);
router.get('/',isAuthenticated,getWorkspacesUserIsMemberController) ;
router.delete('/:workspaceId',isAuthenticated,deleteWorkspaceController);
router.get('/:workspaceId',isAuthenticated,getWorkspaceController)  ;
router.get('/join/:joinCode',isAuthenticated,getWorkspaceByJoincode)  ;
router.put('/:workspaceId',isAuthenticated,updateWorkspaceController);
router.put('/:workspaceId/members',isAuthenticated,validate(addMemberToWorkspaceSchema),addMemberToWorkspaceController);
router.put('/:workspaceId/channals',isAuthenticated,validate(addChannelToWorkspaceSchema),addChannalToWorkspaceController);

export default router;