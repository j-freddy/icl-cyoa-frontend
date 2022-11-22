import './Generator.css'
import '../../style/base.css';
import { Queue } from 'queue-typescript';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Accordion, Container } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectLoadingSection,
  selectStoryGraph,
  selectStoryId,
  selectStoryName,
  connectNodes,
  getGraph,
  saveName,
  setId,
  setName
} from '../../features/storySlice';
import {
  selectLoggedIn,
  selectSessionLoginFail,
  loginWithSession
} from '../../features/accountSlice';
import GraphViz from '../../components/generator/GraphViz';
import LoadingMessage from '../../components/generator/LoadingMessage';
import StoryAccordionItem from '../../components/generator/sections/StoryAccordionItem';
import Downloader from '../../components/generator/Downloader';
import { isAction } from '../../utils/graph/graphUtils';
import { StoryNode, NodeData, NodeId, NarrativeNode, SectionIdOrNull } from '../../utils/graph/types';
import { useNavigate } from 'react-router-dom';
import Saver from '../../components/generator/Saver';
import { EditableName } from '../../components/generator/EditableName';

const GeneratorView = () => {

  const loggedIn = useAppSelector(selectLoggedIn);
  const sessionLoginFail = useAppSelector(selectSessionLoginFail);

  const storyGraph = useAppSelector(selectStoryGraph);
  const loadingSection = useAppSelector(selectLoadingSection);
  const name = useAppSelector(selectStoryName);
  const storyId = useAppSelector(selectStoryId);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) dispatch(loginWithSession())
  }, [loggedIn, dispatch]);

  useEffect(() => {
    if (!loggedIn && sessionLoginFail) {
      navigate("/login");
    }
  }, [loggedIn, sessionLoginFail, navigate]);

  useEffect(() => {
    const url: string = window.location.href;
    const splitUrl = url.split('/');
    const id = splitUrl[splitUrl.length - 1];

    if (id !== null && id !== storyId) {
      dispatch(setId({ storyId: id }));
      dispatch(getGraph());
    }
  }, [dispatch, storyId]);

  const graphEmpty = useMemo(() => {
    return Object.keys(storyGraph.nodeLookup).length === 0;
  }, [storyGraph]);

  const sendConnectNodesMessage = useCallback(
    (fromNode: number, toNode: number) => {
      if (loadingSection !== null) return; // block other requests

      dispatch(connectNodes({ fromNode: fromNode, toNode: toNode }))
    }, [dispatch, loadingSection]);

  const onSaveName = useCallback((name: string) => {
    dispatch(setName(name));
    dispatch(saveName());
  }, [dispatch]);

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
      .find((parent: NodeData) => parent.childrenIds.includes(activeNodeId))!.nodeId

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

  const EditableNameComponent = useMemo(() => {
    return (
      <EditableName name={name} onSaveName={onSaveName} />
    )
  }, [name, onSaveName])

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
      {/* Editable Name */}
      {EditableNameComponent}

      {/* React Flow Graph */}
      {FlowGraph}

      {/* Save */}
      <div className="mb-5">
        <Saver />
      </div>

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
