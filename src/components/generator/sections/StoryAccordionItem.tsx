import { Accordion } from "react-bootstrap";
import StoryParagraph from './StoryParagraph';
import ActionParagraph from './ActionParagraph';
import { StoryNode } from "../../../utils/graph/types";

export interface StoryItemProps extends StoryNode {
  activeNodeId: number | null,
  setActiveNodeId: (nodeId: number | null) => void,
  buttonsDisabled: boolean,
};


const StoryAccordionItem = (props: StoryItemProps) => {
    return (
        <Accordion.Item eventKey={`${props.nodeId}`} id={`${props.nodeId}`}>
            <Accordion.Header onClick={() => { props.setActiveNodeId(props.nodeId === props.activeNodeId ? null : props.nodeId) }}>
                Section {props.sectionId}
            </Accordion.Header>

      <Accordion.Body>
        <StoryParagraph
          text={props.paragraph}
          nodeId={props.nodeId}
          childrenIds={props.childrenIds}
          buttonsDisabled={props.buttonsDisabled}
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
                    activeNodeId={props.activeNodeId}
                    setActiveNodeId={props.setActiveNodeId}
                    buttonsDisabled={props.buttonsDisabled}
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
