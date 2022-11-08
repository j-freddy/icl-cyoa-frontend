import './ToggleButton.css'
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { Button } from "react-bootstrap";

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
        <Button size="sm" variant="light" className="toolbar-button" onClick={onClick}>
            {props.children}
        </Button>
    );
};

export default ToggleButton;
