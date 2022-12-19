
import { Middleware } from 'redux';
import { WS_URL } from '../../api/links';
import {
  connectNodesMsg,
  generateActionsMsg,
  generateEndingMsg,
  generateManyMsg,
  generateParagraphMsg,
  generateStartParagraphMsg,
  generateStoryWithAdvancedInputMsg
} from '../../api/ws/storyMessages';
import { graphMessageToGraphLookup } from '../../utils/graph/graphUtils';
import { GraphMessage } from '../../utils/graph/types';
import {
  connectNodes,
  generateActions,
  generateEnding,
  generateMany,
  generateParagraph,
  generateStartParagraph,
  generateStoryWithAdvancedInput,
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
      if (generateStartParagraph.match(action)) {
        socket.send(generateStartParagraphMsg(action.payload.prompt));
      }

      if (generateStoryWithAdvancedInput.match(action)) {
        socket.send(generateStoryWithAdvancedInputMsg(action.payload.values));
      }

      if (generateParagraph.match(action)) {
        socket.send(generateParagraphMsg(state.story.graph, action.payload.nodeToExpand));
      }

      if (generateActions.match(action)) {
        socket.send(generateActionsMsg(state.story.graph, action.payload.nodeToExpand));
      }

      if (generateEnding.match(action)) {
        socket.send(generateEndingMsg(state.story.graph, action.payload.nodeToEnd));
      }

      if (connectNodes.match(action)) {
        socket.send(connectNodesMsg(state.story.graph, action.payload.fromNode, action.payload.toNode));
      }
    }

    if (generateMany.match(action)) {
      socket.send(generateManyMsg(state.story.graph, action.payload.fromNode, action.payload.maxDepth, state.story.storyId));
    }

    next(action);
  }
}

export default wsMiddleware;
