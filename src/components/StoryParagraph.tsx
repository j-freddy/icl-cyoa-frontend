import { useState } from 'react';
import { Accordion, Button } from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../app/hooks';
import { setGraph, setAction, setParagraph } from '../features/storySlice';
import { deleteNodeInPlace } from '../graph/graphUtils';
import { SectionType } from '../graph/types';

export interface StoryParagraphNodeData {
  nodeId: number,
  parentId: number | null,
  paragraph: string,
  actions: string[],
  childrenIds: number[],
};

interface ChildParagraphProps {
  key: number,
  index: number,
  nodeId: number;
  action: string,
  onGenerateAction: (sectionType: SectionType, nodeToExpand: number) => void,
};

export interface StoryAccordionItemProps extends StoryParagraphNodeData {
  onGenerateParagraph: () => void,
  onGenerateAction: (sectionType: SectionType, nodeToExpand: number) => void,
};

interface ToggleButtonProps {
  // TODO: Change 'any'.
  children: any,
  eventKey: string,
};

function ToggleButton(props: ToggleButtonProps) {
  const onClick = useAccordionButton(
    props.eventKey,
    () => { },
  );

  return (
    <Button variant="light" className="toolbar-button" onClick={onClick}>
      {props.children}
    </Button>
  );
};

const ChildParagraph = (props: ChildParagraphProps) => {
  return (
    <li>
      <StoryParagraph text={props.action} editable={false} nodeId={props.nodeId} isAction={true}/>
      <Button className="toolbar-button me-2" variant="light" onClick={() => props.onGenerateAction(SectionType.Actions, props.nodeId)}>
        Generate
      </Button>
      <ToggleButton eventKey={`${props.nodeId}`}>
        Go to child {props.nodeId}
      </ToggleButton>
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
        dispatch(setAction({nodeId: props.nodeId, action: text}));
      } else {
        dispatch(setParagraph({nodeId: props.nodeId, paragraph: text}));
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

const StoryAccordionItem = (props: StoryAccordionItemProps) => {
  const GenerateButton = () => {
    return (
      <Button className="toolbar-button me-2" variant="light" onClick={props.onGenerateParagraph}>
        Generate
      </Button>
    );
  };

  const ParentButton = () => {
    return (
      <ToggleButton eventKey={`${props.parentId}`}>
        Go to parent
        {props.parentId}
      </ToggleButton>
    );
  };

  return (
    <Accordion.Item eventKey={`${props.nodeId}`} id={`${props.nodeId}`}>
      <Accordion.Header>
        Section {props.nodeId}
      </Accordion.Header>

      <Accordion.Body>
        <StoryParagraph text={props.paragraph} editable={false} nodeId={props.nodeId} isAction={false} />
        <GenerateButton />
        {props.parentId !== null && <ParentButton />}
        <div className="story-options mt-4">
          <ul>
            {
              props.actions.map((action, i) => {
                return (
                  <ChildParagraph
                    key={i}
                    index={i}
                    nodeId={props.childrenIds[i]}
                    action={action}
                    onGenerateAction={props.onGenerateAction}
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
