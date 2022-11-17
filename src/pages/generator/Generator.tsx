import './Generator.css'
import '../../style/base.css';
import { Queue } from 'queue-typescript';
import { useCallback, useMemo, useState } from 'react';
import { Accordion, Container } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { connectNodes } from '../../features/storySlice';
import GraphViz from '../../components/generator/GraphViz';
import LoadingMessage from '../../components/generator/LoadingMessage';
import StoryAccordionItem from '../../components/generator/sections/StoryAccordionItem';
import Downloader from '../../components/generator/Downloader';
import { isAction } from '../../utils/graph/graphUtils';
import { StoryNode, NodeData, NodeId, NarrativeNode, SectionIdOrNull } from '../../utils/graph/types';

const GeneratorView = () => {

  const storyGraph = useAppSelector((state) => state.story.graph);
  const loadingSection = useAppSelector(
    (state) => state.story.loadingSection
  );
  const dispatch = useAppDispatch();

  const graphEmpty = useMemo(() => {
    return Object.keys(storyGraph.nodeLookup).length === 0;
  }, [storyGraph]);

  const sendConnectNodesMessage = useCallback(
    (fromNode: number, toNode: number) => {
      if (loadingSection !== null) return; // block other requests

      dispatch(connectNodes({ fromNode: fromNode, toNode: toNode }))
    }, [dispatch, loadingSection]);


  const story: StoryNode[] = useMemo((): StoryNode[] => {

    if (graphEmpty) return [];

    const nodeLookup = storyGraph.nodeLookup;

    const story: StoryNode[] = [];
    const queue = new Queue<NodeData>(nodeLookup[0]);
    const visited = new Set<NodeId>();
    let narrativeNodeCount = 0;

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
      } else {
        narrativeNodeCount++;

        const narrativeNode = (currNode as NarrativeNode)

        const actions: string[] = [];
        const childrenSectionIds: SectionIdOrNull[] = [];

        // Note: For loops are much faster than functional programming in Node.js
        for (const childId of narrativeNode.childrenIds) {
          const child = nodeLookup[childId];
          queue.enqueue(child);

          if (isAction(child)) {
            actions.push(child.data);

            // Find section that action points to
            if (child.childrenIds.length > 0) {
              // Each action will correspond to 1 child only
              const childOfAction = nodeLookup[child.childrenIds[0]];

              // Verify that action points to a paragraph
              if (!isAction(childOfAction)) {
                const childParagraph = childOfAction as NarrativeNode;
                // Temporarily assign nodeId instead of sectionId, since
                // sectionId has not been assigned to all sections
                childrenSectionIds.push(childParagraph.nodeId);
              }
            } else {
              // Section has not been generated yet
              childrenSectionIds.push(null);
            }

            console.log(childrenSectionIds);
          }
        }

        if (narrativeNode.data !== null) {
          story.push({
            paragraph: narrativeNode.data,
            actions,
            nodeId: narrativeNode.nodeId,
            sectionId: narrativeNodeCount,
            childrenIds: narrativeNode.childrenIds,
            childrenSectionIds: childrenSectionIds,
            isEnding: narrativeNode.isEnding,
          });
        }
      }
    }

    // Update the node ids to be section ids
    for (const paragraphNode of story) {
      const updateIds: SectionIdOrNull[] = [];

      for (const id of paragraphNode.childrenSectionIds) {
        if (id == null) {
          updateIds.push(null);
        } else {
          const paragraphChildNode = story.find((node) => {
            return node.nodeId === id;
          });

          if (paragraphChildNode) {
            updateIds.push(paragraphChildNode.sectionId);
          }
        }
      }

      paragraphNode.childrenSectionIds = updateIds;
    }

    return story;
  }, [storyGraph, graphEmpty]);

  const [activeNodeId, setActiveNodeId] = useState<number | null>(0);

  const accordianActiveNode = useMemo(() => {
    if (activeNodeId === 0) return 0;
    if (activeNodeId === null) return null;

    const node: NodeData = storyGraph.nodeLookup[activeNodeId];
    if (isAction(node)) return Object.values(storyGraph.nodeLookup)
      .find((parent) => parent.childrenIds.includes(activeNodeId))!.nodeId
    return activeNodeId;
  }, [storyGraph, activeNodeId])

  const FlowGraph = useMemo(() => {
    if (graphEmpty) return <></>

    return (
      <GraphViz
        graph={storyGraph}
        setActiveNodeId={setActiveNodeId}
        onConnectNodes={sendConnectNodesMessage}
      />
    );
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

  return (
    <Container id="generator-section" className="wrapper">
      {/* React Flow Graph */}
      {FlowGraph}

      {/* Download */}
      <div className="mb-5">
        <Downloader story={story} />
      </div>

      {/* Accordions */}
      <Accordion activeKey={accordianActiveNode?.toString()} flush className="story-section">
        {
          story.map((section, i) => {
            if (section.paragraph == null) {
              return <div key={i}></div>;
            }
            return (
              <StoryAccordionItem
                key={section.nodeId}
                activeNodeId={accordianActiveNode}
                setActiveNodeId={storySetActiveNodeId}
                buttonsDisabled={loadingSection !== null}
                {...section}
              />
            );
          })
        }
      </Accordion>
      <>
        {
          loadingSection !== null &&
          <LoadingMessage
            sectionType={loadingSection}
          />
        }
      </>
    </Container>
  );
}

export default GeneratorView;
