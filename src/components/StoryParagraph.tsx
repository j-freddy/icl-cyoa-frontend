import { useState } from 'react';
import { Accordion, Button } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../app/hooks';
import { setGraph, setAction, setParagraph } from '../features/storySlice';
import { deleteNodeInPlace } from '../graph/graphUtils';
import { SectionType } from '../graph/types';
import { NodeData } from '../graph/types';

interface ChildParagraphProps {
  key: number,
  index: number,
  nodeId: number,
  action: string,
  onGenerateAction: (sectionType: SectionType, nodeToExpand: number) => void,
  activeNodeId: number | null,
  setActiveNodeId: (nodeId: number | null) => void,
  onGenerateEndingParagraph: (sectionType: SectionType, nodeToExpand: number) => void,
};

export interface StoryItemProps extends NodeData {
  activeNodeId: number | null,
  setActiveNodeId: (nodeId: number | null) => void,
  onGenerateParagraph: () => void,
  onGenerateAction: (sectionType: SectionType, nodeToExpand: number) => void,
  onGenerateEndingParagraph: (sectionType: SectionType, nodeToExpand: number) => void,
};

const ChildParagraph = (props: ChildParagraphProps) => {
  return (
    <li>
      <StoryParagraph text={props.action} editable={false} nodeId={props.nodeId} isAction={true} />
      <Button className="toolbar-button me-2" variant="light" onClick={() => props.onGenerateAction(SectionType.Paragraph, props.nodeId)}>
        Generate
      </Button>
      <Button className="toolbar-button me-2" variant="light" onClick={() => props.onGenerateEndingParagraph(SectionType.Paragraph, props.nodeId)}>
        End Path
      </Button>
      <Button onClick={() => props.setActiveNodeId(props.activeNodeId === props.nodeId ? null : props.nodeId)}>
        Go to child {props.nodeId}
      </Button>
    </li >
  );
};

interface StoryParagraphProps {
  text: string,
  editable: boolean,
  nodeId: number,
  isAction: boolean,
}

const StoryParagraph = (props: StoryParagraphProps) => {
  const [text, setText] = useState(props.text);
  const [editable, changeEditable] = useState(props.editable);

  const storyGraph = useAppSelector((state) => state.story.graph);
  const dispatch = useDispatch();

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };

  const handleEdit = (): void => {
    // delete graph after this node
    if (editable) {
      const newGraph = deleteNodeInPlace(storyGraph, props.nodeId, !props.isAction);
      dispatch(setGraph(newGraph));

      if (props.isAction) {
        dispatch(setAction({ nodeId: props.nodeId, action: text }));
      } else {
        dispatch(setParagraph({ nodeId: props.nodeId, paragraph: text }));
      }
    }

    changeEditable(!editable);
  };

  return (
    <>
      {
        editable
          ? <textarea value={text} className="edit-textarea" onChange={handleTextChange} />
          : <p>{text}</p>
      }
      <Button variant="light" onClick={handleEdit} className="toolbar-button me-2">
        {editable ? "Done" : "Edit"}
      </Button>
    </>
  );
};

const StoryAccordionItem = (props: StoryItemProps) => {
  const GenerateButton = () => {
    return (
      <Button className="toolbar-button me-2" variant="light" onClick={props.onGenerateParagraph}>
        Generate
      </Button>
    );
  };

  const ParentButton = () => {
    return (
      <Button onClick={() => {if (props.parentId !== null) { props.setActiveNodeId(props.parentId) }}}>
        Go to parent
        {props.parentId}
      </Button>
    );
  };

  return (
    <Accordion.Item eventKey={`${props.nodeId}`} id={`${props.nodeId}`}>
      <Accordion.Header onClick={() => 
          {props.setActiveNodeId(props.nodeId === props.activeNodeId ? null : props.nodeId)}}>
        Section {props.nodeId}
      </Accordion.Header>

      <Accordion.Body>
        <StoryParagraph text={props.paragraph} editable={false} nodeId={props.nodeId} isAction={false} />
        {!props.endingParagraph && <GenerateButton />}
        {props.parentId !== null && <ParentButton />}
        <div className="story-options mt-4">
          <ul>
            {
              props.actions!.map((action, i) => {
                return (
                  <ChildParagraph
                    key={i}
                    index={i}
                    nodeId={props.childrenIds[i]}
                    action={action}
                    onGenerateAction={props.onGenerateAction}
                    activeNodeId={props.activeNodeId}
                    setActiveNodeId={props.setActiveNodeId}
                    onGenerateEndingParagraph={props.onGenerateEndingParagraph}
                  />
                );
              })
            }
          </ul>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default StoryAccordionItem;
