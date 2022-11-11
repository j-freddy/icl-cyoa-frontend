import './GraphViz.css'
import dagre from 'dagre';
import { MdAlignHorizontalLeft, MdAlignVerticalTop } from "react-icons/md";

import ReactFlow, {
  Node,
  Edge,
  ConnectionLineType,
  Connection,
  Position,
} from 'reactflow';
import { useCallback, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { Graph } from '../../graph/types';

enum Layout {
  LR = "LR",
  TB = "TB"
}

type GraphVizProps = {
  graph: Graph,
  setActiveNodeId: (nodeId: number) => void,
  onConnectNodes: (fromNode: number, toNode: number) => void,
};

const GraphViz = (props: GraphVizProps) => {
  const { graph } = props;

  const edgeType = 'smoothstep';

  const [layout, setLayout] = useState<Layout>(Layout.LR)

  const dagreGraph = useMemo(() => new dagre.graphlib.Graph(), []);
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const { nodes, edges } = useMemo(() => {
    const position = { x: 0, y: 0 };

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const dfsBuildNodesAndEdges = (nodeId: number) => {

      const node = graph.nodeLookup[nodeId];

      if (node.data) {
        nodes.push({
          id: nodeId.toString(),
          data: { label: node.data.split(' ').slice(0, 8).join(' ') + "..." },
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

  const nodeWidth = 172;
  const nodeHeight = 36;

    const isHorizontal = layout === Layout.LR;
    dagreGraph.setGraph({ rankdir: layout });

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
  }, [dagreGraph, layout, graph]);

  const onConnect =
    (params: Edge<any> | Connection) => {
      if (params.source && params.target) {
        props.onConnectNodes(parseInt(params.source), parseInt(params.target));
      }
    };

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
      props.setActiveNodeId(parseInt(node.id));
    }

    const onLayout = useCallback((direction: Layout) => {
      setLayout(direction);
    }, [setLayout]);

    return (
      <div className="layoutflow" style={{ height: 400 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          onNodeDragStart={onNodeClick}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
        />
        <div className="controls react-flow-ctrls">
          <Button variant="light" onClick={() => onLayout(Layout.TB)}>
            <MdAlignVerticalTop />
          </Button>
          <Button variant="light" onClick={() => onLayout(Layout.LR)}>
            <MdAlignHorizontalLeft />
          </Button>
        </div>
      </div>
    );
}

export default GraphViz;
