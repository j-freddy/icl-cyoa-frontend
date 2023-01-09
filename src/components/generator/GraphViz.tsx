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
  Panel,
} from 'reactflow';
import {
  MdAlignHorizontalLeft,
  MdAlignVerticalTop
} from "react-icons/md";
import { Button, Card, Checkbox, createStyles, Popover, Text, Title, UnstyledButton } from '@mantine/core'
import { getGraphNodesAndEdges } from './graph/graphViz';
import NarrativeFlowNode from './graph/FlowNodeNarrative';
import ActionFlowNode from './graph/FlowNodeAction';
import { IconInfoCircle } from '@tabler/icons';
import { mantineBlue } from '../../utils/utils';
import { selectLoadingType, selectStoryGraph } from '../../store/features/storySlice';
import { useAppSelector } from '../../store/hooks';
import { isValidConnectNodes, isValidDeleteEdge } from '../../utils/graph/graphUtils';


enum Layout {
  LR = "LR",
  TB = "TB"
}

const nodeTypes = {
  narrative: NarrativeFlowNode,
  action: ActionFlowNode,
};

type GraphVizProps = {
  setActiveNodeId: (nodeId: number) => void,
  onConnectNodes: (fromNode: number, toNode: number, generateMiddleNode: boolean) => void,
  onEdgeDelete: (fromNode: number, toNode: number) => void,
};

type ConnectingData = {
  fromNode: number, toNode: number
};

type DeleteEdgeData = {
  fromNode: number, toNode: number
};

const GraphViz = (props: GraphVizProps) => {
  return (
    <ReactFlowProvider>
      <GraphVizInner {...props}></GraphVizInner>
    </ReactFlowProvider>
  )
};

const GraphVizInner = (props: GraphVizProps) => {
  const graph = useAppSelector(selectStoryGraph);

  const loadingType = useAppSelector(selectLoadingType);
  const actionsDisabled = useMemo(() => loadingType !== null, [loadingType]);

  const [layout, setLayout] = useState<Layout>(Layout.LR);
  const [connectingData, setConnectingData] = useState<ConnectingData | null>(null);
  const [deleteEdgeData, setDeleteEdgeData] = useState<DeleteEdgeData | null>(null);

  const reactFlowInstance = useReactFlow();

  const [generateMiddleNode, setGenerateMiddleNode] = useState(false);

  const InformationDisplay = useCallback(() => {
    return (
      <Popover position="bottom" withArrow shadow="md">
        <Popover.Target>
          <UnstyledButton>
            <IconInfoCircle size={32} color={mantineBlue}/>
          </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
        <Title order={6}><Text span variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }} inherit>Connect nodes </Text>
        by dragging the cursor from one handle to another.</Title>
        <Title order={6}>
          <Text span variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }} inherit>Disconnect nodes </Text> 
          by clicking on an edge and pressing delete.
        </Title>
        </Popover.Dropdown>
      </Popover>
    )
  }, []);

  const onConnectClick = useCallback(() => {
    if (connectingData === null) return;

    props.onConnectNodes(connectingData.fromNode, connectingData.toNode, generateMiddleNode);
    setConnectingData(null);
  }, [generateMiddleNode, connectingData, setConnectingData]);

  const onCancelClick = useCallback(() => {
    setConnectingData(null);
    setDeleteEdgeData(null);
  }, [setConnectingData, setDeleteEdgeData]);

  const onDeleteEdge = useCallback(() => {
    if (deleteEdgeData === null) return;

    props.onEdgeDelete(deleteEdgeData.fromNode, deleteEdgeData.toNode);
    setDeleteEdgeData(null);
  }, [deleteEdgeData, setDeleteEdgeData]);

  const ConnectDisplay = useCallback(() => {

    return <Card>
      <Checkbox checked={generateMiddleNode} 
        onChange={() => setGenerateMiddleNode(prev => !prev)}
        label='Generate middle node'
      />
      <Button disabled={actionsDisabled} onClick={onConnectClick} className="mx-2" variant='light'>Connect</Button>
      <Button onClick={onCancelClick} className="mx-2" variant='light'>Cancel</Button>
    </Card>
  }, [connectingData, generateMiddleNode, setGenerateMiddleNode, onConnectClick, onCancelClick, actionsDisabled]);

  const DeleteEdgeDisplay = useCallback(() => {
    return <>
      <Button disabled={actionsDisabled} onClick={onDeleteEdge} className="mx-2" variant='light'>Delete edge</Button>
    </>
  }, [deleteEdgeData, onCancelClick, onDeleteEdge, actionsDisabled]);

  const { nodes, edges } = useMemo(
    () => {
      // TODO: focus on newly generated nodes (and highlight them)
      // render component and then call fitView
      setTimeout(() => reactFlowInstance.fitView(), 10);

      return getGraphNodesAndEdges(layout, graph);
    },
    [layout, graph]
  );

  const onConnect = useCallback((params: Edge<any> | Connection) => {
    if (params.source && params.target) {
      const fromNode = parseInt(params.source);
      const toNode = parseInt(params.target);
      if (isValidConnectNodes(graph, fromNode, toNode)) {
        // only display popup if this is valid connection
        setDeleteEdgeData(null);
        setConnectingData({
          fromNode,
          toNode
        })
      }
    }
  }, [setConnectingData, setDeleteEdgeData, graph]);

  const onEdgeClick = useCallback((edge: Edge) => {
      if (!edge.source || !edge.target || connectingData !== null) {
        setDeleteEdgeData(null);
        return;
      }
      const fromNode = parseInt(edge.source);
      const toNode = parseInt(edge.target);

      if (!isValidDeleteEdge(graph, fromNode, toNode)) {
        setDeleteEdgeData(null); // only display popup if valid disconnection
        return;
      }
      
      setDeleteEdgeData({ fromNode, toNode });
  }, [graph, connectingData, setDeleteEdgeData]);

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
        onEdgeClick={(_, edge) => onEdgeClick(edge)}
        connectionLineType={ConnectionLineType.SmoothStep}
        onInit={() => {reactFlowInstance.fitView();}}
        fitViewOptions={{
          minZoom: 120,
        }}
      >
        <Panel position="top-left">
          {
            connectingData === null ? 
              (<>
              <InformationDisplay/> {deleteEdgeData === null || <DeleteEdgeDisplay/>}</>)
              :
              <ConnectDisplay />
          }
        </Panel>
      </ReactFlow>
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
