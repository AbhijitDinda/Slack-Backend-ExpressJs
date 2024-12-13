
import { StatusCodes } from 'http-status-codes';
import Workspace from '../schema/workspace.js';
import User from '../schema/user.js';
import Channel from '../schema/channel.js';
import ClientError from '../utils/error/clientError.js';
import crudRepository from './crudRepisitory.js';
import ChannalRepository from './ChannalRepository.js';

const workSpaceRepository = {
    ...crudRepository(Workspace),
  
    getWorkspaceByName: async function(WorkspaceName) {
      const workspace = await Workspace.findOne({name:WorkspaceName});

      if(!workspace){
        throw new ClientError({
          explanation: 'invalid data send from the client',
          message: 'workspace not found 1',
          statusCode: StatusCodes.NOT_FOUND
        })
      }

      return workspace;

    },
    getWorkspaceByJoinCode: async function(joinCode) {
      const workspace = await Workspace.findOne({joinCode});


      if(!workspace){
        throw new ClientError({
          explanation: 'invalid data send from the client',
          message: 'workspace not found 2',
          statusCode: StatusCodes.NOT_FOUND
        })
      }
      return workspace
    },
    addMemberToWorkspace: async function(workspaceId,memberId,memberRole) {
      
      //check request workspace exists or not
      const workspace = await Workspace.findById(workspaceId);
      // console.log("fuckkkkkk",workspace)

    
      if(!workspace){
        throw new ClientError({
          explanation: 'invalid data send from the client',
          message: 'workspace not found 3',
          statusCode: StatusCodes.NOT_FOUND
        })
      }

      //check member is exists or not
    

      const isValidUser = await User.findById(memberId);
      if (!isValidUser) {
        throw new ClientError({
          explanation: 'Invalid data sent from the client',
          message: 'User not found',
          statusCode: StatusCodes.NOT_FOUND
        });
      }

      //check member is already in this workspace or not

      const isMemberAlreadyPartOfWorkspace = workspace.members.find(
        (member) => member.memberId == memberId
      );

      if(isMemberAlreadyPartOfWorkspace){
        throw new ClientError({
          explanation: 'invalid data send from the client',
          message: 'member alraedy in workspace 1',
          statusCode: StatusCodes.FORBIDDEN
        })
      }

      


      workspace.members.push({
        memberId,
        role:memberRole
      })
      await workspace.save();

      return workspace;



    },
    addChannalToWorkspace: async function(workspaceId,channelName) {
      
      //check workspace exists or not
      const workspace = await Workspace.findById(workspaceId).populate('channels');
      console.log(workspace);
      if(!workspace){
        throw new ClientError({
          explanation: 'invalid data send from the client',
          message: 'workspace not found 4',
          statusCode: StatusCodes.NOT_FOUND
        })
      }

      const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
        (channel) => channel.name === channelName
      );

      if(isChannelAlreadyPartOfWorkspace){
        throw new ClientError({
          explanation: 'Invalid data sent from client',
          message: 'Channel already part of workspace',
          statusCode: StatusCodes.FORBIDDEN
        });
      }

      const channal = await ChannalRepository.create({
        name:channelName,
        workspaceId:workspaceId

      })
      // console.log("channal",channal)

      workspace.channels.push(channal);


      await workspace.save();

      
      return workspace;

    },
    fatchAllWorkspaceByMemberId: async function(memberId) {
      const workspaces = await Workspace.find({
        'members.memberId': memberId
      }).populate('members.memberId', 'username email avatart');
  
      return workspaces;
      
    },
    
  };
  
  export default workSpaceRepository;
