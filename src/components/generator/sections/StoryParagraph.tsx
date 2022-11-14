import React, { useState } from 'react';
import { Button, Dropdown, ListGroup } from "react-bootstrap";
import { useAppDispatch } from '../../../app/hooks';
import { generateActions, regenerateActions } from '../../../features/storySlice';
import { CustomToggle } from '../CustomDropdown';

export interface StoryParagraphNodeData {
  nodeId: number,
  parentId: number | null,
  paragraph: string,
  actions: string[],
  childrenIds: number[],
};

interface StoryParagraphProps {
  text: string,
  nodeId: number,
  childrenIds: number[],
}

const StoryParagraph = (props: StoryParagraphProps) => {
  const [text, setText] = useState(props.text);
  const [editable, changeEditable] = useState(false);

  const dispatch = useAppDispatch();


  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };


  const onGenerateClick = () => {
    dispatch(generateActions(props.nodeId));
  }
  const onRegenerateClick = () => {
    dispatch(regenerateActions(props.nodeId));
  }
  const onEditClick = (): void => {
    changeEditable(true);
  };
  const onDoneClick = (): void => {
    dispatch(regenerateActions(props.nodeId));
    changeEditable(false);
  };


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
              {
                props.childrenIds.length === 0
                  ?
                  <ListGroup.Item
                    className='action-item'
                    action as="button"
                    onClick={onGenerateClick}
                  >
                    Generate
                  </ListGroup.Item>
                  :
                  <ListGroup.Item
                    className='action-item'
                    action as="button"
                    onClick={onRegenerateClick}
                  >
                    Regenerate
                  </ListGroup.Item>
              }

              <ListGroup.Item
                className='action-item'
                action as="button"
                onClick={onEditClick}
              >
                Edit
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
              onClick={onDoneClick}
            >
              Done
            </Button>
          </div>
          :
          <p className='editable-text'>{text}</p>
      }

    </div>
  );
};

export default StoryParagraph;
