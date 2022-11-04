import React, { useState } from 'react';
import { Accordion, Button, Dropdown, ListGroup } from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../app/hooks';
import { setAction, setGraph, setParagraph } from '../features/storySlice';
import { deleteNodeInPlace } from '../graph/graphUtils';
import { SectionType } from '../graph/types';
import { CustomToggle } from './CustomDropdown';
import { NodeData } from '../graph/types';

export interface StoryParagraphNodeData {
  nodeId: number,
  parentId: number | null,
  paragraph: string,
  actions: string[],
  childrenIds: number[],
};

// interface ChildParagraphProps {
//   key: number,
//   index: number,
//   nodeId: number,
//   action: string,
//   onGenerateAction: (sectionType: SectionType, nodeToExpand: number) => void,
//   activeNodeId: number | null,
//   setActiveNodeId: (nodeId: number | null) => void,
//   onGenerateEndingParagraph: (sectionType: SectionType, nodeToExpand: number) => void,
// };

export interface StoryItemProps extends NodeData {
  activeNodeId: number | null,
  setActiveNodeId: (nodeId: number | null) => void,
  onGenerateParagraph: () => void,
  onGenerateAction: (sectionType: SectionType, nodeToExpand: number) => void,
  onGenerateEndingParagraph: (sectionType: SectionType, nodeToExpand: number) => void,
};

interface ToggleButtonProps {
  // TODO: Change 'any'.
  children: any,
  eventKey: string,
};

interface ActionParagraphProps {
  key: number,
  index: number,
  nodeId: number,
  activeNodeId: number | null,
  action: string,
  onGenerateAction: (sectionType: SectionType, nodeToExpand: number) => void,
  onGenerateEndingParagraph: (sectionType: SectionType, nodeToExpand: number) => void,
  setActiveNodeId: (nodeId: number | null) => void,
};

interface StoryParagraphProps {
  text: string,
  nodeId: number,
  parentId: number | null,
  childrenIds: number[],
  onGenerateParagraph: (sectionType: SectionType, nodeToExpand: number) => void,
  setActiveNodeId: (nodeId: number | null) => void
}

function ToggleButton(props: ToggleButtonProps) {
  const onClick = useAccordionButton(
    props.eventKey,
    () => { },
  );

  return (
    <Button size="sm" variant="light" className="toolbar-button" onClick={onClick}>
      {props.children}
    </Button>
  );
};

const ActionParagraph = (props: ActionParagraphProps) => {

  const [text, setText] = useState(props.action);
  const [editable, changeEditable] = useState(false);

  const storyGraph = useAppSelector((state) => state.story.graph);
  const dispatch = useDispatch();
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };

  const onGenerateClick = () => { props.onGenerateAction(SectionType.Actions, props.nodeId) }
  const onGenerateEndingClick = () => {
  }
  const onEditClick = (): void => {
    changeEditable(true);
  };
  const onDoneClick = (): void => {
    // TODO: Change this.
    // Delete graph after this node.
    const newGraph = deleteNodeInPlace(storyGraph, props.nodeId, false);
    dispatch(setGraph(newGraph));
    dispatch(setAction({ nodeId: props.nodeId, action: text }));

    changeEditable(false);
  };

  return (
    <li
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      className="show-toggle"
    >
      {
        <Dropdown align={"start"} style={{ marginRight: '0.3em' }} drop={"start"}>
          <Dropdown.Toggle as={CustomToggle} variant="secondary">
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <ListGroup variant="flush">
              <ListGroup.Item className='action-item' action as={"button"} onClick={onGenerateClick}>Generate</ListGroup.Item>

              <ListGroup.Item className='action-item' action as={"button"} onClick={onEditClick}>Edit</ListGroup.Item>
              <ListGroup.Item className='action-item' action as={"button"} onClick={onGenerateEndingClick}>
                Generate Ending
              </ListGroup.Item>
              <ToggleButton eventKey={`${props.nodeId}`}>
                Go to child {props.nodeId}
              </ToggleButton>
            </ListGroup>
          </Dropdown.Menu>
        </Dropdown>
      }

      {
        editable
          ?
          <div>
            <textarea value={text} className="edit-textarea" onChange={handleTextChange} />
            <Button variant="light" onClick={onDoneClick} className="toolbar-button me-2">
              Done
            </Button>
          </div>
          : <p className='editable-text'>{text}</p>
      }
    </li >
  );
};


const StoryParagraph = (props: StoryParagraphProps) => {
  const [text, setText] = useState(props.text);
  const [editable, changeEditable] = useState(false);

  const storyGraph = useAppSelector((state) => state.story.graph);
  const dispatch = useDispatch();

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };

  const onGenerateClick = () => {
    props.onGenerateParagraph(SectionType.Actions, props.nodeId)
  }
  const onEditClick = (): void => {
    changeEditable(true);
  };
  const onDoneClick = (): void => {
    // TODO: Change this.
    // Delete graph after this node.
    const newGraph = deleteNodeInPlace(storyGraph, props.nodeId, true);
    dispatch(setGraph(newGraph));
    dispatch(setParagraph({ nodeId: props.nodeId, paragraph: text }));

    changeEditable(false);
  };

  const ParentButton = () => {
    return (
      <Button onClick={() => {if (props.parentId !== null) { props.setActiveNodeId(props.parentId) }}}>
        Go to parent
        {props.parentId}
      </Button>
    );
  }

  return (
    <div
      style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between', alignItems: 'center' }}
      className="show-toggle"
    >
      {
        <Dropdown style={{ marginRight: '0.5em' }}>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
          </Dropdown.Toggle>

          <Dropdown.Menu align={'start'}>
            <ListGroup variant="flush">
              <ListGroup.Item className='action-item' action as={"button"} onClick={onGenerateClick}>
                {props.childrenIds.length === 0 ? "Generate" : "Regenerate"}
              </ListGroup.Item>

              <ListGroup.Item className='action-item' action as={"button"} onClick={onEditClick}>Edit</ListGroup.Item>
              {props.parentId !== null ? <ParentButton />: <></>}
            </ListGroup>
          </Dropdown.Menu>

        </Dropdown>
      }
      {
        editable
          ? <div>
            <textarea value={text} className="edit-textarea" onChange={handleTextChange} />
            <Button variant="light" onClick={onDoneClick} className="toolbar-button me-2">
              Done
            </Button>
          </div>
          : <p className='editable-text'>{text}</p>
      }

    </div>
  );
};

const StoryAccordionItem = (props: StoryItemProps) => {
  return (
    <Accordion.Item eventKey={`${props.nodeId}`} id={`${props.nodeId}`}>
      <Accordion.Header onClick={() => 
          {props.setActiveNodeId(props.nodeId === props.activeNodeId ? null : props.nodeId)}}>
        Section {props.nodeId}
      </Accordion.Header>

      <Accordion.Body>
        <StoryParagraph
          text={props.paragraph}
          nodeId={props.nodeId}
          parentId={props.parentId}
          childrenIds={props.childrenIds}
          onGenerateParagraph={props.onGenerateParagraph}
          setActiveNodeId={props.setActiveNodeId}
        />

        <div className="story-options mt-2">
          <ul>
            {
              props.actions!.map((action, i) => {
                return (
                  <ActionParagraph
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
