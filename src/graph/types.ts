export type NodeId = number;

export enum NodeType {
    Paragraph = "narrative",
    Action = "action"
}

export type NodeBase = {
    nodeId: NodeId,
    data: string,
    childrenIds: NodeId[],
    type: NodeType
};

export type NarrativeNode = NodeBase & {
    isEnding: boolean,
};

export type ActionNode = NodeBase;

export type NodeData = NarrativeNode | ActionNode;

export type GraphMessage = {
    nodes: NodeData[]
};

export type StoryNode = {
    nodeId: NodeId,

    paragraph: string,
    actions: string[],

    childrenIds: NodeId[],
    isEnding: boolean,
}

export type Graph = {
    nodeLookup: Record<NodeId, NodeData>
};

export enum LoadingType {
    GenerateParagraph = "paragraph",
    GenerateActions = "actions",
    GenerateEnding = "ending",
    ConnectingNodes = "connecting nodes",
};
