import './Generator.css'
import '../../style/base.css';
import { Queue } from 'queue-typescript';
import { useCallback, useMemo, useState } from 'react';
import { Accordion, Container } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { connectNodes } from '../../features/storySlice';
import { isAction, makeNarrativeNode } from '../../graph/graphUtils';
import { Graph, NarrativeNode, NodeData, NodeId, StoryNode } from '../../graph/types';
import GraphViz from '../../components/generator/GraphViz';
import LoadingMessage from '../../components/generator/LoadingMessage';
import StoryAccordionItem from '../../components/generator/sections/StoryAccordionItem';

const GeneratorView = () => {

  const storyGraph = useAppSelector((state) => state.story.graph);
  const loadingSections = useAppSelector(
    (state) => state.story.loadingSections
  );
  const dispatch = useAppDispatch();

  const graphEmpty = useMemo(() => {
    return Object.keys(storyGraph.nodeLookup).length === 0;
  }, [storyGraph]);

  const sendConnectNodesMessage = useCallback(
    (fromNode: number, toNode: number) => {
      dispatch(connectNodes({ fromNode: fromNode, toNode: toNode }))
    }, [dispatch]);


  const story: StoryNode[] = useMemo((): StoryNode[] => {

    if (graphEmpty) return [];

    const nodeLookup = storyGraph.nodeLookup;

    const story: StoryNode[] = [];
    const queue = new Queue<NodeData>(nodeLookup[0]);
    const visited = new Set<NodeId>();

    while (queue.length !== 0) {
      const currNode = queue.dequeue();

      if (currNode === undefined || visited.has(currNode.nodeId)) continue;

      visited.add(currNode.nodeId);

      if (isAction(currNode)) {
        // just recurse since we already added the action text
        for (const childId of currNode.childrenIds) {
          const child = nodeLookup[childId];
          queue.enqueue(child);
        }
        continue;
      }

      const narrativeNode = (currNode as NarrativeNode)

      const actions: string[] = [];

      // Note: For loops are much faster than functional programming in Node.js
      for (const childId of narrativeNode.childrenIds) {
        const child = nodeLookup[childId];
        queue.enqueue(child);
        if (isAction(child)) {
          actions.push(child.data);
        }
      }

      if (narrativeNode.data !== null) {
        story.push({
          paragraph: narrativeNode.data,
          actions,
          nodeId: narrativeNode.nodeId,
          childrenIds: narrativeNode.childrenIds,
          isEnding: narrativeNode.isEnding
        });
      }
    }

    return story;
  }, [storyGraph, graphEmpty]);

  const [activeNodeId, setActiveNodeId] = useState<number | null>(0);

  const accordianActiveNode = useMemo(() => {
    if (activeNodeId === 0) return 0;
    if (activeNodeId === null) return null;

    const node = storyGraph.nodeLookup[activeNodeId];
    if (isAction(node)) return Object.values(storyGraph.nodeLookup)
      .find((parent) => parent.childrenIds.includes(activeNodeId))!.nodeId
    return activeNodeId;
  }, [storyGraph, activeNodeId])

  const FlowGraph = useMemo(() => {
    if (graphEmpty) return <></>

    return <GraphViz graph={storyGraph} setActiveNodeId={setActiveNodeId} onConnectNodes={sendConnectNodesMessage} />;
  },
    [storyGraph, setActiveNodeId, graphEmpty, sendConnectNodesMessage]
  );

  const storySetActiveNodeId = useCallback((nodeId: NodeId | null) => {
    if (!nodeId) {
      setActiveNodeId(null);
      return;
    }

    const node = storyGraph.nodeLookup[nodeId];

    if (isAction(node)) {
      const children = node.childrenIds;


      if (children.length === 0) {
        setActiveNodeId(null);
        return;
      }

      nodeId = node.childrenIds[0];
    }
    setActiveNodeId(nodeId);
  }, [storyGraph, setActiveNodeId]);

  if (graphEmpty) {
    // An empty initial graph means that the initial paragraph is being generated
    const root: NarrativeNode = makeNarrativeNode({
      nodeId: 0,
      data: "",
      childrenIds: [],
      isEnding: false,
    });
    const emptyGraph: Graph = {
      nodeLookup: { 0: root },
    };

    return (
      <Container id="generator-section" className="wrapper">
        <GraphViz graph={emptyGraph} setActiveNodeId={setActiveNodeId} onConnectNodes={sendConnectNodesMessage} />
        <Accordion flush className="story-section">
          <StoryAccordionItem
            key={0}
            paragraph={""}
            actions={[]}
            nodeId={0}
            childrenIds={[]}
            isEnding={false}
            activeNodeId={accordianActiveNode}
            setActiveNodeId={storySetActiveNodeId}
          />
        </Accordion>
      </Container>
    );
  }

  return (
    <Container id="generator-section" className="wrapper">
      {FlowGraph}
      <Accordion activeKey={accordianActiveNode?.toString()} flush className="story-section">
        {
          story.map((section, i) => {
            if (section.paragraph == null) {
              return <div key={i}></div>;
            }
            return (
              <StoryAccordionItem
                key={section.nodeId}
                paragraph={section.paragraph}
                actions={section.actions}
                nodeId={section.nodeId}
                childrenIds={section.childrenIds}
                isEnding={section.isEnding}
                activeNodeId={accordianActiveNode}
                setActiveNodeId={storySetActiveNodeId}
              />
            );
          })
        }
      </Accordion>
      <>
        {
          loadingSections.length > 0 &&
          <LoadingMessage
            sectionType={loadingSections[0]}
            numSections={loadingSections.length}
          />
        }
      </>
    </Container>
  );
}

export default GeneratorView;
