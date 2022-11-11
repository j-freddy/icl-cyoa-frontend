import { Accordion } from "react-bootstrap";
import StoryParagraph from './StoryParagraph';
import ActionParagraph from './ActionParagraph';
import { SectionType, StoryNode } from "../../../graph/types";

export interface StoryItemProps extends StoryNode {
    activeNodeId: number | null,
    setActiveNodeId: (nodeId: number | null) => void,
    onGenerateParagraph: () => void,
    onGenerateAction: (sectionType: SectionType, nodeToExpand: number) => void,
    onGenerateEndingParagraph: (sectionType: SectionType, nodeToExpand: number) => void,
};


const StoryAccordionItem = (props: StoryItemProps) => {
    return (
        <Accordion.Item eventKey={`${props.nodeId}`} id={`${props.nodeId}`}>
            <Accordion.Header onClick={() => { props.setActiveNodeId(props.nodeId === props.activeNodeId ? null : props.nodeId) }}>
                Section {props.nodeId}
            </Accordion.Header>

            <Accordion.Body>
                <StoryParagraph
                    text={props.paragraph}
                    nodeId={props.nodeId}
                    childrenIds={props.childrenIds}
                    onGenerateParagraph={props.onGenerateParagraph}
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
