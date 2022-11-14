import { Graph, GraphMessage, NodeData, ActionNode, NarrativeNode, NodeId, NodeType } from "./types";

export const makeNarrativeNode = (params: Omit<NarrativeNode, "type">) => {
    return {
        type: NodeType.Paragraph,
        ...params
    }
};

export const makeActionNode = (params: Omit<ActionNode, "type">) => {
    return {
        type: NodeType.Action,
        ...params
    }
};

export const isAction = (node: NodeData) => {
    return node.type === NodeType.Action;
}

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
