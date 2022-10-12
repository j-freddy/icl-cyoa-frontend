import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import './App.css';
import { Graph } from './graph/graph';
import { NodeData } from './graph/types';

// TODO: move into own folder and potentially move into a react state?
const socket = new WebSocket("ws://localhost:8000/ws/");
socket.onmessage = (ev: MessageEvent<any>) => {
  console.log(ev.data)
  const { nodes } = JSON.parse(ev.data) as {nodes: NodeData[]}

  const graph = new Graph(nodes);
  console.log(graph)
}

const initParagraph = "You are a commoner living in the large kingdom of Garion."

function App() {
  // initialise graph to have one node (which has no options and also no action)
  const [nodes] = useState<NodeData[]>([{nodeId: 0, action: null, paragraph: initParagraph, parentId: null, childrenIds: []}]);

  // example of requesting node expand to backend
  const sendMessage = () => {
    socket.send(JSON.stringify({type: "expandNode", data: {nodeToExpand: 0, nodes}}))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Welcome to create your own adventure book!
        </h2>
        <Button onClick={() => {sendMessage()}}>
          send
        </Button>
        <a
          href='/'
          className="App-link"
        >
          Get started
        </a>
      </header>
    </div>
  );
}

export default App;
