export type NodeId = number

export type NodeDataMessage = {
    nodeId: number,

    action: string | null,
    paragraph: string | null,

    parentId: number | null,
    childrenIds: number[]
}

export type GraphMessage = {
    nodes: NodeDataMessage[]
}

export type NodeData = {
    nodeId: number,
    parentId: number | null,
    paragraph: string,
    actions: string[] | null,
    childrenIds: number[],
};

export type Graph = {
    nodeLookup: Record<number, NodeDataMessage>
};


export enum SectionType {
    Paragraph = "paragraph",
    Actions = "actions",
}
