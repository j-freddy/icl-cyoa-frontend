import { graphToGraphMessage } from '../graph/graphUtils';
import { Graph } from '../graph/types';

const API_URL: string = "https://cyoa-api-prod.herokuapp.com/";

export class API {

  static generateNode = async (graph: Graph, nodeToExpand: number) => {
    return fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: "expandNode",
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
        type: "expandNode",
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