import { deleteNode } from "../../store/features/storySlice";
import {
  ActionNode, Graph,
  GraphMessage, NarrativeNode, NodeData, NodeId,
  NodeType
} from "./types";


export const isGraphEmpty = (graph: Graph) => {
  return Object.keys(graph.nodeLookup).length === 0;
}


export const makeNarrativeNode = (params: Omit<NarrativeNode, "type">) => {
  return {
    type: NodeType.Narrative,
    ...params
  }
};


export const makeActionNode = (params: Omit<ActionNode, "type">) => {
  return {
    type: NodeType.Action,
    ...params
  }
};

export const isNarrative = (node: NodeData) => {
  return node.type === NodeType.Narrative;
};

export const isAction = (node: NodeData) => {
  return node.type === NodeType.Action;
};

export const graphMessageToGraphLookup = (graphMessage: GraphMessage): Graph => {
  const nodeLookup: Record<number, NodeData> = {};
  for (const nodeData of graphMessage.nodes) {
    nodeLookup[nodeData.nodeId] = nodeData;
  }

  return { nodeLookup };
};


export const graphToGraphMessage = (graph: Graph): GraphMessage => {
  const nodes: NodeData[] = [];
  for (const node of Object.values(graph.nodeLookup)) {
    nodes.push(node as ActionNode);
  }
  return { nodes };
};


export const deleteNodeFromGraph = (graph: Graph, nodeId: number): Graph => {
  const toKeep = new Set<NodeId>();

  const dfsNodesToKeep = (currId: number) => {
    const node = graph.nodeLookup[currId];

    toKeep.add(currId);

    if (currId === nodeId) {
      return;
    }

    for (const childId of node.childrenIds) {
      dfsNodesToKeep(childId);
    }
  }
  dfsNodesToKeep(0);

  return {
    nodeLookup: Object.fromEntries(
      Object.entries(graph.nodeLookup)
        .filter(([id, _]) => {
          return toKeep.has(parseInt(id));
        }).map(
          ([id, v]) => {
            return parseInt(id) === nodeId ? [id, { ...v, childrenIds: [] }] : [id, v];
          }
        )
    )
  };
};

export const isValidConnectNodes = (graph: Graph, fromNode: number, toNode: number): boolean => {

  if (graph.nodeLookup[fromNode].type === NodeType.Action
    && graph.nodeLookup[toNode].type === NodeType.Action) return false; // cannot connect action to action

  const children = graph.nodeLookup[fromNode].childrenIds;
  if (children.length !== 0 && (
      // we can't have multiple children of different types
      graph.nodeLookup[children[0]].type !== graph.nodeLookup[toNode].type
      || // we can't have multiple narrative nodes coming from one node
      graph.nodeLookup[children[0]].type === NodeType.Narrative
    )) {
      
    return false;
  }

  return fromNode !== toNode;
}

export const connectNodesOnGraph = (graph: Graph, fromNode: number, toNode: number): Graph => {
  if (isValidConnectNodes(graph, fromNode, toNode)) graph.nodeLookup[fromNode].childrenIds.push(toNode);

  return graph;
};

export const isValidDeleteEdge = (graph: Graph, fromNode: number, toNode: number): boolean => {
  const existsPath = (() => {
    const visited = new Set();
    const dfsExistsPath = (currId: number) => {
      if (currId === fromNode) return true;

      if (visited.has(currId)) return false;
      visited.add(currId);
  
      for (const childId of graph.nodeLookup[currId].childrenIds) {
        if (dfsExistsPath(childId)) return true;
      }
    };
    return dfsExistsPath(toNode);
  })();

  if (existsPath) {// then we are simply disconnecting a cycle
    return true;
  }

  let toNodeParentCount = 0;
  const visited = new Set();
  // count the number of parents ()
  const dfsIncrementParentCount = (currId: number) => {

    if (visited.has(currId)) return;
    visited.add(currId);

    for (const childId of graph.nodeLookup[currId].childrenIds) {
      if (childId === toNode) toNodeParentCount++;
      else dfsIncrementParentCount(childId);
    }
  };
  dfsIncrementParentCount(0);

  if (toNodeParentCount <= 1 && toNode != 0) return false; // disconnection would cause disconnected graph

  return true;
};

export const deleteEdgeOnGraph = (graph: Graph, fromNode: number, toNode: number): Graph => {
  const deleteEdge = () => {
    graph.nodeLookup[fromNode].childrenIds 
      = graph.nodeLookup[fromNode].childrenIds.filter((childNode) => {
        return childNode !== toNode;
      });
  };

  if (isValidDeleteEdge(graph, fromNode, toNode)) deleteEdge();

  return graph;
};
