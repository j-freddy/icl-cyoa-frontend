import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import './App.css';
import { Graph } from './graph/types';

// TODO: move into own folder and potentially move into a react state?
const socket = new WebSocket("ws://localhost:8000/ws/hellos");
socket.onmessage = (ev: MessageEvent<any>) => {
  console.log(ev.data)
  const graph = JSON.parse(ev.data) as Graph
  console.log(graph)
}

const initParagraph = "You are a commoner living in the large kingdom of Garion. \
Your kingdom has been in bitter war with the neighboring kingdom, Liore, for the past year. \
You dream of doing something great and going on an adventure. \
You walk around town and see warning posters about the dangers of the dark forest at the edge of town. \
You go to the market and see military representatives signing people up for the army."

function App() {
  // initialise graph to have one node (which has no options and also no action)
  const [graph, setGraph] = useState<Graph>({adjacencyLists: [[]], nodes: [{action: null, paragraph: initParagraph}]});

  // example of requesting node expand to backend
  const sendMessage = () => {
    socket.send(JSON.stringify({type: "expandNode", data: {nodeToExpand: 0, graph}}))
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
