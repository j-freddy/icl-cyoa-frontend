import { NodeData } from "./types";

export class Graph {
    nodeLookup: Record<number, NodeData> = {};

    constructor (graphData: NodeData[]) {
        for (const nodeData of graphData) {
            this.nodeLookup[nodeData.nodeId] = nodeData;
        }
    }
}
