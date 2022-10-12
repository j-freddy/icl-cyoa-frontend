export type NodeId = number

export type AdjacencyList = NodeId[]

export type NodeData = {
    action: string | null,
    paragraph: string
}

export type Graph = {
    adjacencyLists: AdjacencyList[],
    nodes: NodeData[]
}
