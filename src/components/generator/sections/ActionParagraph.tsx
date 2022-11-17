import React, { useState } from 'react';
import { Button, Dropdown, ListGroup } from "react-bootstrap";
import { useAppDispatch } from '../../../app/hooks';
import { generateEnding, generateParagraph, regenerateParagraph, setNodeData } from '../../../features/storySlice';
import { CustomToggle } from '../CustomDropdown';

import './ActionParagraph.css'

interface ActionParagraphProps {
  key: number,
  index: number,
  nodeId: number,
  activeNodeId: number | null,
  action: string,
  setActiveNodeId: (nodeId: number | null, goToChild: boolean) => void,
  buttonsDisabled: boolean,
};


const ActionParagraph = (props: ActionParagraphProps) => {
  const [text, setText] = useState(props.action);
  const [editable, changeEditable] = useState(false);

  const dispatch = useAppDispatch();

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };

  const onGenerateClick = (): void => {
    dispatch(generateParagraph(props.nodeId));
  };

  const onGenerateEndingClick = (): void => {
    dispatch(generateEnding(props.nodeId))
  };

  const onRegenerateClick = async () => {
    dispatch(regenerateParagraph(props.nodeId))
  };

  const onEditClick = (): void => {
    changeEditable(true);
  };

  const onDoneClick = (): void => {
    dispatch(setNodeData({ nodeId: props.nodeId, data: text }));
    changeEditable(false);
  };

  return (
    <li
      // This is OK since we can only override user agent stylesheet with inline
      // CSS
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      className="show-toggle"
    >
      {
        <Dropdown align={"start"} className="me-2" drop={"start"}>
          <Dropdown.Toggle as={CustomToggle} variant="secondary">
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <ListGroup variant="flush">
              <ListGroup.Item
                className='action-item'
                action as="button"
                disabled={props.buttonsDisabled}
                onClick={onGenerateClick}
              >
                Generate
              </ListGroup.Item>

              <ListGroup.Item
                className='action-item'
                action as="button"
                disabled={props.buttonsDisabled}
                onClick={onRegenerateClick}
              >
                Regenerate
              </ListGroup.Item>

              <ListGroup.Item
                className='action-item'
                action as="button"
                disabled={props.buttonsDisabled}
                onClick={onGenerateEndingClick}
              >
                Generate Ending
              </ListGroup.Item>

              <ListGroup.Item
                className='action-item'
                action as="button"
                disabled={props.buttonsDisabled}
                onClick={onEditClick}
              >
                Edit
              </ListGroup.Item>
              
              <ListGroup.Item
                className='action-item'
                action as="button"
                disabled={props.buttonsDisabled}
                onClick={() => { props.setActiveNodeId(props.nodeId, true) }}
              >
                Go to child {props.nodeId}
              </ListGroup.Item>
            </ListGroup>
          </Dropdown.Menu>
        </Dropdown>
      }

      {
        editable
          ?
          <div className="edit-textarea-wrapper">
            <textarea
              className="edit-textarea"
              value={text}
              onChange={handleTextChange}
            />
            <Button
              className="toolbar-button me-2"
              variant="light"
              disabled={props.buttonsDisabled}
              onClick={onDoneClick}
            >
              Done
            </Button>
          </div>
          : <p className='editable-text'>{text}</p>
      }
    </li >
  );
};

export default ActionParagraph;
