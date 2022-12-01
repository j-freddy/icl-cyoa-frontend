
import { Middleware } from 'redux';
import { connectNodesMsg, generateActionsMsg, generateEndingMsg, generateParagraphMsg, generateStartParagraphMsg, generateStoryWithAdvancedInputMsg } from '../api/wsMessages';
import { graphMessageToGraphLookup } from '../utils/graph/graphUtils';
import { GraphMessage } from '../utils/graph/types';
import { connectNodes, generateActions, generateEnding, generateParagraph, generateStartParagraph, generateStoryWithAdvancedInput, graphResponse } from './storySlice';
import { startConnecting, connectionEstablished, disconnected } from './wsSlice';

const WS_URL: string = "wss://cyoa-api-prod.herokuapp.com/ws"

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

        next(action);
    }
}

export default wsMiddleware;