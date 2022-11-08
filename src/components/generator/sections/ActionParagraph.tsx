import React, { useState } from 'react';
import { Button, Dropdown, ListGroup } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../app/hooks';
import { setGraph, setAction } from '../../../features/storySlice';
import { deleteNodeInPlace } from '../../../graph/graphUtils';
import { SectionType } from '../../../graph/types';
import { CustomToggle } from '../CustomDropdown';
import ToggleButton from '../ToggleButton';


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


const ActionParagraph = (props: ActionParagraphProps) => {

    const [text, setText] = useState(props.action);
    const [editable, changeEditable] = useState(false);

    const storyGraph = useAppSelector((state) => state.story.graph);
    const dispatch = useDispatch();
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setText(event.target.value);
    };

    const onGenerateClick = (): void => { props.onGenerateAction(SectionType.Paragraph, props.nodeId) }

    const onGenerateEndingClick = (): void => {
        props.onGenerateEndingParagraph(SectionType.Paragraph, props.nodeId);
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
                    <div className="edit-textarea-wrapper">
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

export default ActionParagraph;
