export type NodeId = number

export type NodeData = {
    nodeId: number,

    action: string | null,
    paragraph: string,

    parentId: number | null,
    childrenIds: number[]
}
