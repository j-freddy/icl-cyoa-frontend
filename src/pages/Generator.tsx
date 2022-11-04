import { Queue } from 'queue-typescript';
import { useCallback, useMemo, useState } from 'react';
import { Accordion, Container } from 'react-bootstrap';
// import useWebSocket from 'react-use-websocket';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import GraphViz from '../components/GraphViz';
import InputTextForm from '../components/InputTextForm';
import LoadingMessage from '../components/LoadingMessage';
import StoryAccordionItem from '../components/StoryParagraph';
import { addLoadingSection, setNodeDataFromGPT } from '../features/storySlice';
import { graphToNodeData } from '../graph/graphUtils';
import { Graph, GraphMessage, NodeData, NodeDataMessage, SectionType } from '../graph/types';
import '../style/base.css';

const wsServerUrl: string = "https://cyoa-api-int-stable.herokuapp.com/";

const GeneratorView = () => {

  const storyGraph = useAppSelector((state) => state.story.graph);
  const loadingSections = useAppSelector(
    (state) => state.story.loadingSections
  );
  const dispatch = useAppDispatch();

  const graphEmpty = useMemo(() => {
    return Object.keys(storyGraph.nodeLookup).length === 0;
  }, [storyGraph]);

  const sendMessage = useCallback(async (jsonMsg: string) => {
    const response = await fetch(wsServerUrl, {
      method: 'POST',
      body: jsonMsg,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    response.json()
      .then((graph: GraphMessage) => {
        dispatch(setNodeDataFromGPT(graph.nodes));
      });
  }, [dispatch]);

  const sendExpandMessage = useCallback(
    (sectionType: SectionType, nodeToExpand: number) => {
      sendMessage(JSON.stringify({
        type: "expandNode",
        data: { nodeToExpand, nodes: graphToNodeData(storyGraph) }
      }));

      dispatch(addLoadingSection(sectionType));
    }, [storyGraph, sendMessage, dispatch]);

  const sendEndPathMessage = useCallback((sectionType: SectionType, nodeToEnd: number) => {
    sendMessage(JSON.stringify({
      type: "endNode",
      data: { nodeToEnd, nodes: graphToNodeData(storyGraph) }
    }));
    dispatch(addLoadingSection(sectionType));
  }, [storyGraph, sendMessage, dispatch]);

  const handleGenerateText = (text: string) => {
    const root: NodeDataMessage = {
      nodeId: 0,
      action: null,
      paragraph: text,
      parentId: null,
      childrenIds: [],
      endingParagraph: false,
    }
    const graph: Graph = {
      nodeLookup: { 0: root },
    };

    dispatch(setNodeDataFromGPT([root]));

    sendMessage(JSON.stringify({
      type: "expandNode",
      data: { nodeToExpand: 0, nodes: graphToNodeData(graph) }
    }));

    dispatch(addLoadingSection(SectionType.Actions));
  };

  const story: NodeData[] = useMemo((): NodeData[] => {

    if (graphEmpty) return [];

    const record = storyGraph.nodeLookup;

    const story: NodeData[] = [];
    const queue = new Queue<NodeDataMessage>(record[0]);
    let currNode: NodeDataMessage;

    while (queue.length !== 0) {
      currNode = queue.dequeue();
      const actions: string[] = [];

      // Note: For loops are much faster than functional programming in Node.js
      for (const child of currNode.childrenIds) {
        queue.enqueue(record[child]);
        actions.push(record[child].action!);
      }

      if (currNode.paragraph !== null) {
        story.push({
          paragraph: currNode.paragraph,
          actions,
          nodeId: currNode.nodeId,
          parentId: currNode.parentId,
          childrenIds: currNode.childrenIds,
          endingParagraph: currNode.endingParagraph
        });
      }
    }

    return story;
  }, [storyGraph, graphEmpty]);

  const [activeNodeId, setActiveNodeId] = useState<number | null>(0);

  const FlowGraph = useMemo(() =>
    {
      return <GraphViz graph={storyGraph} setActiveNodeId={setActiveNodeId} />;
    },
    [storyGraph, setActiveNodeId]
  );

  if (graphEmpty) {
    return (
      <Container id="generator-section" className="wrapper">
        <InputTextForm handleGenerateText={handleGenerateText}/>
      </Container>
    );
  }

  return (
    <Container id="generator-section" className="wrapper">
      {FlowGraph}
      <Accordion activeKey={activeNodeId?.toString()} flush className="story-section">
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
                    parentId={section.parentId}
                    childrenIds={section.childrenIds}
                    endingParagraph={section.endingParagraph}
                    onGenerateParagraph={
                      () => sendExpandMessage(SectionType.Actions, section.nodeId)
                    }
                    onGenerateAction={sendExpandMessage}
                    activeNodeId={activeNodeId}
                    setActiveNodeId={setActiveNodeId}
                    //TODO
                    onGenerateEndingParagraph={sendEndPathMessage}
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
