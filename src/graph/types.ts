export type NodeId = number

export type NodeDataMessage = {
    nodeId: number,

    action: string | null,
    paragraph: string | null,

    parentId: number | null,
    childrenIds: number[],

    endingParagraph: boolean,
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
    endingParagraph: boolean,
};

export type Graph = {
    nodeLookup: Record<number, NodeDataMessage>
};


export enum SectionType {
    Paragraph = "paragraph",
    Actions = "actions",
};
