import { Graph } from "../graph/types";

import dagre from 'dagre';

import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  Connection,
  Position,
} from 'reactflow';
import { useCallback, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";

type GraphVizProps = {
  graph: Graph,
  setActiveNodeId: (nodeId: number) => void
};

const GraphViz = (props: GraphVizProps) => {
  const { graph } = props;

  const edgeType = 'smoothstep';

  const { nodes: tempNodes, edges: tempEdges } = useMemo(() => {
    const position = { x: 0, y: 0 };

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const dfsBuildNodesAndEdges = (nodeId: number) => {

      const node = graph.nodeLookup[nodeId];

      if (node.paragraph) {
        nodes.push({
          id: nodeId.toString(),
          data: { label: node.paragraph.split(' ').slice(0, 8).join(' ') + "..." },
          position,
        });

        for (const childId of node.childrenIds) {
          edges.push({
            id: `e${nodeId}${childId}`, source: `${nodeId}`, target: `${childId}`, type: edgeType, animated: true
          });
          dfsBuildNodesAndEdges(childId);
        }
      }
    };

    dfsBuildNodesAndEdges(0);

    console.log({...nodes})

    return { nodes, edges };
  }, [graph]);

  const dagreGraph = useMemo(() => new dagre.graphlib.Graph(), []);
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 36;

  const getLayoutedElements = useCallback((nodes: Node[], edges: Edge[], direction = 'LR') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return { nodes, edges };
  }, [dagreGraph]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => getLayoutedElements(
    tempNodes,
    tempEdges
  ), [tempNodes, tempEdges, getLayoutedElements]);

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    useEffect(() => {
      setNodes(layoutedNodes);
    }, [layoutedNodes, setNodes]);

    useEffect(() => {
      setEdges(layoutedEdges);
    }, [layoutedEdges, setEdges]);

    const onConnect = useCallback(
      (params: Edge<any> | Connection) =>
        setEdges((eds) =>
          addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
        ),
      [setEdges]
    );

    const onLayout = useCallback(
      (direction: string | undefined) => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          nodes,
          edges,
          direction
        );

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
      },
      [nodes, edges, setNodes, setEdges, getLayoutedElements]
    );

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
      props.setActiveNodeId(parseInt(node.id));
    }

    return (
      <div className="layoutflow" style={{ height: 400 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          onNodeDragStart={onNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
        />
        <div className="controls">
          <Button onClick={() => onLayout('TB')}>vertical layout</Button>
          <Button onClick={() => onLayout('LR')}>horizontal layout</Button>
        </div>
      </div>
    );
}

export default GraphViz;
