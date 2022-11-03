import { Queue } from "queue-typescript";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Accordion, Container } from "react-bootstrap";
import useWebSocket from "react-use-websocket";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import GraphViz from "../components/GraphViz";
import LoadingMessage from "../components/LoadingMessage";
import StoryAccordionItem from "../components/StoryParagraph";
import { addLoadingSection, setNodeDataFromGPT } from "../features/storySlice";
import { graphToNodeData } from "../graph/graphUtils";
import { GraphMessage, NodeData, NodeDataMessage, SectionType } from "../graph/types";

const wsServerUrl: string = "wss://cyoa-api-prod.herokuapp.com/ws/";

const GeneratorView = () => {

  const storyGraph = useAppSelector((state) => state.story.graph);
  const loadingSections = useAppSelector(
    (state) => state.story.loadingSections
  );

  const dispatch = useAppDispatch();

  const story: NodeData[] = useMemo((): NodeData[] => {

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
        });
      }
    }

    return story;
  }, [storyGraph]);


  const { sendMessage, lastMessage } =
    useWebSocket(wsServerUrl, { shouldReconnect: () => true, });

  const sendExpandMessage = useCallback(
    (sectionType: SectionType, nodeToExpand: number) => {
    sendMessage(JSON.stringify({
      type: "expandNode",
      data: { nodeToExpand, nodes: graphToNodeData(storyGraph) }
    }));

    dispatch(addLoadingSection(sectionType));
  }, [storyGraph, sendMessage, dispatch])

  useEffect(() => {
    if (lastMessage !== null) {
      const resp = JSON.parse(lastMessage?.data) as GraphMessage
      dispatch(setNodeDataFromGPT(resp.nodes));
    }
  }, [lastMessage, dispatch])

  const [activeNodeId, setActiveNodeId] = useState<number | null>(0);

  const Graph = useMemo(() =>
    {
      return <GraphViz graph={storyGraph} setActiveNodeId={setActiveNodeId} />;
    },
    [storyGraph, setActiveNodeId]
  );

  return (
    <Container id="generator-section" className="wrapper">
      {Graph}
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
                    onGenerateParagraph={
                      () => sendExpandMessage(SectionType.Actions, section.nodeId)
                    }
                    onGenerateAction={sendExpandMessage}
                    activeNodeId={activeNodeId}
                    setActiveNodeId={setActiveNodeId}
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
