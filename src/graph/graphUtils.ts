import { Graph, NodeDataMessage } from "./types";

export const nodeDataToGraph = (nodeDataList: NodeDataMessage[]): Graph => {
    const nodeLookup: Record<number, NodeDataMessage> = {};
    for (const nodeData of nodeDataList) {
        nodeLookup[nodeData.nodeId] = nodeData;
    }

    return { nodeLookup };
};

export const graphToNodeData = (graph: Graph): NodeDataMessage[] => {
    return Object.values(graph.nodeLookup);
};

export const deleteNodeInPlace = (graph: Graph, nodeId: number, keepParagraph: boolean): Graph => {
    let nodeLookup = {...graph.nodeLookup};

    const dfsDelete = (currId: number) => {
        const node = graph.nodeLookup[currId];

        if (currId === nodeId) {
            if (!keepParagraph) {
                nodeLookup = {...nodeLookup, [currId]: {...nodeLookup[currId], paragraph: null, childrenIds: []}};
            } else {
                nodeLookup = {...nodeLookup, [currId]: {...nodeLookup[currId], childrenIds: []}};
            }
        } else {
            // hack since we cant delete - probably has bad complexity
            const { [currId]: _, ...rest } = nodeLookup;  
            nodeLookup = rest;
        }

        for (const childId of node.childrenIds) {
            dfsDelete(childId);
        }
    }
    dfsDelete(nodeId);

    return { nodeLookup }

};
