
import { Middleware } from 'redux';
import { WS_URL } from '../../api/links';
import {
  connectNodesMsg,
  generateActionsMsg,
  generateManyMsg,
  generateInitialStoryMsg,
  generateNarrativeMsg
} from '../../api/ws/storyMessages';
import { graphMessageToGraphLookup } from '../../utils/graph/graphUtils';
import { GraphMessage } from '../../utils/graph/types';
import {
  connectNodes,
  generateActions,
  generateEnding,
  generateMany,
  generateParagraph,
  generateInitialStoryBasic,
  generateInitialStoryAdvanced,
  graphResponse
} from './storySlice';
import { connectionEstablished, disconnected, startConnecting } from './wsSlice';


const wsMiddleware: Middleware = store => {
  let socket: WebSocket;

  return next => action => {
    const state = store.getState();
    const isConnectionEstablished = socket && state.ws.isConnected;
    const connecting = socket && state.ws.isEstablishingConnection;

    if (startConnecting.match(action) && !isConnectionEstablished && !connecting) {
      socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        store.dispatch(connectionEstablished());
      };

      socket.onmessage = (msg) => {
        const jsonMsg = JSON.parse(msg.data) as { graph: GraphMessage }
        const graph = graphMessageToGraphLookup(jsonMsg.graph);
        store.dispatch(graphResponse(graph))
      };

      socket.onclose = () => {
        store.dispatch(disconnected());
        // reconnect in 2 seconds
        setTimeout(() => {
          store.dispatch(startConnecting());
        }, 2000)
      };
    }

    if (isConnectionEstablished) {
      if (generateInitialStoryBasic.match(action)) {
        const values = [{attribute: "theme", content: action.payload.prompt}];
        socket.send(generateInitialStoryMsg(state.story.temperature, values));
      }

      if (generateInitialStoryAdvanced.match(action)) {
        socket.send(generateInitialStoryMsg(state.story.temperature, action.payload.values));
      }

      if (generateActions.match(action)) {
        socket.send(generateActionsMsg(state.story.temperature, state.story.graph, action.payload.nodeToExpand));
      }

      if (generateParagraph.match(action)) {
        socket.send(generateNarrativeMsg(
          state.story.temperature, 
          state.story.graph, 
          action.payload.nodeToExpand, 
          false, 
          state.story.descriptor, 
          state.story.details, 
          state.story.style));
      }

      if (generateEnding.match(action)) {
        socket.send(generateNarrativeMsg(
          state.story.temperature, 
          state.story.graph, 
          action.payload.nodeToEnd, 
          true, 
          state.story.descriptor, 
          state.story.details, 
          state.story.style));
      }

      if (connectNodes.match(action)) {
        socket.send(connectNodesMsg(
          state.story.temperature, 
          state.story.graph, 
          action.payload.fromNode, 
          action.payload.toNode
        ));
      }
    }

    if (generateMany.match(action)) {
      socket.send(generateManyMsg(
        state.story.temperature, 
        state.story.graph, 
        action.payload.fromNode, 
        action.payload.maxDepth, 
        state.story.storyId
      ));
    }

    next(action);
  }
}

export default wsMiddleware;
