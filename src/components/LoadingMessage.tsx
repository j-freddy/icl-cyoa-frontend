import { Badge } from "react-bootstrap";
import { SectionType } from "../graph/types";

interface LoadingMessageProps {
  sectionType: SectionType;
  numSections: number;
}

export default function LoadingMessage(props: LoadingMessageProps) {
  return (
    <div className="loading-message">
      <Badge bg="info">
        Generating {props.sectionType}... ({props.numSections} left)
      </Badge>
    </div>
  );
}
