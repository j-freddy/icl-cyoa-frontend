import '../style/base.css';
import { Accordion, Container } from 'react-bootstrap';
import { NodeData, Graph, SectionType } from '../graph/types';
import StoryAccordionItem, { StoryParagraphNodeData } from '../components/StoryParagraph';
import useWebSocket from 'react-use-websocket';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addLoadingSection, setNodeDataFromGPT } from '../features/storySlice';
import { graphToNodeData } from '../graph/graphUtils';
import InputTextForm from '../components/InputTextForm';
import LoadingMessage from '../components/LoadingMessage';
import { Queue } from 'queue-typescript';

const wsServerUrl: string = "wss://cyoa-api-prod.herokuapp.com/ws/";
interface SocketResponse {
  nodes: NodeData[],
}

const GeneratorView = () => {

  const storyGraph = useAppSelector((state) => state.story.graph);
  const loadingSections = useAppSelector(
    (state) => state.story.loadingSections
  );
  const dispatch = useAppDispatch();

  const { sendMessage, lastMessage } = 
    useWebSocket(wsServerUrl, {shouldReconnect: () => true,});

  const sendExpandMessage = useCallback(
    (sectionType: SectionType, nodeToExpand: number) => {
    sendMessage(JSON.stringify({
      type: "expandNode",
      data: { nodeToExpand, nodes: graphToNodeData(storyGraph) }
    }));

    dispatch(addLoadingSection(sectionType));
  }, [storyGraph, sendMessage, dispatch])

  const handleGenerateText = (text: string) => {
    const root: NodeData = {
      nodeId: 0,
      action: null,
      paragraph: text,
      parentId: null,
      childrenIds: []
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

  useEffect(() => {
    if (lastMessage !== null) {
      const resp = JSON.parse(lastMessage?.data) as SocketResponse
      dispatch(setNodeDataFromGPT(resp.nodes));
    }
  }, [lastMessage, dispatch])

  const buildStoryFromGraph = (): StoryParagraphNodeData[] => {

    const record = storyGraph.nodeLookup;

    const story: StoryParagraphNodeData[] = [];
    const queue = new Queue<NodeData>(record[0]);
    let currNode: NodeData;

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
  }

  return (
    <Container id="generator-section" className="wrapper">
      <header id="generator-title">
        <h1>Enter a paragraph</h1>
      </header>
      <InputTextForm handleGenerateText={handleGenerateText} />
      {
        storyGraph.nodeLookup[0] &&
        (
          <Accordion defaultActiveKey="0" flush className="story-section">
            {
              buildStoryFromGraph().map((section, i) => {
                if (section.paragraph == null) {
                  return <div key={i}></div>;
                }
                return (
                  <StoryAccordionItem
                    key={i}
                    paragraph={section.paragraph}
                    actions={section.actions}
                    nodeId={section.nodeId}
                    parentId={section.parentId}
                    childrenIds={section.childrenIds}
                    onGenerateParagraph={
                      () => sendExpandMessage(SectionType.Paragraph, section.nodeId)
                    }
                    onGenerateAction={sendExpandMessage}
                  />
                );
              })
            }
          </Accordion>
        )
      }
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
};

export default GeneratorView;
