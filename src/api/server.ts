import { graphToGraphMessage } from "../utils/graph/graphUtils";
import { Graph } from "../utils/graph/types";

const API_URL: string = "https://cyoa-api-prod.herokuapp.com/";

export class API {

  static generateParagraph = async (graph: Graph, nodeToExpand: number) => {
    return fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: "generateNarrative",
        data: {
          nodeToExpand,
          graph: graphToGraphMessage(graph)
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  static generateActions = async (graph: Graph, nodeToExpand: number) => {
    return fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: "generateActions",
        data: {
          nodeToExpand,
          graph: graphToGraphMessage(graph)
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  static generateStartParagraph = async (prompt: string) => {
    return fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: "startNode",
        data: {
          prompt: prompt
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  static endPath = async (graph: Graph, nodeToEnd: number) => {
    return fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: "endNode",
        data: {
          nodeToEnd,
          graph: graphToGraphMessage(graph)
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  static connectNodes = async (graph: Graph, fromNode: number, toNode: number) => {
    return fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: "connectNode",
        data: {
          fromNode,
          toNode,
          graph: graphToGraphMessage(graph)
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
