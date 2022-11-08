import React, { useState } from 'react';
import { Button, Dropdown, ListGroup } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../app/hooks';
import { setGraph, setParagraph } from '../../../features/storySlice';
import { deleteNodeInPlace } from '../../../graph/graphUtils';
import { SectionType } from '../../../graph/types';
import { CustomToggle } from '../CustomDropdown';

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

interface StoryParagraphProps {
  text: string,
  nodeId: number,
  parentId: number | null,
  childrenIds: number[],
  onGenerateParagraph: (sectionType: SectionType, nodeToExpand: number) => void,
  setActiveNodeId: (nodeId: number | null) => void
}

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
      <Button variant="light" onClick={() => { if (props.parentId !== null) { props.setActiveNodeId(props.parentId) } }}>
        Go to parent
        {props.parentId}
      </Button>
    );
  }

  return (
    <div
      style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}
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
              {props.parentId !== null ? <ParentButton /> : <></>}
            </ListGroup>
          </Dropdown.Menu>

        </Dropdown>
      }
      {
        editable
          ? <div className="edit-textarea-wrapper">
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

export default StoryParagraph;
