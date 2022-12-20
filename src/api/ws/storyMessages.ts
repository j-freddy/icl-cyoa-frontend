import { graphToGraphMessage } from "../../utils/graph/graphUtils";
import { Graph } from "../../utils/graph/types";


export const generateParagraphMsg = (
  graph: Graph,
  nodeToExpand: number
) => {
  return JSON.stringify({
    type: "generateNarrative",
    data: {
      nodeToExpand,
      graph: graphToGraphMessage(graph),
      isEnding: false,
      descriptor: null,
    },
  })
};


export const generateStartParagraphMsg = (prompt: string) => {
  return JSON.stringify({
    type: "startNode",
    data: {
      prompt: prompt,
    }
  })
};


export const generateStoryWithAdvancedInputMsg = (
  values: { attribute: string, content: string }[]
) => {
  return JSON.stringify({
    type: "initialStory",
    data: {
      prompt: values,
    },
  })
};


export const generateActionsMsg = (
  graph: Graph,
  nodeToExpand: number
) => {
  return JSON.stringify({
    type: "generateActions",
    data: {
      nodeToExpand,
      graph: graphToGraphMessage(graph),
    },
  })
};


export const generateEndingMsg = (
  graph: Graph,
  nodeToEnd: number
) => {
  return JSON.stringify({
    type: "generateNarrative",
    data: {
      nodeToExpand: nodeToEnd,
      graph: graphToGraphMessage(graph),
      isEnding: true,
      descriptor: null,
    },
  })
};


export const connectNodesMsg = (
  graph: Graph,
  fromNode: number,
  toNode: number
) => {
  return JSON.stringify({
    type: "connectNode",
    data: {
      fromNode,
      toNode,
      graph: graphToGraphMessage(graph),
    },
  })
};

export const generateManyMsg = (
  graph: Graph,
  fromNode: number,
  maxDepth: number,
  saveToId: string,
) => {
  return JSON.stringify({
      type: "generateMany",
      data: {
          graph: graphToGraphMessage(graph),
          fromNode,
          maxDepth,
          saveToId,
      },
  })
};
