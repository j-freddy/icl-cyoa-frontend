import './GraphViz.css'
import {
  memo,
  useCallback,
  useMemo,
  useState
} from "react";
import ReactFlow, {
  Node,
  Edge,
  ConnectionLineType,
  Connection,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import {
  MdAlignHorizontalLeft,
  MdAlignVerticalTop
} from "react-icons/md";
import { Button } from '@mantine/core'
import { Graph } from '../../utils/graph/types';
import { getGraphNodesAndEdges } from './graph/graphViz';
import NarrativeFlowNode from './graph/FlowNodeNarrative';
import ActionFlowNode from './graph/FlowNodeAction';


enum Layout {
  LR = "LR",
  TB = "TB"
}

const nodeTypes = {
  narrative: NarrativeFlowNode,
  action: ActionFlowNode,
};


type GraphVizProps = {
  graph: Graph,
  setActiveNodeId: (nodeId: number) => void,
  onConnectNodes: (fromNode: number, toNode: number) => void,
};

const GraphViz = (props: GraphVizProps) => {
  return (
    <ReactFlowProvider>
      <GraphVizInner {...props}></GraphVizInner>
    </ReactFlowProvider>
  )
};

const GraphVizInner = (props: GraphVizProps) => {
  const { graph } = props;

  const [layout, setLayout] = useState<Layout>(Layout.LR);
  const reactFlowInstance = useReactFlow();


  const { nodes, edges } = useMemo(
    () => {
      // TODO: focus on newly generated nodes (and highlight them)
      // render component and then call fitView
      setTimeout(() => reactFlowInstance.fitView(), 0);

      return getGraphNodesAndEdges(layout, graph);
    },
    [layout, graph]
  );

  const onConnect = (params: Edge<any> | Connection) => {
    if (params.source && params.target) {
      props.onConnectNodes(parseInt(params.source), parseInt(params.target));
    }
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    props.setActiveNodeId(parseInt(node.id));
  }

  const onLayout = useCallback(
    (direction: Layout) => {
      setLayout(direction);
    },
    [setLayout]
  );


  return (
    <div className="layoutflow" style={{ height: 400 }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodeClick={onNodeClick}
        onNodeDragStart={onNodeClick}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitViewOptions={{
          minZoom: 120,
        }}
      />
      <div className="controls react-flow-ctrls">
        <Button onClick={() => onLayout(Layout.TB)}>
          <MdAlignVerticalTop />
        </Button>
        <Button onClick={() => onLayout(Layout.LR)}>
          <MdAlignHorizontalLeft />
        </Button>
      </div>
    </div>
  );
}

export default memo(GraphViz);
